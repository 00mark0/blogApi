import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";

const ArticlePage = ({ isLoggedIn, setShowLoginPopup }) => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [usernames, setUsernames] = useState({});
  const [articleLikeStatus, setArticleLikeStatus] = useState(null);
  const [commentLikeStatuses, setCommentLikeStatuses] = useState({});
  const userCache = useMemo(() => ({}), []);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`/articles/${id}`);
        setArticle(response.data);
        fetchUserDetails(response.data.user_id);
        if (isLoggedIn) {
          fetchArticleLikeStatus(response.data.id);
        }
      } catch (error) {
        console.error("Failed to fetch article", error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(`/comments/${id}`);
        setComments(response.data);
        response.data.forEach((comment) => {
          fetchUserDetails(comment.user_id);
          if (isLoggedIn) {
            fetchCommentLikeStatus(comment.id);
          }
        });
      } catch (error) {
        console.error("Failed to fetch comments", error);
      }
    };

    const fetchUserDetails = async (userId) => {
      if (userCache[userId]) {
        setUsernames((prevUsernames) => ({
          ...prevUsernames,
          [userId]: userCache[userId],
        }));
      } else {
        try {
          const response = await axios.get(`/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          userCache[userId] = response.data.username;
          setUsernames((prevUsernames) => ({
            ...prevUsernames,
            [userId]: response.data.username,
          }));
        } catch (error) {
          if (error.response && error.response.status === 400) {
            userCache[userId] = "Anonymous";
            setUsernames((prevUsernames) => ({
              ...prevUsernames,
              [userId]: "Anonymous",
            }));
          } else {
            console.error("Failed to fetch user details", error);
          }
        }
      }
    };

    const fetchArticleLikeStatus = async (articleId) => {
      try {
        const response = await axios.get(`/likes/article/${articleId}/status`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setArticleLikeStatus(response.data.is_like);
      } catch (error) {
        console.error("Failed to fetch article like status", error);
      }
    };

    const fetchCommentLikeStatus = async (commentId) => {
      try {
        const response = await axios.get(`/likes/comment/${commentId}/status`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCommentLikeStatuses((prevStatuses) => ({
          ...prevStatuses,
          [commentId]: response.data.is_like,
        }));
      } catch (error) {
        console.error("Failed to fetch comment like status", error);
      }
    };

    fetchArticle();
    fetchComments();
  }, [id, isLoggedIn, usernames, userCache]);

  const throttle = (func, limit) => {
    let lastFunc;
    let lastRan;
    return function (...args) {
      const context = this;
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function () {
          if (Date.now() - lastRan >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  };

  const handleLike = throttle(async () => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return;
    }
    try {
      await axios.post(
        `/likes/article/${id}`,
        { isLike: true },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setArticle((prevArticle) => ({
        ...prevArticle,
        like_count: prevArticle.like_count + 1,
      }));
      setArticleLikeStatus(true);
    } catch (error) {
      console.error("Failed to like article", error);
    }
  }, 1000);

  const handleDislike = throttle(async () => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return;
    }
    try {
      await axios.post(
        `/likes/article/${id}`,
        { isLike: false },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setArticle((prevArticle) => ({
        ...prevArticle,
        dislike_count: prevArticle.dislike_count + 1,
      }));
      setArticleLikeStatus(false);
    } catch (error) {
      console.error("Failed to dislike article", error);
    }
  }, 1000);

  const handleCommentLike = throttle(async (commentId) => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return;
    }
    try {
      await axios.post(
        `/likes/comment/${commentId}`,
        { isLike: true },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? { ...comment, like_count: comment.like_count + 1 }
            : comment
        )
      );
      setCommentLikeStatuses((prevStatuses) => ({
        ...prevStatuses,
        [commentId]: true,
      }));
    } catch (error) {
      console.error("Failed to like comment", error);
    }
  }, 1000);

  const handleCommentDislike = throttle(async (commentId) => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return;
    }
    try {
      await axios.post(
        `/likes/comment/${commentId}`,
        { isLike: false },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? { ...comment, dislike_count: comment.dislike_count + 1 }
            : comment
        )
      );
      setCommentLikeStatuses((prevStatuses) => ({
        ...prevStatuses,
        [commentId]: false,
      }));
    } catch (error) {
      console.error("Failed to dislike comment", error);
    }
  }, 1000);

  const handlePostComment = async () => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return;
    }

    if (newComment.trim() === "") {
      return;
    }

    try {
      const response = await axios.post(
        `/comments/${id}`,
        {
          content: newComment,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setComments([...comments, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to post comment", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {article && (
        <>
          <div className="max-w-2xl w-full">
            <h2 className="text-3xl font-bold mb-6 text-center">
              {article.title}
            </h2>
            <p className="mb-4 text-center">{article.content}</p>
            <p className="text-sm text-gray-400 mb-4 text-center">
              By {usernames[article.user_id]} on{" "}
              {new Date(article.created_at).toLocaleDateString()}
            </p>
            <div className="flex justify-center items-center space-x-4 mb-4">
              <button
                onClick={handleLike}
                className="flex items-center bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                disabled={articleLikeStatus === true}
              >
                <FontAwesomeIcon icon={faThumbsUp} className="mr-2" />
                {article.like_count}
              </button>
              <button
                onClick={handleDislike}
                className="flex items-center bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                disabled={articleLikeStatus === false}
              >
                <FontAwesomeIcon icon={faThumbsDown} className="mr-2" />
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
                  className="mb-4 p-4 border rounded bg-blue-100"
                >
                  <p className="mb-2 text-gray-800">{comment.content}</p>
                  <p className="text-sm text-gray-600 mb-2">
                    By {usernames[comment.user_id]} on{" "}
                    {new Date(comment.created_at).toLocaleDateString()}
                  </p>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleCommentLike(comment.id)}
                      className="flex items-center bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                      disabled={commentLikeStatuses[comment.id] === true}
                    >
                      <FontAwesomeIcon icon={faThumbsUp} className="mr-2" />
                      {comment.like_count}
                    </button>
                    <button
                      onClick={() => handleCommentDislike(comment.id)}
                      className="flex items-center bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                      disabled={commentLikeStatuses[comment.id] === false}
                    >
                      <FontAwesomeIcon icon={faThumbsDown} className="mr-2" />{" "}
                      {comment.dislike_count}
                    </button>
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
        </>
      )}
    </div>
  );
};

ArticlePage.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  setShowLoginPopup: PropTypes.func.isRequired,
};

export default ArticlePage;
