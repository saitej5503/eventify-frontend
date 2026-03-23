import { useEffect, useState } from "react";
import API from "../services/api";


const MyBookings = () => {

  const [bookedEvents, setBookedEvents] = useState([]);

  // ✅ Get logged-in user
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user?._id) {
      fetchBookings();
    }
  }, []);

  const fetchBookings = async () => {
    try {

      // 🔹 1. Get bookings using userId
      const res = await API.get(`/bookings/${user._id}`);
      const bookings = res.data;

      // 🔹 2. Get all events
      const eventsRes = await API.get("/events");
      const events = eventsRes.data;

      // 🔹 3. Match bookings with events
      const myEvents = events.filter(event =>
        bookings.some(b => String(b.eventId) === String(event._id))
      );

      setBookedEvents(myEvents);

    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
    console.log("User:", user);
console.log("Bookings API:", MyBookings);
  };

  return (
    <div className="flex bg-gradient-to-br from-black via-gray-900 to-black min-h-screen text-white">

      {/* Sidebar */}
      

      {/* Main Content */}
      <div className="flex-1 p-6">

        <h2 className="text-2xl font-bold mb-6">🎟 My Bookings</h2>

        {bookedEvents.length === 0 ? (
          <p className="text-gray-400">No bookings yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {bookedEvents.map(event => (
              <div
                key={event._id}
                className="bg-white/10 backdrop-blur-lg p-4 rounded-xl shadow-lg"
              >

                {/* Event Image */}
                <img
                  src={
                    event.image ||
                    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
                  }
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />

                {/* Event Info */}
                <h3 className="text-lg font-semibold">{event.name}</h3>

                <p className="text-sm text-gray-300">
                  📅 {new Date(event.date).toLocaleDateString()}
                </p>

                <p className="text-sm text-gray-300">
                  📍 {event.location}
                </p>

                <span className="inline-block mt-2 px-3 py-1 bg-purple-500 rounded-full text-xs">
                  {event.category}
                </span>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
};

export default MyBookings;