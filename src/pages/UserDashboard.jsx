import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import EventCard from "../components/EventCard";

const UserDashboard = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await API.get("/events");
    setEvents(res.data);
  };

  const bookEvent = async (eventId) => {
    try {
      await API.post("/bookings", {
        eventId,
        userEmail: localStorage.getItem("userEmail")
      });

      alert("Event booked successfully");

    } catch (error) {
      console.error(error);
      alert("Booking failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-6 text-white">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Explore Events 🎉</h2>

        <button
          onClick={() => navigate("/my-bookings")}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition"
        >
          My Bookings
        </button>
      </div>

      {/* Events Grid */}
      {events.length === 0 ? (
        <p className="text-center text-gray-400 mt-10">No events available</p>
      ) : (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">

          {events.map((event) => (
            <div key={event._id} className="relative">

              {/* Event Card */}
              <EventCard event={event} />

              {/* Book Button */}
              <button
                onClick={() => bookEvent(event._id)}
                className="absolute bottom-4 left-4 right-4 bg-green-600 hover:bg-green-700 py-2 rounded-xl text-sm"
              >
                Book Now
              </button>

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default UserDashboard;