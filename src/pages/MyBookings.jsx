import { useEffect, useState } from "react";
import API from "../services/api";

const getStatusColor = (status) => {
  if (status === "Upcoming") return "bg-green-500";
  if (status === "Ongoing") return "bg-yellow-500 text-black";
  if (status === "Completed") return "bg-red-500";
  return "bg-gray-500";
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user?._id) {
      fetchBookings();
    }
  }, [user?._id]);

  const fetchBookings = async () => {
    try {
      const res = await API.get(`/bookings/${user._id}`);
      setBookings(res.data);
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
          eventId,
        },
      });

      alert(res.data.message);

      setBookings((prev) =>
        prev.filter((booking) => String(booking.eventId) !== String(eventId))
      );
    } catch (err) {
      console.error("Error unregistering:", err);
      alert("Failed to unregister");
    }
  };

  const getCurrentUserWinner = (winners = []) => {
    return winners.find(
      (winner) =>
        String(winner.user) === String(user?._id) ||
        String(winner.user?._id) === String(user?._id) ||
        winner.name?.toLowerCase() === user?.name?.toLowerCase()
    );
  };

  return (
    <div className="flex bg-gradient-to-br from-black via-gray-900 to-black min-h-screen text-white">
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-6">🎟 My Bookings</h2>

        {bookings.length === 0 ? (
          <p className="text-gray-400">No bookings yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => {
              const event = booking.event;
              if (!event) return null;

              const currentWinner = getCurrentUserWinner(event.winners || []);
              const isCompleted = event.eventStatus === "Completed";

              return (
                <div
                  key={booking._id}
                  className="bg-white/10 backdrop-blur-lg p-4 rounded-xl shadow-lg border border-white/10"
                >
                  <img
                    src={
                      event.image ||
                      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
                    }
                    alt={event.name}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />

                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{event.name}</h3>

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

                  <p className="text-sm text-gray-300 mt-1">
                    📅 {new Date(event.date).toLocaleDateString()}
                  </p>

                  <p className="text-sm text-gray-300">
                    📍 {event.location}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="inline-block px-3 py-1 bg-purple-500 rounded-full text-xs">
                      {event.category}
                    </span>

                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs ${
                        event.resultStatus === "announced"
                          ? "bg-emerald-600"
                          : "bg-gray-600"
                      }`}
                    >
                      {event.resultStatus === "announced"
                        ? "Results Announced"
                        : "Results Pending"}
                    </span>
                  </div>

                  {currentWinner && (
                    <div className="mt-4 bg-yellow-500/20 border border-yellow-400 rounded-xl p-3 text-yellow-300">
                      🎉 Congratulations! You secured {currentWinner.position} place.
                    </div>
                  )}

                  <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-2">🏆 Winners</h4>

                    {event.resultStatus !== "announced" || !event.winners?.length ? (
                      <p className="text-xs text-gray-400">
                        Winners not announced yet.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {event.winners.map((winner, index) => (
                          <div
                            key={index}
                            className="bg-white/5 border border-white/10 rounded-lg p-2"
                          >
                            <p className="text-sm font-medium">
                              {winner.position} - {winner.name}
                            </p>

                            {winner.department && (
                              <p className="text-xs text-gray-400">
                                Dept: {winner.department}
                              </p>
                            )}

                            {winner.year && (
                              <p className="text-xs text-gray-400">
                                Year: {winner.year}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleUnregister(event._id)}
                    disabled={isCompleted}
                    className={`mt-4 w-full py-2 rounded-lg font-medium transition ${
                      isCompleted
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {isCompleted ? "Event Completed" : "Unregister"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;