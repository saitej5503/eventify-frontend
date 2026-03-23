import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
const Landing = () => {

  const navigate = useNavigate();
  const text = "Find events you'll love 🎉";
const [displayText, setDisplayText] = useState("");

useEffect(() => {
  let i = 0;
  const interval = setInterval(() => {
    setDisplayText(text.slice(0, i));
    i++;
    if (i > text.length) clearInterval(interval);
  }, 50);

  return () => clearInterval(interval);
}, []);

  return (
<div className="min-h-screen flex flex-col items-center justify-center text-white relative overflow-hidden bg-[linear-gradient(270deg,#0f172a,#581c87,#020617)] bg-[length:400%_400%] animate-gradient">
    {/* Floating Cards */}
<div className="absolute top-24 left-16 hidden md:block animate-float">
  <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-sm shadow-lg">
    🎵 Music Fest
  </div>
</div>

<div className="absolute bottom-24 right-16 hidden md:block animate-float delay-200">
  <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-sm shadow-lg">
    💻 Hackathon
  </div>
</div>
      {/* Glow Effect */}
      <div className="absolute w-[500px] h-[500px] bg-purple-600 opacity-30 blur-3xl rounded-full top-[-100px] left-[-100px]"></div>
      <div className="absolute w-[400px] h-[400px] bg-pink-500 opacity-30 blur-3xl rounded-full bottom-[-100px] right-[-100px]"></div>
      
      {/* Content */}
      <div className="text-center z-10 px-6">

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
  Eventify ✨
</h1>
       <h2 className="text-2xl md:text-3xl font-semibold mb-3">
  Discover Events That <span className="text-purple-400">Match You</span>
</h2>

        <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
  Find and book events tailored to your interests.
</p>

        {/* Buttons */}
        <div className="flex gap-4 justify-center flex-wrap">

          <button
            onClick={() => navigate("/login")}
className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:scale-110 hover:shadow-xl transition duration-300"          >
            Get Started
          </button>

          <button
            onClick={() => navigate("/admin-login")}
            className="px-6 py-3 border border-white/30 rounded-xl hover:bg-white/10 transition"
          >
            Admin Login
          </button>

        </div>

      </div>

    </div>
  );
};

export default Landing;