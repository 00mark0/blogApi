import { useState } from "react";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import PropTypes from "prop-types";

const Login = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State to manage error messages
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error messages
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
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error); // Set error message from server response
      } else {
        setError("Failed to login. Please try again."); // Fallback error message
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
      <form onSubmit={handleLogin} className="max-w-md mx-auto">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4 px-3 py-2 border rounded w-full text-gray-800"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 px-3 py-2 border rounded w-full text-gray-800"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
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
