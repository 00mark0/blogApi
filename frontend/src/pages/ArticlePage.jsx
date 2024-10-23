import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faThumbsDown,
  faEllipsisV,
} from "@fortawesome/free-solid-svg-icons";
import debounce from "lodash/debounce";
import parse from "html-react-parser"; // Import html-react-parser

const ArticlePage = ({ isLoggedIn, setShowLoginPopup }) => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [usernames, setUsernames] = useState({});
  const [articleLikeStatus, setArticleLikeStatus] = useState(null);
  const [commentLikeStatuses, setCommentLikeStatuses] = useState({});
  const [showMenu, setShowMenu] = useState(null);
  const [likeClicked, setLikeClicked] = useState(false); // State to track if like/dislike button is clicked
  const [commentLikeClicked, setCommentLikeClicked] = useState({}); // State to track if like/dislike button is clicked for comments

  const menuRef = useRef(null); // Ref for the menu

  const userCache = useMemo(() => ({}), []);

  // Debounced user fetch to avoid excessive requests
  const fetchUserDetails = useCallback(
    debounce(async (userId) => {
      if (userCache[userId]) return;

      try {
        const response = await axios.get(`/users/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const username = response.data.username;
        userCache[userId] = username;
        setUsernames((prev) => ({ ...prev, [userId]: username }));
      } catch (error) {
        userCache[userId] = "Anonymous";
        setUsernames((prev) => ({ ...prev, [userId]: "Anonymous" }));
      }
    }, 300),
    [userCache]
  );

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const { data } = await axios.get(`/articles/${id}`);
        setArticle(data);
        fetchUserDetails(data.user_id);
        if (isLoggedIn) fetchArticleLikeStatus(data.id);
      } catch (error) {
        console.error("Failed to fetch article", error);
      }
    };

    const fetchComments = async () => {
      try {
        const { data } = await axios.get(`/comments/${id}`);
        setComments(data);

        const userIds = [...new Set(data.map((comment) => comment.user_id))];
        userIds.forEach((userId) => fetchUserDetails(userId));

        if (isLoggedIn) fetchAllCommentLikeStatuses(data);
      } catch (error) {
        console.error("Failed to fetch comments", error);
      }
    };

    fetchArticle();
    fetchComments();
  }, [id, isLoggedIn, fetchUserDetails]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const fetchArticleLikeStatus = async (articleId) => {
    try {
      const { data } = await axios.get(`/likes/article/${articleId}/status`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setArticleLikeStatus(data.is_like);
    } catch (error) {
      console.error("Failed to fetch article like status", error);
    }
  };

  const fetchAllCommentLikeStatuses = async (comments) => {
    try {
      const responses = await Promise.all(
        comments.map((comment) =>
          axios.get(`/likes/comment/${comment.id}/status`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
        )
      );
      const statuses = responses.reduce((acc, { data }, index) => {
        acc[comments[index].id] = data.is_like;
        return acc;
      }, {});
      setCommentLikeStatuses(statuses);
    } catch (error) {
      console.error("Failed to fetch comment like statuses", error);
    }
  };

  const handleLikeDislike = async (isLike) => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return;
    }
    if (likeClicked) return; // Prevent further clicks
    try {
      await axios.post(
        `/likes/article/${id}`,
        { isLike },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setArticle((prev) => ({
        ...prev,
        like_count: prev.like_count + (isLike ? 1 : 0),
        dislike_count: prev.dislike_count + (!isLike ? 1 : 0),
      }));
      setArticleLikeStatus(isLike);
      setLikeClicked(true); // Set likeClicked to true after the first click
    } catch (error) {
      console.error("Failed to update article like/dislike", error);
    }
  };

  const handleCommentLikeDislike = async (commentId, isLike) => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return;
    }
    if (commentLikeClicked[commentId]) return; // Prevent further clicks for this comment
    try {
      await axios.post(
        `/likes/comment/${commentId}`,
        { isLike },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                like_count: comment.like_count + (isLike ? 1 : 0),
                dislike_count: comment.dislike_count + (!isLike ? 1 : 0),
              }
            : comment
        )
      );
      setCommentLikeStatuses((prev) => ({ ...prev, [commentId]: isLike }));
      setCommentLikeClicked((prev) => ({ ...prev, [commentId]: true })); // Set commentLikeClicked to true for this comment
    } catch (error) {
      console.error("Failed to update comment like/dislike", error);
    }
  };

  const handlePostComment = async () => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return;
    }
    if (!newComment.trim()) return;

    try {
      const { data } = await axios.post(
        `/comments/${id}`,
        { content: newComment },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setComments((prev) => [...prev, data]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to post comment", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {article && (
        <div className="max-w-2xl w-full">
          <h2 className="text-3xl font-bold mb-6 text-start">
            {article.title}
          </h2>
          <div className="mb-4 text-start w-full text-lg">
            {parse(article.content)}
          </div>
          <p className="text-sm text-gray-400 mb-4 text-center">
            By {usernames[article.user_id]} on{" "}
            {new Date(article.created_at).toLocaleDateString()}
          </p>
          <div className="flex justify-center space-x-4 mb-4">
            <button
              onClick={() => handleLikeDislike(true)}
              className="bg-blue-500 text-white py-1 px-3 rounded"
              disabled={articleLikeStatus === true || likeClicked}
            >
              <FontAwesomeIcon icon={faThumbsUp} className="mr-2" />{" "}
              {article.like_count}
            </button>
            <button
              onClick={() => handleLikeDislike(false)}
              className="bg-red-500 text-white py-1 px-3 rounded"
              disabled={articleLikeStatus === false || likeClicked}
            >
              <FontAwesomeIcon icon={faThumbsDown} className="mr-2" />{" "}
              {article.dislike_count}
            </button>
          </div>
          <h3 className="text-xl font-semibold mb-4 text-start">Comments</h3>
          {comments.length === 0 ? (
            <div className="text-center py-10">
              <h3 className="text-xl font-semibold text-gray-700">
                No comments yet!
              </h3>
              <p className="text-gray-500 mt-2">
                Be the first to share your thoughts on this article.
              </p>
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
            comments.map((comment) => (
              <div
                key={comment.id}
                className="mb-4 p-4 border rounded bg-blue-100 relative"
              >
                <p className="mb-2 text-gray-800">{comment.content}</p>
                <p className="text-sm text-gray-600 mb-2">
                  By {usernames[comment.user_id]} on{" "}
                  {new Date(comment.created_at).toLocaleDateString()}
                </p>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleCommentLikeDislike(comment.id, true)}
                    className="flex items-center bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                    disabled={
                      commentLikeStatuses[comment.id] === true ||
                      commentLikeClicked[comment.id]
                    }
                  >
                    <FontAwesomeIcon icon={faThumbsUp} className="mr-2" />
                    {comment.like_count}
                  </button>
                  <button
                    onClick={() => handleCommentLikeDislike(comment.id, false)}
                    className="flex items-center bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                    disabled={
                      commentLikeStatuses[comment.id] === false ||
                      commentLikeClicked[comment.id]
                    }
                  >
                    <FontAwesomeIcon icon={faThumbsDown} className="mr-2" />{" "}
                    {comment.dislike_count}
                  </button>
                  {String(comment.user_id) ===
                    localStorage.getItem("userId") && (
                    <div className="absolute top-5 right-5">
                      <button
                        onClick={() =>
                          setShowMenu(
                            showMenu === comment.id ? null : comment.id
                          )
                        }
                        className="text-gray-800 hover:text-gray-400 transition ease duration-200 rounded"
                      >
                        <FontAwesomeIcon icon={faEllipsisV} size="lg" />
                      </button>
                      {showMenu === comment.id && (
                        <div
                          ref={menuRef}
                          className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg"
                        >
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          <textarea
            className="w-full p-2 border rounded mb-4 text-gray-800 bg-blue-100"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <button
            onClick={handlePostComment}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Post Comment
          </button>
        </div>
      )}
    </div>
  );
};

ArticlePage.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  setShowLoginPopup: PropTypes.func.isRequired,
};

export default ArticlePage;
