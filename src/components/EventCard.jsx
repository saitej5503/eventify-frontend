import React from "react";
import { useNavigate } from "react-router-dom";
import Poster from "./Poster";

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/event/${event._id}`)}
      className="cursor-pointer bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
    >

      {/* Poster */}
      <Poster event={event} />

      {/* Content */}
     <div className="p-4 text-white">

  {/* Title */}
  <h3 className="text-md font-semibold text-gray-200 mb-2">
    {event.name}
  </h3>

  {/* Location + Date (single line) */}
  <p className="text-xs text-gray-400 mb-3">
    📍 {event.location} • 📅 {new Date(event.date).toLocaleDateString()}
  </p>

  {/* All Info as Chips */}
  <div className="flex flex-wrap gap-2 mb-4">

    <span className="text-xs bg-purple-500 px-2 py-1 rounded-full">
      {event.category}
    </span>

    {event.mainCategory && (
      <span className="text-xs bg-blue-500 px-2 py-1 rounded-full">
        {event.mainCategory}
      </span>
    )}

    {event.department && (
      <span className="text-xs bg-white/10 border border-white/20 px-2 py-1 rounded-full">
        🎓 {event.department.join(",")}
      </span>
    )}

    {event.year && (
      <span className="text-xs bg-white/10 border border-white/20 px-2 py-1 rounded-full">
        📚 {event.year.join(",")}
      </span>
    )}

  </div>

  {/* Button */}
  <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-2 rounded-lg hover:opacity-90 transition">
    View Details
  </button>

</div>
    </div>
  );
};

export default EventCard;