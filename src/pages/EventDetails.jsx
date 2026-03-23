import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

const EventDetails = () => {

  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [registered, setRegistered] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  // 🔹 Fetch Event
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await API.get("/events");
        const found = res.data.find(e => e._id === id);
        setEvent(found);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEvent();
  }, [id]);

  // 🔹 Check if already registered
  useEffect(() => {
    const checkBooking = async () => {
      try {
        const res = await API.get(
          `/bookings/check/${user._id}/${id}`
        );
        setRegistered(res.data.registered);
      } catch (err) {
        console.error(err);
      }
    };

    if (user && id) {
      checkBooking();
    }
  }, [id]);

  // 🔹 Register function
  const handleRegister = async () => {
    try {
      const res = await API.post("/bookings/register", {
        userId: user._id,
        eventId: id
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

  if (!event) return <p className="text-white p-6">Loading...</p>;

  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-black min-h-screen text-white p-6">

      {/* Banner */}
      <img
        src={event.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"}
        className="w-full h-64 object-cover rounded-2xl mb-4 shadow-lg"
      />

      {/* Title */}
      <h1 className="text-3xl font-bold mb-3">{event.name}</h1>

      {/* Inline Info */}
      <div className="flex flex-wrap items-center gap-4 text-gray-300 text-sm mb-4">
        <span>📍 {event.location}</span>
        <span>📅 {new Date(event.date).toLocaleDateString()}</span>

        <span className="bg-purple-500/20 border border-purple-500 px-3 py-1 rounded-full text-xs text-purple-300">
          {event.category}
        </span>
      </div>

      {/* Department & Year */}
<div className="flex flex-wrap gap-4 mb-4 text-sm">

  {/* Department */}
  <div className="bg-white/10 border border-white/20 px-3 py-2 rounded-xl">
    <span className="text-gray-400 mr-2">Department:</span>
    <span className="text-white">
      {event.department?.join(", ") || "ALL"}
    </span>
  </div>

  {/* Year */}
  <div className="bg-white/10 border border-white/20 px-3 py-2 rounded-xl">
    <span className="text-gray-400 mr-2">Year:</span>
    <span className="text-white">
      {event.year?.join(", ") || "ALL"}
    </span>
  </div>

</div>

      {/* Description Section */}
      <div className="mt-4 bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-2xl">
        <h2 className="text-lg font-semibold mb-2">About Event</h2>
        <p className="text-gray-300">
  {event.description || "No description available"}
</p>
      </div>

      {/* Register Button */}
      <button
        onClick={handleRegister}
        disabled={registered}
        className={`mt-6 w-full py-3 text-lg font-semibold rounded-xl transition ${
          registered
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105"
        }`}
      >
        {registered ? "Already Registered ✅" : "Register Now"}
      </button>

    </div>
  );
};

export default EventDetails;