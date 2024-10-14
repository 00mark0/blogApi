// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import ManageUsers from "./pages/ManageUsers";
import ManageArticles from "./pages/ManageArticles";
import ManageComments from "./pages/ManageComments";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<Dashboard />}>
          <Route path="users" element={<ManageUsers />} />
          <Route path="articles" element={<ManageArticles />} />
          <Route path="comments/:articleId" element={<ManageComments />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
