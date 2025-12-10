// src/api/employeeApi.js
import API from "./authApi"; // 👈 reuse the same axios instance

export async function fetchEmployees({ search = "", page = 1, pageSize = 5 }) {
  const res = await API.get("/Employees", {
    params: { search, page, pageSize },
  });

  // API returns { data, page, pageSize, totalCount }
  return res.data;
}

export async function createEmployee(employee) {
  const res = await API.post("/Employees", employee);
  return res.data;
}

export async function updateEmployee(id, employee) {
  await API.put(`/Employees/${id}`, employee);
}

export async function deleteEmployee(id) {
  await API.delete(`/Employees/${id}`);
}
