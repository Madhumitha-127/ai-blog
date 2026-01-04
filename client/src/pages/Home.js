import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api.js";

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [summaries, setSummaries] = useState({});
  const [search, setSearch] = useState("");

  // Fetch all blogs
  const fetchBlogs = async () => {
    const res = await API.get("/blogs");
    setBlogs(res.data);
  };

  // Like a blog
  const likeBlog = async (id) => {
    try {
      await API.put(`/blogs/like/${id}`);
      fetchBlogs();
    } catch (err) {
      alert(err.response?.data?.message || "Like failed");
    }
  };

  // Add comment
  const addComment = async (id) => {
    if (!commentText[id]) return;

    await API.post(`/blogs/comment/${id}`, {
      text: commentText[id],
    });

    setCommentText({ ...commentText, [id]: "" });
    fetchBlogs();
  };

  // Delete blog
  const deleteBlog = async (id) => {
    if (!window.confirm("Delete this blog?")) return;

    await API.delete(`/blogs/${id}`);
    fetchBlogs();
  };

  // AI summary
  const getSummary = async (id, content) => {
    const res = await API.post("/ai/summary", { content });

    setSummaries({
      ...summaries,
      [id]: res.data.summary,
    });
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // 🔍 Search filter
  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(search.toLowerCase()) ||
      blog.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">Blogs</h2>

      <Link
        to="/create"
        className="inline-block mb-4 text-blue-600 hover:underline"
      >
        + Create Blog
      </Link>

      {/* 🔍 Search Input */}
      <input
        type="text"
        placeholder="Search blogs..."
        className="border px-3 py-2 rounded w-full mb-6"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredBlogs.length === 0 && <p>No blogs found</p>}

      {filteredBlogs.map((blog) => (
        <div
          key={blog._id}
          className="bg-white shadow rounded p-5 mb-6"
        >
          <h3 className="text-xl font-semibold mb-2">
            {blog.title}
          </h3>

          <p className="text-gray-700 mb-3">
            {blog.content}
          </p>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap gap-3 mb-3">
            <button
              onClick={() => likeBlog(blog._id)}
              className="px-3 py-1 bg-pink-100 rounded hover:bg-pink-200"
            >
              ❤️ Like ({blog.likes.length})
            </button>

            <button
              onClick={() => getSummary(blog._id, blog.content)}
              className="px-3 py-1 bg-purple-100 rounded hover:bg-purple-200"
            >
              🤖 AI Summary
            </button>

            <Link
              to={`/edit/${blog._id}`}
              className="px-3 py-1 bg-yellow-100 rounded hover:bg-yellow-200"
            >
              ✏️ Edit
            </Link>

            <button
              onClick={() => deleteBlog(blog._id)}
              className="px-3 py-1 bg-red-100 rounded hover:bg-red-200"
            >
              🗑️ Delete
            </button>
          </div>

          {/* AI SUMMARY OUTPUT */}
          {summaries[blog._id] && (
            <div className="bg-gray-100 p-3 rounded mb-3 text-sm">
              {summaries[blog._id]}
            </div>
          )}

          {/* COMMENTS */}
          <div>
            <h4 className="font-semibold mb-2">Comments</h4>

            {blog.comments.map((c, i) => (
              <p key={i} className="text-sm text-gray-600">
                • {c.text}
              </p>
            ))}

            <div className="flex gap-2 mt-2">
              <input
                className="border rounded px-2 py-1 flex-1"
                placeholder="Add a comment..."
                value={commentText[blog._id] || ""}
                onChange={(e) =>
                  setCommentText({
                    ...commentText,
                    [blog._id]: e.target.value,
                  })
                }
              />
              <button
                onClick={() => addComment(blog._id)}
                className="bg-blue-500 text-white px-3 rounded hover:bg-blue-600"
              >
                Comment
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
