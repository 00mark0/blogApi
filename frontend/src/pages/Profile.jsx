import { useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const Profile = ({ setIsLoggedIn }) => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [comments, setComments] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
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

    const fetchComments = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const response = await axios.get(`/comments/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComments(response.data);
      } catch (error) {
        console.error("Failed to fetch comments", error);
      }
    };

    fetchUser();
    fetchComments();
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

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/users/me`, {
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

  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  };

  const groupedComments = comments.reduce((acc, comment) => {
    if (!acc[comment.article_id]) {
      acc[comment.article_id] = {
        articleTitle: comment.article_title,
        comments: [],
      };
    }
    acc[comment.article_id].comments.push(comment);
    return acc;
  }, {});

  const filteredComments = Object.keys(groupedComments).reduce(
    (acc, articleId) => {
      const article = groupedComments[articleId];
      if (
        article.articleTitle
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        articleId.includes(searchQuery)
      ) {
        acc[articleId] = article;
      }
      return acc;
    },
    {}
  );

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
          onClick={handleDeleteAccount}
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
      <div className="mt-12">
        <div className="flex flex-col justify-center items-center">
          <h3 className="text-xl font-bold mb-4 text-center">Your Comments</h3>
          <input
            type="text"
            placeholder="Search by article ID or title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4 px-3 py-2 border border-gray-800 rounded"
          />
        </div>
        {Object.keys(filteredComments).map((articleId) => (
          <div key={articleId} className="mb-6 text-center">
            <h4 className="text-lg font-semibold mb-2">
              {filteredComments[articleId].articleTitle}
            </h4>
            <ul className="list-none pl-5 md:flex justify-center">
              {filteredComments[articleId].comments.map((comment) => (
                <li key={comment.id} className="mb-2">
                  <p className="mb-1">{comment.content}</p>
                  <p className="text-sm text-gray-600 mb-2">
                    Article Id: {comment.article_id}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    Posted on{" "}
                    {new Date(comment.created_at).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="bg-red-500 text-white text-sm px-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

Profile.propTypes = {
  setIsLoggedIn: PropTypes.func.isRequired,
};

export default Profile;
