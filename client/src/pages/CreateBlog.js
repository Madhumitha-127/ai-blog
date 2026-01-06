import { useState } from "react";
import API from "../api.js";

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    await API.post("/blogs", { title, content });
    window.location.href = "/";
  };

  return (
    <form onSubmit={submit} className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl mb-4">Create Blog</h2>

      <input
        className="border w-full p-2 mb-3"
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="border w-full p-2 mb-3"
        placeholder="Content"
        rows="6"
        onChange={(e) => setContent(e.target.value)}
      />

      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Publish
      </button>
    </form>
  );
}
