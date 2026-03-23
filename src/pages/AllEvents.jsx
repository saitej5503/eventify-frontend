import React, { useEffect, useState } from "react";
import API from "../services/api";
import Poster from "../components/Poster";
import { useNavigate } from "react-router-dom";
const AllEvents = () => {

  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await API.get("/events");
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-900 to-black min-h-screen text-white">

      <h1 className="text-2xl font-bold mb-6">
      📅 All Events
      </h1>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {events.map((event) => (
          <div
             key={event._id}
            onClick={() => navigate(`/event/${event._id}`)}
            className="cursor-pointer hover:scale-105 transition">
            <Poster event={event} />
         </div>
        ))}

      </div>

    </div>
  );
};

export default AllEvents;