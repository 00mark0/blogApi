// src/pages/Dashboard.jsx
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isCommentsPage = location.pathname.includes(
    "/admin/dashboard/comments"
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex">
      {!isCommentsPage && (
        <aside className="w-64 bg-gray-800 text-white flex flex-col">
          <div className="p-4 text-center font-bold text-xl">
            Admin Dashboard
          </div>
          <nav className="flex-1">
            <ul>
              <li className="p-4 hover:bg-gray-700">
                <Link to="users">Manage Users</Link>
              </li>
              <li className="p-4 hover:bg-gray-700">
                <Link to="articles">Manage Articles</Link>
              </li>
            </ul>
          </nav>
          <div className="p-4">
            <button
              className="w-full bg-red-500 py-2 rounded hover:bg-red-600"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </aside>
      )}
      <main className="flex-1 p-8 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
