import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const Navbar = ({ toggleDarkMode, darkMode, isLoggedIn }) => {
  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <div className="text-white text-xl">Blog</div>
      <div className="flex space-x-4">
        <Link to="/" className="text-white hover:underline">
          Home
        </Link>
        <Link to="/articles" className="text-white hover:underline">
          Articles
        </Link>
        <Link to="/about" className="text-white hover:underline">
          About
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <button onClick={toggleDarkMode} className="text-white">
          {darkMode ? "🌙" : "☀️"}
        </button>
        {isLoggedIn ? (
          <Link to="/profile" className="text-white hover:underline">
            Profile
          </Link>
        ) : (
          <Link to="/login" className="text-white hover:underline">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  toggleDarkMode: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};

export default Navbar;
