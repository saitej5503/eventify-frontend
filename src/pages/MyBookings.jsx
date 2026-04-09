import { useEffect, useState } from "react";
import API from "../services/api";

const MyBookings = () => {
  const [bookedEvents, setBookedEvents] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user?._id) {
      fetchBookings();
    }
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await API.get(`/bookings/${user._id}`);
      const bookings = res.data;

      const eventsRes = await API.get("/events");
      const events = eventsRes.data;

      const myEvents = events.filter((event) =>
        bookings.some((b) => String(b.eventId) === String(event._id))
      );

      setBookedEvents(myEvents);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const handleUnregister = async (eventId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to unregister from this event?"
    );

    if (!confirmDelete) return;

    try {
      const res = await API.delete("/bookings/unregister", {
        data: {
          userId: user._id,
          eventId
        }
      });

      alert(res.data.message);

      setBookedEvents((prev) =>
        prev.filter((event) => String(event._id) !== String(eventId))
      );
    } catch (err) {
      console.error("Error unregistering:", err);
      alert("Failed to unregister");
    }
  };

  return (
    <div className="flex bg-gradient-to-br from-black via-gray-900 to-black min-h-screen text-white">
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-6">🎟 My Bookings</h2>

        {bookedEvents.length === 0 ? (
          <p className="text-gray-400">No bookings yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bookedEvents.map((event) => (
              <div
                key={event._id}
                className="bg-white/10 backdrop-blur-lg p-4 rounded-xl shadow-lg border border-white/10"
              >
                <img
                  src={
                    event.image ||
                    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
                  }
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />

                <h3 className="text-lg font-semibold">{event.name}</h3>

                <p className="text-sm text-gray-300 mt-1">
                  📅 {new Date(event.date).toLocaleDateString()}
                </p>

                <p className="text-sm text-gray-300">
                  📍 {event.location}
                </p>

                <span className="inline-block mt-2 px-3 py-1 bg-purple-500 rounded-full text-xs">
                  {event.category}
                </span>

                <button
                  onClick={() => handleUnregister(event._id)}
                  className="mt-4 w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg font-medium transition"
                >
                  Unregister
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;