import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Articles from "./pages/Articles";
import ArticlePage from "./pages/ArticlePage";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import LoginPopup from "./components/LoginPopup";
import ResetPassword from "./pages/ResetPassword"; // Import the new ResetPassword page
import "./App.css"; // Import the CSS file

const App = () => {
  // Initialize darkMode state from localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Router>
      <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
        <Navbar
          toggleDarkMode={toggleDarkMode}
          darkMode={darkMode}
          isLoggedIn={isLoggedIn}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/articles" element={<Articles />} />
          <Route
            path="/articles/:id"
            element={
              <ArticlePage
                isLoggedIn={isLoggedIn}
                setShowLoginPopup={setShowLoginPopup}
              />
            }
          />
          <Route path="/about" element={<About />} />
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile"
            element={
              <Profile isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            }
          />
          <Route path="/reset-password/:token" element={<ResetPassword />} />{" "}
          {/* Add the new ResetPassword route */}
        </Routes>
        {showLoginPopup && (
          <LoginPopup onClose={() => setShowLoginPopup(false)} />
        )}
      </div>
    </Router>
  );
};

export default App;
