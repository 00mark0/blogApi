// src/pages/ManageComments.jsx
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "../api/axios";

const ManageComments = () => {
  const { articleId } = useParams();
  const location = useLocation();
  const { articleTitle } = location.state;
  const [comments, setComments] = useState([]);
  const [usernames, setUsernames] = useState({});

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
        const usernamesMap = {};
        for (const userId of userIds) {
          if (!usernames[userId]) {
            const response = await axios.get(`/users/${userId}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            usernamesMap[userId] = response.data.username;
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
  }, [usernames, articleId]);

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

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">
        Comments from article &apos;{articleTitle}&apos;
      </h2>
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
          {comments.map((comment) => (
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
  );
};

export default ManageComments;
