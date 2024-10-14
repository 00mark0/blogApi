// src/pages/ManageArticles.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const ManageArticles = () => {
  const [articles, setArticles] = useState([]);
  const [newArticle, setNewArticle] = useState({ title: "", content: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("/articles", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setArticles(response.data);
      } catch (error) {
        console.error("Failed to fetch articles", error);
      }
    };

    fetchArticles();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/articles", newArticle, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setArticles([...articles, response.data]);
      setNewArticle({ title: "", content: "" });
    } catch (error) {
      console.error("Failed to create article", error);
    }
  };

  const handleDelete = async (articleId) => {
    try {
      await axios.delete(`/articles/${articleId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setArticles(articles.filter((article) => article.id !== articleId));
    } catch (error) {
      console.error("Failed to delete article", error);
    }
  };

  const handleViewComments = (articleId, articleTitle) => {
    navigate(`/admin/dashboard/comments/${articleId}`, {
      state: { articleTitle },
    });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.id.toString().includes(searchQuery)
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">Manage Articles</h2>
      <input
        type="text"
        placeholder="Search articles by title or ID"
        value={searchQuery}
        onChange={handleSearch}
        className="mb-4 px-3 py-2 border rounded w-full"
      />
      <form onSubmit={handleCreate} className="mb-6">
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            value={newArticle.title}
            onChange={(e) =>
              setNewArticle({ ...newArticle, title: e.target.value })
            }
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Content</label>
          <textarea
            value={newArticle.content}
            onChange={(e) =>
              setNewArticle({ ...newArticle, content: e.target.value })
            }
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-10 rounded hover:bg-blue-600"
        >
          Create Article
        </button>
      </form>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-center">Title</th>
            <th className="py-2 px-4 border-b text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredArticles.map((article) => (
            <tr key={article.id}>
              <td className="py-2 px-4 border-b text-center">
                {article.title}
              </td>
              <td className="py-2 px-4 border-b text-center">
                <button
                  className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 mr-2"
                  onClick={() => handleViewComments(article.id, article.title)}
                >
                  View Comments
                </button>
                <button
                  className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                  onClick={() => handleDelete(article.id)}
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

export default ManageArticles;
