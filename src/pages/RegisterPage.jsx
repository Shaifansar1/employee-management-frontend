import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { register } from "../store/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password) {
      return Swal.fire("Validation", "All fields are required", "warning");
    }

    try {
      setLoading(true);
      const res = await dispatch(
        register({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
        })
      );
      setLoading(false);

      if (res.error) {
        Swal.fire(
          "Error",
          res.payload || res.error.message || "Registration failed",
          "error"
        );
      } else {
        Swal.fire("Success", "Account created. Please login.", "success");
        navigate("/login");
      }
    } catch (err) {
      setLoading(false);
      Swal.fire("Error", err.message || "Registration failed", "error");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-inner">
        {/* LEFT SIDE BRANDING (same as login) */}
        <section className="auth-hero">
          <div className="auth-logo-box">
            <span className="auth-logo-letter">S</span>
          </div>
          <div className="auth-hero-title">Shiwansh Solutions</div>
          <div className="auth-hero-subtitle">Employee Management System</div>
          <div className="auth-hero-tagline">✳️ Together we achieve more.</div>

          <div className="auth-hero-footer">
            Create your account to securely manage employee data and access the
            dashboard.
          </div>
        </section>

        {/* RIGHT SIDE REGISTER CARD */}
        <section className="auth-card-wrapper">
          <div className="auth-card">
            <h2 className="auth-card-title">Register for EMS</h2>

            <form onSubmit={submit}>
              {/* Full Name */}
              <div className="mb-2">
                <div className="auth-label">Full name</div>
                <div className="auth-input-group">
                  <div className="auth-input-icon-box">👤</div>
                  <input
                    className="auth-input-field"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={form.fullName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-2">
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
                    placeholder="Choose a strong password"
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
                <span>✨</span>
                <span>
                  {loading ? "Creating account..." : "CREATE ACCOUNT"}
                </span>
              </button>
            </form>

            <div className="auth-secondary-row">
              Already have an account? <Link to="/login">Sign in</Link>
            </div>
          </div>
        </section>
      </div>

      <div className="auth-credit">⚡ Developed by Shaif</div>
    </div>
  );
}
