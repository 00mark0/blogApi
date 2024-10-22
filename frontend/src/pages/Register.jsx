import { useState } from "react";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); // State to manage error messages
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error messages
    try {
      await axios.post("/users/register", {
        username,
        email,
        password,
        confirmPassword,
      });
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error); // Set error message from server response
      } else {
        setError("Failed to register. Please try again."); // Fallback error message
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
      <form onSubmit={handleRegister} className="max-w-md mx-auto">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4 px-3 py-2 border rounded w-full"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 px-3 py-2 border rounded w-full"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 px-3 py-2 border rounded w-full"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mb-4 px-3 py-2 border rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Register
        </button>
      </form>
      <p className="text-center mt-4">
        Already signed up?{" "}
        <Link to="/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;
