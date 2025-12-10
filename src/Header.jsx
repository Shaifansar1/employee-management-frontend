// src/Header.jsx
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "./store/slices/authSlice";

export default function Header() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    dispatch(logout());
    navigate("/login");
  }

  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h4 className="mb-0">👤 Employee Management</h4>

      {auth.token && (
        <div>
          <span className="me-3">
            Hello, {auth.user?.fullName || auth.user?.email}
          </span>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
