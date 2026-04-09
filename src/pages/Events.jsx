import React, { useEffect, useState } from "react";
import API from "../services/api";
import EventCard from "../components/EventCard";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Get user
  const user = JSON.parse(localStorage.getItem("user"));
  const userInterests = user?.interests || ["music"];

  console.log("👤 Logged User:", user);
  console.log("🎯 User Interests:", userInterests);

  // ✅ Map interest → mainCategory
  const mapToMainCategory = (interest) => {
    if (["tech", "coding", "ai"].includes(interest)) return "technical";
    if (["music", "dance"].includes(interest)) return "cultural";
    if (["cricket", "kabaddi", "sports"].includes(interest)) return "sports";
    if (["workshop", "seminar"].includes(interest)) return "workshop";
    return "club";
  };

  const fetchRecommendations = async (eventList) => {
    try {
      console.log("🚀 Starting Recommendation Process...");

      const userLocation = "chennai";
      console.log("📍 User Location:", userLocation);

      // Step 1: Allowed main categories
      const allowedMainCategories = userInterests.map((i) =>
        mapToMainCategory(i.toLowerCase())
      );

      console.log("🧠 Allowed Main Categories:", allowedMainCategories);

      // Step 2: Filter by mainCategory
      const mainFilteredEvents = eventList.filter((event) =>
        allowedMainCategories.includes(event.mainCategory)
      );

      console.log("📊 After mainCategory filter:", mainFilteredEvents);

      // Step 3: Call ML API
      console.log("📡 Calling ML API...");
      const res = await API.post("/events/recommend", {
        user_interests: userInterests,
        location: userLocation,
      });

      console.log("🤖 ML Response:", res.data);

      // Step 4: Combine categories
      const predictedCategories = (res.data.recommended_categories || []).map(
        (c) => c.toLowerCase()
      );

      console.log("🔮 Predicted Categories:", predictedCategories);

      const finalCategories = [
        ...userInterests.map((i) => i.toLowerCase()),
        ...predictedCategories,
      ];

      console.log("🎯 Final Categories Used:", finalCategories);

      // Step 5: Final filtering
      const filteredEvents = mainFilteredEvents.filter((event) => {
        const category = event.category?.toLowerCase().trim();
        const location = event.location?.toLowerCase().trim();

        const mappedCategory =
          ["cricket", "kabaddi", "sports"].includes(category)
            ? "sports"
            : ["tech", "coding", "ai"].includes(category)
            ? "tech"
            : ["music", "dance"].includes(category)
            ? "music"
            : ["workshop", "seminar"].includes(category)
            ? "workshop"
            : ["club", "gaming", "photography"].includes(category)
            ? "club"
            : category;

        return (
          finalCategories.includes(mappedCategory) &&
          location === userLocation
        );
      });

      console.log("✅ Final Recommended Events:", filteredEvents);

      setRecommendedEvents(filteredEvents);
    } catch (error) {
      console.error("❌ Recommendation error:", error);
    }
  };

  const fetchEvents = async () => {
    try {
      console.log("📥 Fetching events from backend...");

      const { data } = await API.get("/events");

      console.log("📦 All Events:", data);

      setEvents(data);

      fetchRecommendations(data);
    } catch (error) {
      console.error("❌ Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // ✅ Search Logic
  const matchesSearch = (event) => {
    const term = searchTerm.toLowerCase().trim();

    if (!term) return true;

    const isMatch =
      event.name?.toLowerCase().includes(term) ||
      event.category?.toLowerCase().includes(term) ||
      event.mainCategory?.toLowerCase().includes(term) ||
      event.location?.toLowerCase().includes(term);

    if (isMatch) {
      console.log("🔍 Match Found:", event.name);
    }

    return isMatch;
  };

  const filteredRecommendedEvents = recommendedEvents.filter(matchesSearch);

  const filteredExploreEvents = events
    .filter((event) => !recommendedEvents.some((r) => r._id === event._id))
    .filter(matchesSearch);

  console.log("🔎 Search Term:", searchTerm);
  console.log("⭐ Filtered Recommended:", filteredRecommendedEvents);
  console.log("📅 Filtered Explore:", filteredExploreEvents);

  return (
    <div className="flex bg-gradient-to-br from-black via-gray-900 to-black min-h-screen text-white">
      <div className="flex-1 p-6">

        {/* 🔍 Search Box */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => {
              console.log("⌨️ Search Input:", e.target.value);
              setSearchTerm(e.target.value);
            }}
            className="w-full md:w-96 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        {/* ⭐ Recommended */}
        <h2 className="text-2xl font-bold mb-4">⭐ Recommended For You</h2>

        {filteredRecommendedEvents.length === 0 ? (
          <p className="text-gray-400 mb-8">
            No recommended events match your search.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {filteredRecommendedEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}

        {/* 📅 Explore */}
        <h2 className="text-2xl font-bold mb-4">📅 Explore More Events</h2>

        {filteredExploreEvents.length === 0 ? (
          <p className="text-gray-400">No events match your search.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredExploreEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;