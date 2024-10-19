import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import { parseISO, isSameDay } from "date-fns";

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

  const filteredArticles = articles.filter((article) => {
    const articleDate = parseISO(article.created_at); // Ensure the correct field name
    const filterDate = dateFilter ? parseISO(dateFilter) : null;

    console.log(`Article Date: ${articleDate}, Filter Date: ${filterDate}`);

    return (
      (article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.id.toString().includes(searchQuery)) &&
      (!filterDate || isSameDay(articleDate, filterDate))
    );
  });

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">All Articles</h2>
      <input
        type="text"
        placeholder="Search articles by title or ID"
        value={searchQuery}
        onChange={handleSearch}
        className="mb-4 px-3 py-2 border rounded w-full text-gray-800"
      />
      <input
        type="date"
        value={dateFilter}
        onChange={handleDateFilter}
        className="mb-4 px-3 py-2 border rounded text-gray-800"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredArticles.map((article) => (
          <Link
            to={`/articles/${article.id}`}
            key={article.id}
            className="block p-4 border border-gray-300 rounded hover:bg-gray-100 hover:text-gray-950 transition ease duration-200"
          >
            <h3 className="text-xl font-semibold text-center">
              {article.title}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Articles;
