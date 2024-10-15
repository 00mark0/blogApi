// src/pages/ManageUsers.jsx
import { useEffect, useState } from "react";
import axios from "../api/axios";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/users/admin/users", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toString().includes(searchQuery)
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Manage Users</h2>
      <input
        type="text"
        placeholder="Search users by username or ID"
        value={searchQuery}
        onChange={handleSearch}
        className="mb-4 px-3 py-2 border rounded w-full"
      />
      <div className="hidden sm:block">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-center">Username</th>
              <th className="py-2 px-4 border-b text-center">Email</th>
              <th className="py-2 px-4 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="py-2 px-4 border-b text-center">
                  {user.username}
                </td>
                <td className="py-2 px-4 border-b text-center">{user.email}</td>
                <td className="py-2 px-4 border-b text-center">
                  <button
                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="sm:hidden">
        {filteredUsers.map((user) => (
          <div key={user.id} className="mb-4 p-4 border rounded bg-white">
            <div className="mb-2">
              <span className="font-semibold">Username:</span> {user.username}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Email:</span> {user.email}
            </div>
            <div className="mb-2">
              <button
                className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 w-full"
                onClick={() => handleDelete(user.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageUsers;
