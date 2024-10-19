import { useEffect, useState, useMemo } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axios";

const ManageComments = () => {
  const { articleId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { articleTitle } = location.state;
  const [comments, setComments] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const userCache = useMemo(() => ({}), []);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/comments/${articleId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setComments(response.data);
        const userIds = response.data.map((comment) => comment.user_id);
        fetchUsernames(userIds);
      } catch (error) {
        console.error("Failed to fetch comments", error);
      }
    };

    const fetchUsernames = async (userIds) => {
      try {
        const uniqueUserIds = [...new Set(userIds)];
        const usernamesMap = {};
        for (const userId of uniqueUserIds) {
          if (!userCache[userId]) {
            const response = await axios.get(`/users/${userId}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            userCache[userId] = response.data.username;
            usernamesMap[userId] = response.data.username;
          } else {
            usernamesMap[userId] = userCache[userId];
          }
        }
        setUsernames((prevUsernames) => ({
          ...prevUsernames,
          ...usernamesMap,
        }));
      } catch (error) {
        console.error("Failed to fetch usernames", error);
      }
    };

    fetchComments();
  }, [articleId, userCache]);

  const handleDelete = async (commentId) => {
    try {
      await axios.delete(`/comments/admin/${commentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  };

  const handleBack = () => {
    navigate("/admin/dashboard/articles");
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredComments = comments.filter((comment) => {
    const username = usernames[comment.user_id] || "";
    return (
      comment.user_id.toString().includes(searchQuery) ||
      username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div>
      <div className="block sm:hidden p-4">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          onClick={handleBack}
        >
          Back to Articles
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-6 text-center">
        Comments from article &apos;{articleTitle}&apos;
      </h2>
      <input
        type="text"
        placeholder="Search by username or user ID"
        value={searchQuery}
        onChange={handleSearch}
        className="mb-4 px-3 py-2 border rounded w-full text-gray-800"
      />
      {filteredComments.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-xl font-semibold text-gray-700">
            No comments yet!
          </h3>
          <div className="mt-4">
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16h6M21 12c0 4.418-3.582 8-8 8H7l-4 4V12c0-4.418 3.582-8 8-8h6c4.418 0 8 3.582 8 8z"
              ></path>
            </svg>
          </div>
        </div>
      ) : (
        <div className="sm:hidden">
          {filteredComments.map((comment) => (
            <div key={comment.id} className="mb-4 p-4 border rounded bg-white">
              <div className="mb-2">
                <span className="font-semibold">User ID:</span>{" "}
                {comment.user_id}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Username:</span>{" "}
                {usernames[comment.user_id] || "Loading..."}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Comment:</span>{" "}
                {comment.content}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Created At:</span>{" "}
                {new Date(comment.created_at).toLocaleString()}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Likes:</span>{" "}
                {comment.like_count}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Dislikes:</span>{" "}
                {comment.dislike_count}
              </div>
              <button
                className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 w-full"
                onClick={() => handleDelete(comment.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
      {filteredComments.length > 0 && (
        <div className="hidden sm:block">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-center">User ID</th>
                <th className="py-2 px-4 border-b text-center">Username</th>
                <th className="py-2 px-4 border-b text-center">Comment</th>
                <th className="py-2 px-4 border-b text-center">Created At</th>
                <th className="py-2 px-4 border-b text-center">Likes</th>
                <th className="py-2 px-4 border-b text-center">Dislikes</th>
                <th className="py-2 px-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredComments.map((comment) => (
                <tr key={comment.id}>
                  <td className="py-2 px-4 border-b text-center">
                    {comment.user_id}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {usernames[comment.user_id] || "Loading..."}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {comment.content}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {new Date(comment.created_at).toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {comment.like_count}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {comment.dislike_count}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <button
                      className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                      onClick={() => handleDelete(comment.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageComments;
