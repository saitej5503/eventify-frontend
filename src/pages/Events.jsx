import React, { useEffect, useState } from "react";
import API from "../services/api";
import EventCard from "../components/EventCard";

const Events = () => {

  const [events, setEvents] = useState([]);
  const [recommendedEvents, setRecommendedEvents] = useState([]);

  // ✅ Get user
  const user = JSON.parse(localStorage.getItem("user"));
  const userInterests = user?.interests || ["music"];

  console.log("Logged User:", user);
  console.log("User Interests:", userInterests);

  // ✅ Step 1: Map interest → mainCategory
  const mapToMainCategory = (interest) => {
    if (["tech", "coding", "ai"].includes(interest)) return "technical";
    if (["music", "dance"].includes(interest)) return "cultural";
    if (["cricket", "kabaddi", "sports"].includes(interest)) return "sports";
    if (["workshop", "seminar"].includes(interest)) return "workshop";
    return "club";
  };

  const fetchRecommendations = async (eventList) => {
    try {

      const userLocation = "chennai";

      // ✅ Step 2 & 3: Get allowed main categories
      const allowedMainCategories = userInterests.map(i =>
        mapToMainCategory(i.toLowerCase())
      );

      console.log("Allowed Main Categories:", allowedMainCategories);

      // ✅ Step 4: Filter by mainCategory first
      const mainFilteredEvents = eventList.filter(event =>
        allowedMainCategories.includes(event.mainCategory)
      );

      console.log("After mainCategory filter:", mainFilteredEvents);

      // ✅ Step 5: Call ML API
      const res = await API.post("/events/recommend", {
        user_interests: userInterests,
        location: userLocation
      });

      console.log("ML Response:", res.data);

      // ✅ Step 6: Combine ML + user interests
      const predictedCategories = (res.data.recommended_categories || []).map(c => c.toLowerCase());

      const finalCategories = [
        ...userInterests.map(i => i.toLowerCase()),
        ...predictedCategories
      ];

      console.log("Final Categories:", finalCategories);

      // ✅ Step 7: Final filtering
      const filteredEvents = mainFilteredEvents.filter(event => {
        const category = event.category?.toLowerCase().trim();
        const location = event.location?.toLowerCase().trim();
        // map event category to main type
       const mappedCategory =
  ["cricket","kabaddi","sports"].includes(category) ? "sports" :
  ["tech","coding","ai"].includes(category) ? "tech" :
  ["music","dance"].includes(category) ? "music" :
  ["workshop","seminar"].includes(category) ? "workshop" :
  ["club","gaming","photography"].includes(category) ? "club" :
  category;

        return finalCategories.includes(mappedCategory) && location === userLocation;
      });

      console.log("Final Recommended Events:", filteredEvents);

      // ✅ Step 8
      setRecommendedEvents(filteredEvents);

    } catch (error) {
      console.error("Recommendation error:", error);
    }
  };

  const fetchEvents = async () => {
    try {
      console.log("Fetching events...");

      const { data } = await API.get("/events");

      console.log("Events:", data);

      setEvents(data);

      fetchRecommendations(data);

    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
 <div className="flex bg-gradient-to-br from-black via-gray-900 to-black min-h-screen text-white">

    {/* Sidebar */}
    

    {/* Main Content */}
    <div className="flex-1 p-6">

      {/* ⭐ Recommended */}
      <h2 className="text-2xl font-bold text-white drop-shadow-lg">      
          ⭐ Recommended For You
      </h2>

      {recommendedEvents.length === 0 ? (
        <p>No recommended events</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendedEvents.map((event) => (
          <EventCard key={event._id} event={event} />
         ))}
        </div>
      )}

      {/* 📅 Explore */}
      <h2 className="text-2xl font-bold text-white drop-shadow-lg">
        📅 Explore More Events
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {events
        .filter(event => !recommendedEvents.some(r => r._id === event._id))
        .map((event) => (
          <EventCard key={event._id} event={event} />
       ))}
      </div>

    </div>
  </div>
);
};

export default Events;