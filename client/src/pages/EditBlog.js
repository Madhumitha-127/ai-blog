import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api.js";

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  // Load blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await API.get("/blogs");
        const blog = res.data.find((b) => b._id === id);

        if (!blog) {
          alert("Blog not found");
          navigate("/");
          return;
        }

        setTitle(blog.title);
        setContent(blog.content);
        setLoading(false);
      } catch (err) {
        alert("Failed to load blog");
        navigate("/");
      }
    };

    fetchBlog();
  }, [id, navigate]);

  // Update blog
  const submit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert("Title and content are required");
      return;
    }

    try {
      await API.put(`/blogs/${id}`, {
        title,
        content
      });
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Blog</h2>

      <form onSubmit={submit}>
        <input
          className="border w-full p-2 mb-3 rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="border w-full p-2 mb-3 rounded"
          rows="6"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Update Blog
        </button>
      </form>
    </div>
  );
}
