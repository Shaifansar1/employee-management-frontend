// src/App.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./Header";
import EmployeePage from "./components/EmployeePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

export default function App() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className={isAuthPage ? "" : "container-fluid mt-4 px-4"}>
      {/* No header on auth pages */}
      {!isAuthPage && <Header />}

      <Routes>
        <Route path="/" element={<EmployeePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </div>
  );
}
