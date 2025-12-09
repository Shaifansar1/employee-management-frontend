import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  fetchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../api/employeeApi";

function EmployeePage() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    id: 0,
    name: "",
    email: "",
    department: "",
    salary: "",
  });

  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  // =========================
  // LOAD DATA FROM .NET API
  // =========================
  useEffect(() => {
    loadEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page, limit]);

  async function loadEmployees() {
    try {
      const result = await fetchEmployees({
        search,
        page,
        pageSize: limit,
      });

      setEmployees(result.data || []);
      setTotalCount(result.totalCount || 0);
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to fetch employees", "error");
    }
  }

  function resetForm() {
    setForm({
      id: 0,
      name: "",
      email: "",
      department: "",
      salary: "",
    });
    setEditId(null);
    setShowModal(false);
  }

  function validateForm() {
    if (!form.name.trim() || !form.email.trim()) {
      return "Name and Email are required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      return "Invalid email format";
    }

    if (!form.salary) return "Salary is required";

    const salaryNum = Number(form.salary);
    if (Number.isNaN(salaryNum) || salaryNum <= 0) {
      return "Salary must be a positive number";
    }

    return "";
  }

  async function handleSubmit() {
    const validationError = validateForm();
    if (validationError) {
      return Swal.fire("Validation!", validationError, "warning");
    }

    const payload = {
      id: editId || 0,
      name: form.name.trim(),
      email: form.email.trim(),
      department: form.department.trim(),
      salary: Number(form.salary),
    };

    try {
      if (editId) {
        await updateEmployee(editId, payload);
        Swal.fire("Updated!", "Employee updated successfully", "success");
      } else {
        await createEmployee(payload);
        Swal.fire("Added!", "Employee added successfully", "success");
      }

      await loadEmployees();
      resetForm();
    } catch (err) {
      Swal.fire("Error!", err.message || "Failed to save employee", "error");
    }
  }

  async function handleDelete(id, name) {
    const result = await Swal.fire({
      title: `Delete ${name}?`,
      text: "This cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteEmployee(id);
      await loadEmployees();
      Swal.fire("Deleted!", "Employee has been deleted.", "success");
    } catch (err) {
      Swal.fire("Error!", err.message || "Failed to delete employee", "error");
    }
  }

  function handleEdit(emp) {
    setEditId(emp.id);
    setForm({
      id: emp.id,
      name: emp.name || "",
      email: emp.email || "",
      department: emp.department || "",
      salary: emp.salary?.toString() || "",
    });
    setShowModal(true);
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  return (
    <>
      <style>{`
        .search-input {
            width: 25% !important;
        }
        .limit-select {
            width: auto !important;
        }

        @media (min-width: 768px) {
            .modal-dialog {
            max-width: 40% !important;
            }
        }

        @media (max-width: 768px) {
            .search-input {
            width: 70% !important;
            }
            .limit-select {
            width: 30% !important;
            }
        }
        `}</style>

      <div className="mt-2">
        {/* Header */}
        <div className="d-flex justify-content-between mb-3">
          <h4>👤 Employee Management</h4>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            ➕ Add Employee
          </button>
        </div>

        {/* Search + page size */}
        <div className="d-flex justify-content-between mb-2 gap-2 flex-nowrap">
          <input
            type="text"
            className="form-control search-input"
            placeholder="🔍 Search name/email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <select
            className="form-select limit-select"
            value={limit}
            onChange={(e) => {
              setLimit(+e.target.value);
              setPage(1);
            }}
          >
            <option value={10}>10/page</option>
            <option value={20}>20/page</option>
          </select>
        </div>

        {/* Table */}
        <table className="table table-bordered table-sm">
          <thead className="table-light">
            <tr>
              <th>Sr No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Salary</th>
              <th style={{ width: "170px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, index) => (
              <tr key={emp.id}>
                <td>{(page - 1) * limit + index + 1}</td>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.department}</td>
                <td>{emp.salary}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => handleEdit(emp)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(emp.id, emp.name)}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}

            {employees.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center">
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination like reference (1,2,3...) */}
        <div className="d-flex justify-content-center mt-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`btn btn-sm ${
                page === p ? "btn-dark" : "btn-light"
              } mx-1`}
              onClick={() => setPage(p)}
              disabled={page === p}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <>
            <div
              className="modal fade show"
              style={{ display: "block" }}
              tabIndex="-1"
            >
              <div
                className="modal-dialog modal-lg modal-dialog-centered"
                style={{ maxWidth: "60%", width: "100%" }}
              >
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      {editId ? "Edit Employee" : "Add Employee"}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={resetForm}
                    ></button>
                  </div>

                  {/* ✅ Two-column layout like your reference */}
                  <div className="modal-body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter full name"
                          value={form.name}
                          onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Email Address</label>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Enter email address"
                          value={form.email}
                          onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Department</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter department"
                          value={form.department}
                          onChange={(e) =>
                            setForm({ ...form, department: e.target.value })
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Salary</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Enter salary"
                          value={form.salary}
                          onChange={(e) =>
                            setForm({ ...form, salary: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={resetForm}>
                      Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleSubmit}>
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-backdrop fade show"></div>
          </>
        )}
      </div>
    </>
  );
}

export default EmployeePage;
