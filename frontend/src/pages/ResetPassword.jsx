// src/pages/ResetPassword.jsx
import { useState } from "react";
import axios from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/password-reset/reset-password", {
        token,
        newPassword,
      });
      alert("Password reset successful");
      navigate("/login");
    } catch (error) {
      console.error("Failed to reset password", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
      <form onSubmit={handleResetPassword} className="max-w-md mx-auto">
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mb-4 px-3 py-2 border rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
