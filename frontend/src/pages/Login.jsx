// src/pages/Login.jsx
import { useState } from "react";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import PropTypes from "prop-types";

const Login = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/users/login", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.user.id); // Assuming the response contains user ID
      setIsLoggedIn(true);
      navigate("/");
    } catch (error) {
      console.error("Failed to login", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <form onSubmit={handleLogin} className="max-w-md mx-auto">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4 px-3 py-2 border rounded w-full"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 px-3 py-2 border rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
        >
          Login
        </button>
      </form>
      <p className="text-center mt-4">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="text-blue-500 hover:underline">
          Sign up!
        </Link>
      </p>
    </div>
  );
};

Login.propTypes = {
  setIsLoggedIn: PropTypes.func.isRequired,
};

export default Login;
