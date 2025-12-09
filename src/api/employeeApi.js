const API_BASE_URL = "https://localhost:7169/api";

export async function fetchEmployees({ search = "", page = 1, pageSize = 5 }) {
  const params = new URLSearchParams({
    search,
    page,
    pageSize,
  });

  const res = await fetch(`${API_BASE_URL}/Employees?${params.toString()}`);
  if (!res.ok) {
    throw new Error("Failed to fetch employees");
  }
  return res.json(); // { data, page, pageSize, totalCount }
}

export async function createEmployee(employee) {
  const res = await fetch(`${API_BASE_URL}/Employees`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employee),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Failed to create employee");
  }

  return res.json();
}

export async function updateEmployee(id, employee) {
  const res = await fetch(`${API_BASE_URL}/Employees/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employee),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Failed to update employee");
  }
}

export async function deleteEmployee(id) {
  const res = await fetch(`${API_BASE_URL}/Employees/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Failed to delete employee");
  }
}
