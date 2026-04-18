import React from "react";
import { useNavigate } from "react-router-dom";
import Poster from "./Poster";

const getStatusColor = (status) => {
  if (status === "Upcoming") return "bg-green-500";
  if (status === "Ongoing") return "bg-yellow-500 text-black";
  if (status === "Completed") return "bg-red-500";
  return "bg-gray-500";
};

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

        {/* Title + Status */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-md font-semibold text-gray-200">
            {event.name}
          </h3>

          {event.eventStatus && (
            <span
              className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                event.eventStatus
              )}`}
            >
              {event.eventStatus}
            </span>
          )}
        </div>

        {/* Location + Date */}
        <p className="text-xs text-gray-400 mb-3">
          📍 {event.location} • 📅{" "}
          {new Date(event.date).toLocaleDateString()}
        </p>

        {/* Chips */}
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

          {/* Result Status */}
          {event.resultStatus === "announced" && (
            <span className="text-xs bg-emerald-600 px-2 py-1 rounded-full">
              🏆 Results Announced
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