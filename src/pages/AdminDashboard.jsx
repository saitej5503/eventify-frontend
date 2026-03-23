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
    year: []

  });

  const [editingEvent, setEditingEvent] = useState(null);

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

  const navigate = useNavigate();

  // Fetch events
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await API.get("/events");
      setEvents(res.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      alert("Failed to fetch events");
    }
  };

  // Add Event
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
        year: ["ALL"]

      });

      fetchEvents();

    } catch (error) {
      console.error(error);
      alert("Failed to add event");
    }
  };

  // Delete Event
  const handleDelete = async (id) => {

    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await API.delete(`/events/delete/${id}`);
      fetchEvents();
    } catch {
      alert("Error deleting event");
    }
  };

  // Edit Event
  const editEvent = (event) => {
    setEditingEvent(event);

    setName(event.name);
    setDate(event.date);
    setLocation(event.location);
    setCategory(event.category);
  };

  // Update Event
  const updateEvent = async () => {

    try {

      await API.put(`/events/update/${editingEvent._id}`, {
        name,
        date,
        location,
        category
      });

      alert("Event updated successfully");

      setEditingEvent(null);

      fetchEvents();

    } catch (error) {

      console.error("Update error:", error.response?.data || error.message);
      alert("Failed to update event");

    }
  };

  // Logout
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

      {/* Add Event Form */}

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

        <div className="col-span-4">
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
              department: [...newEvent.department, dept]
            });
          } else {
            setNewEvent({
              ...newEvent,
              department: newEvent.department.filter(d => d !== dept)
            });
          }
        }}
      />
      <span className="ml-1">{dept}</span>
    </label>
  ))}
</div>
       
       <div className="col-span-4">
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
              year: [...newEvent.year, yr]
            });
          } else {
            setNewEvent({
              ...newEvent,
              year: newEvent.year.filter(y => y !== yr)
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

      {/* Event List */}

      <div className="bg-white p-6 rounded-lg shadow-md">

        <h2 className="text-xl font-semibold mb-4">All Events</h2>

        {events.length === 0 ? (
          <p>No events found.</p>
        ) : (

          <table className="w-full border">

            <thead>
              <tr className="bg-gray-200">

                <th className="p-2 border">Name</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Location</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Main Category</th>
                <th className="p-2 border">Actions</th>

              </tr>
            </thead>

            <tbody>

              {events.map((event) => (

                <tr key={event._id}>

                  <td className="p-2 border">{event.name}</td>
                  <td className="p-2 border">{event.date}</td>
                  <td className="p-2 border">{event.location}</td>
                  <td className="p-2 border">{event.category}</td>
                  <td className="p-2 border">{event.mainCategory}</td>

                  <td className="p-2 border text-center">

                    <button
                      onClick={() => editEvent(event)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(event._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

      {/* Edit Modal */}

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