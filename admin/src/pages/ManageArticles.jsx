import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { Editor } from "@tinymce/tinymce-react";
import "../App.css";

const ManageArticles = () => {
  const [articles, setArticles] = useState([]);
  const [newArticle, setNewArticle] = useState({
    title: "",
    content: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [editingArticleId, setEditingArticleId] = useState(null);
  const [expandedArticleId, setExpandedArticleId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("/articles", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setArticles(response.data);
      } catch (error) {
        console.error("Failed to fetch articles", error);
      }
    };

    fetchArticles();
  }, []);

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      const content = newArticle.content;

      if (editingArticleId) {
        await axios.put(
          `/articles/${editingArticleId}`,
          { ...newArticle, content },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setArticles(
          articles.map((article) =>
            article.id === editingArticleId
              ? { ...article, ...newArticle, content }
              : article
          )
        );
      } else {
        const response = await axios.post(
          "/articles",
          { ...newArticle, content },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setArticles([...articles, response.data]);
      }
      resetNewArticle();
    } catch (error) {
      console.error("Failed to create or update article", error);
    }
  };

  const resetNewArticle = () => {
    setNewArticle({
      title: "",
      content: "",
    });
    setEditingArticleId(null);
  };

  const handleDelete = async (articleId) => {
    try {
      await axios.delete(`/articles/${articleId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
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

  const handleEdit = (article) => {
    setNewArticle({
      title: article.title,
      content: article.content,
    });
    setEditingArticleId(article.id);
  };

  const handleExpand = (articleId) => {
    setExpandedArticleId(expandedArticleId === articleId ? null : articleId);
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
    <div className="px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Manage Articles</h2>
      <input
        type="text"
        placeholder="Search articles by title or ID"
        value={searchQuery}
        onChange={handleSearch}
        className="mb-4 px-3 py-2 border rounded w-full"
      />
      <form onSubmit={handleCreateOrUpdate} className="mb-6">
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
          <div className="border rounded p-2">
            <Editor
              apiKey="o0nctj6gidbeunx0288d2ejavo3n8kxe4xbug8bmf0p4t3nf" // Replace with your TinyMCE API key
              value={newArticle.content}
              onEditorChange={(content) =>
                setNewArticle({ ...newArticle, content })
              }
              init={{
                height: 300,
                menubar: false,
                plugins: [
                  "advlist autolink lists link image charmap print preview anchor",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table paste code help wordcount",
                ],
                toolbar:
                  "undo redo | formatselect | bold italic backcolor | \
                  alignleft aligncenter alignright alignjustify | \
                  bullist numlist outdent indent | removeformat | help",
              }}
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-10 rounded hover:bg-blue-600 w-full sm:w-auto"
        >
          {editingArticleId ? "Update Article" : "Create Article"}
        </button>
      </form>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-start">Title</th>
            <th className="py-2 px-4 border-b text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredArticles.map((article) => (
            <tr key={article.id}>
              <td className="py-2 px-4 border-b text-start">
                {article.title}
                {expandedArticleId === article.id && (
                  <div className="mt-2 text-start">
                    <div
                      dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                    <p className="text-sm text-gray-600 mt-4">
                      Created At:{" "}
                      {new Date(article.created_at).toLocaleString()}
                    </p>
                  </div>
                )}
              </td>
              <td className="py-2 px-4 border-b text-center">
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <button
                    className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 w-full sm:w-auto"
                    onClick={() =>
                      handleViewComments(article.id, article.title)
                    }
                  >
                    View Comments
                  </button>
                  <button
                    className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 w-full sm:w-auto"
                    onClick={() => handleEdit(article)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 w-full sm:w-auto"
                    onClick={() => handleExpand(article.id)}
                  >
                    {expandedArticleId === article.id
                      ? "Collapse"
                      : "View Full"}
                  </button>
                  <button
                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 w-full sm:w-auto"
                    onClick={() => handleDelete(article.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageArticles;
