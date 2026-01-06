import { useState } from "react";
import API from "../api.js";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    await API.post("/auth/register", { email, password });
    window.location.href = "/login";
  };

  return (
    <form onSubmit={submit} className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl mb-4">Register</h2>

      <input
        className="border w-full p-2 mb-3"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="border w-full p-2 mb-3"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="bg-green-500 text-white px-4 py-2 rounded">
        Register
      </button>
    </form>
  );
}
