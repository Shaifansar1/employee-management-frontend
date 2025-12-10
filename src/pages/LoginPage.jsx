import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { login } from "../store/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      return Swal.fire(
        "Validation",
        "Email and password are required",
        "warning"
      );
    }

    try {
      setLoading(true);
      const res = await dispatch(login(form));
      setLoading(false);

      if (res.error) {
        Swal.fire(
          "Error",
          res.payload || res.error.message || "Login failed",
          "error"
        );
      } else {
        Swal.fire("Welcome", "Login successful", "success");
        navigate("/");
      }
    } catch (err) {
      setLoading(false);
      Swal.fire("Error", err.message || "Login failed", "error");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-inner">
        {/* LEFT SIDE BRANDING */}
        <section className="auth-hero">
          <div className="auth-logo-box">
            <span className="auth-logo-letter">S</span>
          </div>
          <div className="auth-hero-title">Shiwansh Solutions</div>
          <div className="auth-hero-subtitle">Employee Management System</div>
          <div className="auth-hero-tagline">✳️ Together we achieve more.</div>

          <div className="auth-hero-footer">
            Secure access to manage employees, salaries and departments from one
            place.
          </div>
        </section>

        {/* RIGHT SIDE LOGIN CARD */}
        <section className="auth-card-wrapper">
          <div className="auth-card">
            <h2 className="auth-card-title">Login to EMS</h2>

            <form onSubmit={submit}>
              {/* Email */}
              <div className="mb-1">
                <div className="auth-label">Email</div>
                <div className="auth-input-group">
                  <div className="auth-input-icon-box">✉️</div>
                  <input
                    className="auth-input-field"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-2">
                <div className="auth-label">Password</div>
                <div className="auth-input-group">
                  <div className="auth-input-icon-box">🔒</div>
                  <input
                    className="auth-input-field"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                  />
                  <div
                    className="auth-input-right"
                    onClick={() => setShowPassword((v) => !v)}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="auth-primary-btn"
                disabled={loading}
              >
                <span>🔓</span>
                <span>{loading ? "Logging in..." : "LOGIN"}</span>
              </button>
            </form>

            <div className="auth-secondary-row">
              Don&apos;t have an account? <Link to="/register">Create one</Link>
            </div>
          </div>
        </section>
      </div>

      <div className="auth-credit">⚡ Developed by Shaif</div>
    </div>
  );
}
