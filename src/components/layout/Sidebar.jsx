import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Calendar, Book, User, LogOut } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const menu = [
    { name: "Home", path: "/events", icon: <Home size={18} /> },
    { name: "My Bookings", path: "/bookings", icon: <Book size={18} /> },
    { name: "All Events", path: "/all-events", icon: <Calendar size={18} /> },
    { name: "Profile", path: "/profile", icon: <User size={18} /> },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="w-64 h-screen bg-white/10 backdrop-blur-xl border-r border-white/10 text-white flex flex-col justify-between">

      {/* Top Section */}
      <div>
        <h1 className="text-2xl font-bold p-6 tracking-wide">
          Eventify ✨
        </h1>

        {/* Menu */}
        <div className="px-4 space-y-2">
          {menu.map((item, index) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-purple-600/40 shadow-lg border border-purple-500"
                    : "hover:bg-white/10 hover:translate-x-1"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-white/10">
        <div className="mb-3">
          <p className="text-sm text-gray-300">Logged in as</p>
          <p className="font-semibold">{user?.name}</p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full bg-red-500 hover:bg-red-600 py-2 rounded-xl transition"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;