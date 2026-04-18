import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [events, setEvents] = useState([]);

  const [newEvent, setNewEvent] = useState({
    name: "",
    date: "",
    location: "",
    category: "",
    image: "",
    description: "",
    department: [],
    year: [],
  });

  const [editingEvent, setEditingEvent] = useState(null);

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

  const [participantsMap, setParticipantsMap] = useState({});
  const [winnerSelections, setWinnerSelections] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await API.get("/events");
      setEvents(res.data);

      const initialSelections = {};
      res.data.forEach((event) => {
        initialSelections[event._id] = {
          first: event.winners?.find((w) => w.position === "1st")?.user || "",
          second: event.winners?.find((w) => w.position === "2nd")?.user || "",
          third: event.winners?.find((w) => w.position === "3rd")?.user || "",
        };
      });
      setWinnerSelections(initialSelections);
    } catch (error) {
      console.error("Error fetching events:", error);
      alert("Failed to fetch events");
    }
  };

  const fetchParticipants = async (eventId) => {
    try {
      if (participantsMap[eventId]) return;

      const res = await API.get(`/bookings/event/${eventId}/participants`);

      setParticipantsMap((prev) => ({
        ...prev,
        [eventId]: res.data,
      }));
    } catch (error) {
      console.error("Error fetching participants:", error);
      alert("Failed to fetch participants");
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();

    try {
      await API.post("/events", newEvent);

      alert("Event added successfully!");

      setNewEvent({
        name: "",
        date: "",
        location: "",
        category: "",
        image: "",
        description: "",
        department: ["ALL"],
        year: ["ALL"],
      });

      fetchEvents();
    } catch (error) {
      console.error(error);
      alert("Failed to add event");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await API.delete(`/events/delete/${id}`);
      fetchEvents();
    } catch {
      alert("Error deleting event");
    }
  };

  const editEvent = (event) => {
    setEditingEvent(event);
    setName(event.name);
    setDate(event.date ? event.date.slice(0, 10) : "");
    setLocation(event.location);
    setCategory(event.category);
  };

  const updateEvent = async () => {
    try {
      await API.put(`/events/update/${editingEvent._id}`, {
        name,
        date,
        location,
        category,
      });

      alert("Event updated successfully");
      setEditingEvent(null);
      fetchEvents();
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);
      alert("Failed to update event");
    }
  };

  const handleWinnerSelection = (eventId, place, userId) => {
    setWinnerSelections((prev) => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        [place]: userId,
      },
    }));
  };

  const handleSaveWinners = async (eventId) => {
    try {
      const participants = participantsMap[eventId] || [];
      const selected = winnerSelections[eventId] || {};

      const firstUser = participants.find(
        (p) => String(p._id) === String(selected.first)
      );
      const secondUser = participants.find(
        (p) => String(p._id) === String(selected.second)
      );
      const thirdUser = participants.find(
        (p) => String(p._id) === String(selected.third)
      );

      const selectedIds = [selected.first, selected.second, selected.third].filter(Boolean);
      const uniqueIds = new Set(selectedIds);

      if (selectedIds.length !== uniqueIds.size) {
        alert("Same participant cannot be selected for multiple positions");
        return;
      }

      const winners = [
        firstUser && {
          user: firstUser._id,
          position: "1st",
          name: firstUser.name,
          department: firstUser.department || "",
          year: firstUser.year || "",
        },
        secondUser && {
          user: secondUser._id,
          position: "2nd",
          name: secondUser.name,
          department: secondUser.department || "",
          year: secondUser.year || "",
        },
        thirdUser && {
          user: thirdUser._id,
          position: "3rd",
          name: thirdUser.name,
          department: thirdUser.department || "",
          year: thirdUser.year || "",
        },
      ].filter(Boolean);

      await API.put(`/events/${eventId}/winners`, { winners });

      alert("Winners updated successfully");
      fetchEvents();
    } catch (error) {
      console.error("Error updating winners:", error);
      alert("Failed to update winners");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Admin Dashboard</h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <form
        onSubmit={handleAddEvent}
        className="bg-white p-6 rounded-lg shadow-md mb-6"
      >
        <h2 className="text-xl font-semibold mb-4">Add New Event</h2>

        <div className="grid grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Event Name"
            value={newEvent.name}
            onChange={(e) =>
              setNewEvent({ ...newEvent, name: e.target.value })
            }
            required
            className="border p-2 rounded"
          />

          <input
            type="date"
            value={newEvent.date}
            onChange={(e) =>
              setNewEvent({ ...newEvent, date: e.target.value })
            }
            required
            className="border p-2 rounded"
          />

          <input
            type="text"
            placeholder="Location"
            value={newEvent.location}
            onChange={(e) =>
              setNewEvent({ ...newEvent, location: e.target.value })
            }
            required
            className="border p-2 rounded"
          />

          <input
            type="text"
            placeholder="Image URL"
            value={newEvent.image}
            onChange={(e) =>
              setNewEvent({ ...newEvent, image: e.target.value })
            }
            className="border p-2 rounded"
          />

          <select
            value={newEvent.category}
            onChange={(e) =>
              setNewEvent({ ...newEvent, category: e.target.value })
            }
            required
            className="border p-2 rounded"
          >
            <option value="">Select Category</option>
            <option value="tech">Tech</option>
            <option value="coding">Coding</option>
            <option value="ai">AI</option>
            <option value="music">Music</option>
            <option value="dance">Dance</option>
            <option value="cricket">Cricket</option>
            <option value="kabaddi">Kabaddi</option>
          </select>

          <textarea
            placeholder="Event Description"
            value={newEvent.description}
            onChange={(e) =>
              setNewEvent({ ...newEvent, description: e.target.value })
            }
            className="border p-2 rounded col-span-4"
          ></textarea>
        </div>

        <div className="col-span-4 mt-4">
          <p className="mb-2 font-medium">Department:</p>

          {["CSE", "EEE", "MECH", "IT", "ALL"].map((dept) => (
            <label key={dept} className="mr-4">
              <input
                type="checkbox"
                checked={newEvent.department.includes(dept)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setNewEvent({
                      ...newEvent,
                      department: [...newEvent.department, dept],
                    });
                  } else {
                    setNewEvent({
                      ...newEvent,
                      department: newEvent.department.filter((d) => d !== dept),
                    });
                  }
                }}
              />
              <span className="ml-1">{dept}</span>
            </label>
          ))}
        </div>

        <div className="col-span-4 mt-4">
          <p className="mb-2 font-medium">Year:</p>

          {["I", "II", "III", "IV", "ALL"].map((yr) => (
            <label key={yr} className="mr-4">
              <input
                type="checkbox"
                checked={newEvent.year.includes(yr)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setNewEvent({
                      ...newEvent,
                      year: [...newEvent.year, yr],
                    });
                  } else {
                    setNewEvent({
                      ...newEvent,
                      year: newEvent.year.filter((y) => y !== yr),
                    });
                  }
                }}
              />
              <span className="ml-1">{yr}</span>
            </label>
          ))}
        </div>

        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Event
        </button>
      </form>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">All Events</h2>

        {events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          <div className="space-y-6">
            {events.map((event) => (
              <div
                key={event._id}
                className="border rounded-xl p-4 shadow-sm bg-gray-50"
              >
                <div className="grid md:grid-cols-6 gap-4 items-center">
                  <div>
                    <p className="font-semibold text-gray-800">{event.name}</p>
                    <p className="text-sm text-gray-500">{event.location}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Date</p>
                    <p className="text-sm text-gray-600">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Category</p>
                    <p className="text-sm text-gray-600">{event.category}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Main Category</p>
                    <p className="text-sm text-gray-600">
                      {event.mainCategory}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Results</p>
                    <p className="text-sm text-gray-600">
                      {event.resultStatus === "announced"
                        ? "Announced"
                        : "Pending"}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => editEvent(event)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(event._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {event.image && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Event Image</p>
                    <img
                      src={event.image}
                      alt={event.name}
                      className="w-40 h-24 object-cover rounded border"
                    />
                  </div>
                )}

                <div className="mt-5 border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-purple-700">
                      Manage Winners
                    </h3>

                    <button
                      onClick={() => fetchParticipants(event._id)}
                      className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                    >
                      View Participants
                    </button>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-gray-600">
                      Total Participants: {participantsMap[event._id]?.length || 0}
                    </p>
                  </div>

                  {!participantsMap[event._id] ? (
                    <p className="text-sm text-gray-500">
                      Click "View Participants" to load booked users.
                    </p>
                  ) : participantsMap[event._id].length === 0 ? (
                    <p className="text-sm text-red-500">
                      No participants booked for this event.
                    </p>
                  ) : (
                    <>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-white p-3 rounded border">
                          <p className="font-medium text-yellow-600 mb-2">
                            1st Place
                          </p>
                          <select
                            value={winnerSelections[event._id]?.first || ""}
                            onChange={(e) =>
                              handleWinnerSelection(
                                event._id,
                                "first",
                                e.target.value
                              )
                            }
                            className="w-full border p-2 rounded"
                          >
                            <option value="">Select Participant</option>
                            {participantsMap[event._id].map((participant) => (
                              <option key={participant._id} value={participant._id}>
                                {participant.name} - {participant.department} - {participant.year}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="bg-white p-3 rounded border">
                          <p className="font-medium text-gray-600 mb-2">
                            2nd Place
                          </p>
                          <select
                            value={winnerSelections[event._id]?.second || ""}
                            onChange={(e) =>
                              handleWinnerSelection(
                                event._id,
                                "second",
                                e.target.value
                              )
                            }
                            className="w-full border p-2 rounded"
                          >
                            <option value="">Select Participant</option>
                            {participantsMap[event._id].map((participant) => (
                              <option key={participant._id} value={participant._id}>
                                {participant.name} - {participant.department} - {participant.year}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="bg-white p-3 rounded border">
                          <p className="font-medium text-orange-700 mb-2">
                            3rd Place
                          </p>
                          <select
                            value={winnerSelections[event._id]?.third || ""}
                            onChange={(e) =>
                              handleWinnerSelection(
                                event._id,
                                "third",
                                e.target.value
                              )
                            }
                            className="w-full border p-2 rounded"
                          >
                            <option value="">Select Participant</option>
                            {participantsMap[event._id].map((participant) => (
                              <option key={participant._id} value={participant._id}>
                                {participant.name} - {participant.department} - {participant.year}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSaveWinners(event._id)}
                        className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Save Winners
                      </button>
                    </>
                  )}

                  {event.winners?.length > 0 && (
                    <div className="mt-4">
                      <p className="font-medium mb-2">Current Winners:</p>
                      <div className="space-y-1">
                        {event.winners.map((winner, index) => (
                          <p key={index} className="text-sm text-gray-700">
                            {winner.position} - {winner.name}
                            {winner.department ? ` (${winner.department})` : ""}
                            {winner.year ? ` - ${winner.year}` : ""}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Edit Event</h2>

            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="Event Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 rounded"
              />

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border p-2 rounded"
              />

              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border p-2 rounded"
              />

              <input
                type="text"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border p-2 rounded"
              />
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={updateEvent}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save Changes
              </button>

              <button
                onClick={() => setEditingEvent(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;