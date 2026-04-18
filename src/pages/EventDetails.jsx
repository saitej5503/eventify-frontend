import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

const getStatusColor = (status) => {
  if (status === "Upcoming") return "bg-green-500";
  if (status === "Ongoing") return "bg-yellow-500 text-black";
  if (status === "Completed") return "bg-red-500";
  return "bg-gray-500";
};

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [registered, setRegistered] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch single event
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await API.get(`/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error("Error fetching event details:", err);
      }
    };

    fetchEvent();
  }, [id]);

  // Check if already registered
  useEffect(() => {
    const checkBooking = async () => {
      try {
        const res = await API.get(`/bookings/check/${user._id}/${id}`);
        setRegistered(res.data.registered);
      } catch (err) {
        console.error("Error checking booking:", err);
      }
    };

    if (user && id) {
      checkBooking();
    }
  }, [id, user]);

  // Register function
  const handleRegister = async () => {
    try {
      const res = await API.post("/bookings/register", {
        userId: user._id,
        eventId: id,
      });

      alert(res.data.message);

      if (res.data.message === "Registered successfully") {
        setRegistered(true);
      }
    } catch (err) {
      console.error(err);
      alert("Error registering");
    }
  };

  const isCompleted = event?.eventStatus === "Completed";

  if (!event) return <p className="text-white p-6">Loading...</p>;

  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-black min-h-screen text-white p-6">
      {/* Banner */}
      <img
        src={
          event.image ||
          "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
        }
        alt={event.name}
        className="w-full h-64 object-cover rounded-2xl mb-4 shadow-lg"
      />

      {/* Title */}
      <h1 className="text-3xl font-bold mb-3">{event.name}</h1>

      {/* Inline Info */}
      <div className="flex flex-wrap items-center gap-3 text-gray-300 text-sm mb-4">
        <span>📍 {event.location}</span>
        <span>📅 {new Date(event.date).toLocaleDateString()}</span>

        <span className="bg-purple-500/20 border border-purple-500 px-3 py-1 rounded-full text-xs text-purple-300">
          {event.category}
        </span>

        {event.mainCategory && (
          <span className="bg-blue-500/20 border border-blue-500 px-3 py-1 rounded-full text-xs text-blue-300">
            {event.mainCategory}
          </span>
        )}

        {event.eventStatus && (
          <span
            className={`px-3 py-1 rounded-full text-xs ${getStatusColor(
              event.eventStatus
            )}`}
          >
            {event.eventStatus}
          </span>
        )}

        <span
          className={`px-3 py-1 rounded-full text-xs ${
            event.resultStatus === "announced"
              ? "bg-emerald-600 text-white"
              : "bg-gray-600 text-white"
          }`}
        >
          {event.resultStatus === "announced"
            ? "Results Announced"
            : "Results Pending"}
        </span>
      </div>

      {/* Department & Year */}
      <div className="flex flex-wrap gap-4 mb-4 text-sm">
        <div className="bg-white/10 border border-white/20 px-3 py-2 rounded-xl">
          <span className="text-gray-400 mr-2">Department:</span>
          <span className="text-white">
            {event.department?.join(", ") || "ALL"}
          </span>
        </div>

        <div className="bg-white/10 border border-white/20 px-3 py-2 rounded-xl">
          <span className="text-gray-400 mr-2">Year:</span>
          <span className="text-white">{event.year?.join(", ") || "ALL"}</span>
        </div>
      </div>

      {/* Description */}
      <div className="mt-4 bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-2xl">
        <h2 className="text-lg font-semibold mb-2">About Event</h2>
        <p className="text-gray-300">
          {event.description || "No description available"}
        </p>
      </div>

      {/* Winners Section */}
      <div className="mt-6 bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-2xl">
        <h2 className="text-lg font-semibold mb-3">🏆 Winners</h2>

        {event.resultStatus !== "announced" || !event.winners?.length ? (
          <p className="text-gray-400">
            Winners will be announced after the event.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {event.winners.map((winner, index) => (
              <div
                key={index}
                className="bg-white/10 border border-white/20 rounded-xl p-4"
              >
                <h3 className="text-yellow-400 font-semibold mb-2">
                  {winner.position} Place
                </h3>
                <p className="text-white font-medium">{winner.name}</p>

                {winner.department && (
                  <p className="text-sm text-gray-400">
                    Dept: {winner.department}
                  </p>
                )}

                {winner.year && (
                  <p className="text-sm text-gray-400">Year: {winner.year}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Register Button */}
      <button
        onClick={handleRegister}
        disabled={registered || isCompleted}
        className={`mt-6 w-full py-3 text-lg font-semibold rounded-xl transition ${
          registered || isCompleted
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105"
        }`}
      >
        {registered
          ? "Already Registered ✅"
          : isCompleted
          ? "Event Completed"
          : "Register Now"}
      </button>
    </div>
  );
};

export default EventDetails;