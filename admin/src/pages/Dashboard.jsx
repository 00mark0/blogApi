// src/pages/Dashboard.jsx
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const isCommentsPage = location.pathname.includes(
    "/admin/dashboard/comments"
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen flex">
      {!isCommentsPage && (
        <>
          <button
            className="sm:hidden fixed top-4 left-4 z-50 bg-blue-500 text-white p-2 rounded"
            onClick={toggleSidebar}
          >
            ☰
          </button>
          <aside
            ref={sidebarRef}
            className={`fixed inset-y-0 left-0 transform ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-200 ease-in-out bg-gray-800 text-white w-64 z-50 sm:relative sm:translate-x-0`}
          >
            <div className="p-4 text-center font-bold text-xl flex justify-between items-center">
              <span>Admin Dashboard</span>
              <button className="sm:hidden text-white" onClick={toggleSidebar}>
                ✕
              </button>
            </div>
            <nav className="flex-1">
              <ul>
                <Link to="users" onClick={toggleSidebar}>
                  <li className="p-4 hover:bg-gray-700">Manage Users</li>
                </Link>
                <Link to="articles" onClick={toggleSidebar}>
                  <li className="p-4 hover:bg-gray-700">Manage Articles</li>
                </Link>
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
        </>
      )}
      <main className="flex-1 p-8 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
