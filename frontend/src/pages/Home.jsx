import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [mostLikedArticles, setMostLikedArticles] = useState([]);
  const [mostRecentArticles, setMostRecentArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("/articles");
        const articlesWithDetails = await Promise.all(
          response.data.map(async (article) => {
            const commentsResponse = await axios.get(`/comments/${article.id}`);
            return {
              ...article,
              commentsCount: commentsResponse.data.length,
            };
          })
        );

        // Sort articles by like_count in descending order
        const sortedByLikes = [...articlesWithDetails].sort(
          (a, b) => b.like_count - a.like_count
        );
        // Limit to top 4 most liked articles
        setMostLikedArticles(sortedByLikes.slice(0, 4));

        // Sort articles by created_at in descending order
        const sortedByDate = [...articlesWithDetails].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        // Limit to top 4 most recent articles
        setMostRecentArticles(sortedByDate.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch articles", error);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <h2 className="text-3xl font-bold mb-6 mt-12 text-center">Most Liked</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {mostLikedArticles.map((article) => (
          <Link
            to={`/articles/${article.id}`}
            key={article.id}
            className="block p-6 border rounded-lg shadow-lg hover:bg-gray-100 hover:text-gray-950 transition duration-300"
          >
            <h3 className="text-2xl font-semibold mb-2">{article.title}</h3>
            <p className="text-gray-600 mb-4">
              {article.content.substring(0, 100)}...
            </p>
            <div className="flex justify-between items-center text-gray-500">
              <span>👍 {article.like_count}</span>
              <span>💬 {article.commentsCount}</span>
            </div>
          </Link>
        ))}
      </div>

      <h2 className="text-3xl font-bold mb-6 mt-12 text-center">Most Recent</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {mostRecentArticles.map((article) => (
          <Link
            to={`/articles/${article.id}`}
            key={article.id}
            className="block p-6 border rounded-lg shadow-lg hover:bg-gray-100 hover:text-gray-950 transition duration-300"
          >
            <h3 className="text-2xl font-semibold mb-2">{article.title}</h3>
            <p className="text-gray-600 mb-4">
              {article.content.substring(0, 100)}...
            </p>
            <div className="flex justify-between items-center text-gray-500">
              <span>👍 {article.like_count}</span>
              <span>💬 {article.commentsCount}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
