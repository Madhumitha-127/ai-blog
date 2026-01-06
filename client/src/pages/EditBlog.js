import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api.js";

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    API.get("/blogs").then(res => {
      const blog = res.data.find(b => b._id === id);
      if (blog) {
        setTitle(blog.title);
        setContent(blog.content);
      }
    });
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    await API.put(`/blogs/${id}`, { title, content });
    navigate("/");
  };

  return (
    <form onSubmit={submit} className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl mb-4">Edit Blog</h2>

      <input
        className="border w-full p-2 mb-3"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="border w-full p-2 mb-3"
        rows="6"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button className="bg-green-600 text-white px-4 py-2 rounded">
        Update
      </button>
    </form>
  );
}
