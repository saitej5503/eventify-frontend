import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/users/login", {
        email,
        password,
      });

      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/events");
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">

      {/* Glass Card */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl w-96 text-white">

        <h2 className="text-2xl font-bold text-center mb-6">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">

          {/* Email */}
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-purple-500"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-purple-500"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Button */}
          <button
            className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-xl font-semibold transition duration-300"
          >
            Login
          </button>

        </form>

        <p className="text-sm text-center mt-4 text-gray-300">
          Admin?{" "}
          <span
    onClick={() => navigate("/admin-login")}
    className="text-blue-400 cursor-pointer hover:underline"
  >
    Login here
  </span>
</p>

        {/* Register Link */}
        <p className="text-sm text-center mt-4 text-gray-300">
          Don’t have an account?{" "}
          <Link to="/register" className="text-purple-400 hover:underline">
            Register
          </Link>
        </p>

      </div>

    </div>
  );
};

export default UserLogin;