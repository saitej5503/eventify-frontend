import { useState } from "react";
import API from "../services/api";

const Register = () => {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    interests: "",
    department: "",
    year: ""

  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/users/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        interests: form.interests,
        department: form.department || "ALL",
        year: form.year || "ALL"
      });

      console.log(res.data);

      alert("User registered successfully");

      // clear form
      setForm({
        name: "",
        email: "",
        password: "",
        interests: "",
        department: "",
        year: ""
      });

    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black">

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl w-96 text-white">

        <h2 className="text-2xl font-bold text-center mb-6">
          Create Account ✨
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Enter your name"
            value={form.name}
            onChange={(e)=>setForm({...form,name:e.target.value})}
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <input
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={(e)=>setForm({...form,email:e.target.value})}
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <input
            type="password"
            placeholder="Create password"
            value={form.password}
            onChange={(e)=>setForm({...form,password:e.target.value})}
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <input
            type="text"
            placeholder="Interests (music, tech, sports, cultural)"
            value={form.interests}
            onChange={(e)=>setForm({...form,interests:e.target.value})}
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="text"
            placeholder="Department"
            value={form.department}
            onChange={(e)=>setForm({...form,department:e.target.value})}
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="text"
            placeholder="Year"
            value={form.year}
            onChange={(e)=>setForm({...form,year:e.target.value})}
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-purple-500"
          />


          <button
            className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-xl font-semibold transition duration-300"
          >
            Register
          </button>

        </form>

      </div>

    </div>
  );
};

export default Register;