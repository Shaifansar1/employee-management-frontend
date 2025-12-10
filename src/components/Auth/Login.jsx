import React, { useState } from "react";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { login } from "../../store/slices/authSlice";

export default function Login({ onSuccess }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async () => {
    if (!form.email || !form.password) return Swal.fire("Validation", "Email and password required", "warning");
    const res = await dispatch(login(form));
    if (res.error) Swal.fire("Error", res.payload || res.error.message, "error");
    else {
      Swal.fire("Success", "Logged in", "success");
      onSuccess && onSuccess();
    }
  };

  return (
    <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header"><h5 className="modal-title">Login</h5></div>
          <div className="modal-body">
            <input className="form-control mb-2" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}/>
            <input type="password" className="form-control mb-2" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}/>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => onSuccess && onSuccess()}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}
