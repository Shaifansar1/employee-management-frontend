import React, { useState } from "react";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { register } from "../../store/slices/authSlice";

export default function Register({ onClose }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });

  const handleSubmit = async () => {
    if (!form.fullName || !form.email || !form.password) return Swal.fire("Validation", "All fields required", "warning");
    const res = await dispatch(register(form));
    if (res.error) Swal.fire("Error", res.payload || res.error.message, "error");
    else {
      Swal.fire("Success", "Registered. Now login.", "success");
      onClose();
    }
  };

  return (
    <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header"><h5 className="modal-title">Register</h5></div>
          <div className="modal-body">
            <input className="form-control mb-2" placeholder="Full name" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})}/>
            <input className="form-control mb-2" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}/>
            <input type="password" className="form-control mb-2" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}/>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>Register</button>
          </div>
        </div>
      </div>
    </div>
  );
}
