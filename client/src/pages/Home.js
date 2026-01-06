import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api.js";

export default function Home() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    API.get("/blogs").then(res => setBlogs(res.data));
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link to="/create" className="text-blue-600">+ Create Blog</Link>

      {blogs.map(blog => (
        <div key={blog._id} className="border p-4 my-4">
          <h3 className="font-bold">{blog.title}</h3>
          <p>{blog.content}</p>
          <Link to={`/edit/${blog._id}`} className="text-sm text-blue-500">
            Edit
          </Link>
        </div>
      ))}
    </div>
  );
}
