// src/pages/Home.jsx
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("/articles");
        setArticles(response.data);
      } catch (error) {
        console.error("Failed to fetch articles", error);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Trending Articles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article) => (
          <Link
            to={`/articles/${article.id}`}
            key={article.id}
            className="block p-4 border rounded hover:bg-gray-100"
          >
            <h3 className="text-xl font-semibold">{article.title}</h3>
            <p className="text-gray-600">
              {article.content.substring(0, 100)}...
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
