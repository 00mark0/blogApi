import { useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const Profile = ({ setIsLoggedIn }) => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        if (!token || !userId) {
          navigate("/login");
          return;
        }
        const response = await axios.get(`/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        setUsername(response.data.username);
        setEmail(response.data.email);
      } catch (error) {
        console.error("Failed to fetch user", error);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/users/me`,
        { newUsername: username, newEmail: email },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Details updated successfully");
    } catch (error) {
      console.error("Failed to update user", error);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      await axios.delete(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      setIsLoggedIn(false);
      navigate("/register");
      alert("Account deleted successfully");
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handlePasswordResetRequest = async () => {
    try {
      await axios.post("/password-reset/request-reset", { email });
      alert("Password reset link sent to your email");
    } catch (error) {
      console.error("Failed to send password reset link", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Profile</h2>
      {user && (
        <form onSubmit={handleUpdate} className="max-w-md mx-auto">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-4 px-3 py-2 border rounded w-full text-gray-800"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 px-3 py-2 border rounded w-full text-gray-800"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Update Details
          </button>
        </form>
      )}
      <div className="flex flex-col mx-auto w-64 mt-12">
        <button
          onClick={handlePasswordResetRequest}
          className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 mt-4"
        >
          Reset Password
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 mt-4"
        >
          Delete Account
        </button>
        <button
          onClick={handleLogout}
          className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 mt-4"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

Profile.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  setIsLoggedIn: PropTypes.func.isRequired,
};

export default Profile;
