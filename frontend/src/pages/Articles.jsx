// src/pages/Articles.jsx
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");

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

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDateFilter = (e) => {
    setDateFilter(e.target.value);
  };

  const filteredArticles = articles.filter(
    (article) =>
      (article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.id.toString().includes(searchQuery)) &&
      (!dateFilter || new Date(article.createdAt) >= new Date(dateFilter))
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">All Articles</h2>
      <input
        type="text"
        placeholder="Search articles by title or ID"
        value={searchQuery}
        onChange={handleSearch}
        className="mb-4 px-3 py-2 border rounded w-full"
      />
      <input
        type="date"
        value={dateFilter}
        onChange={handleDateFilter}
        className="mb-4 px-3 py-2 border rounded w-full"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredArticles.map((article) => (
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

export default Articles;
