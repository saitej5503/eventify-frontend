import React, { useState } from "react";
import API from "../services/api";

const allOptions = ["tech", "sports", "music", "dance", "coding", "ai", "cricket", "kabaddi", "workshop", "seminar", "club", "networking"];

const Profile = () => {

  const user = JSON.parse(localStorage.getItem("user"));

  const [selected, setSelected] = useState(user?.interests || []);

  const toggleInterest = (value) => {
    if (selected.includes(value)) {
      setSelected(selected.filter(i => i !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  const handleSave = async () => {
    try {
      await API.put(`/users/update-interests/${user._id}`, {
        interests: selected
      });

      const updatedUser = { ...user, interests: selected };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("Interests updated!");

    } catch (err) {
      console.error(err);
      alert("Failed to update");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-6 text-white">

      <h1 className="text-2xl font-bold mb-6">👤 Profile</h1>

      {/* USER INFO CARD */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl mb-6">
        <h2 className="text-lg font-semibold mb-4">User Information</h2>

        <p className="text-gray-300">Name: <span className="text-white font-medium">{user?.name}</span></p>
        <p className="text-gray-300">Email: <span className="text-white font-medium">{user?.email}</span></p>
      </div>

      {/* INTEREST SELECTION */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl">

        <h2 className="text-lg font-semibold mb-4">Select Your Interests</h2>

        <div className="flex gap-3 flex-wrap mb-4">
          {allOptions.map(option => (
            <button
              key={option}
              onClick={() => toggleInterest(option)}
              className={`px-4 py-2 rounded-full transition ${
                selected.includes(option)
                  ? "bg-purple-600"
                  : "bg-white/10 border border-white/20 hover:bg-white/20"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {/* SELECTED INTERESTS PREVIEW */}
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-2">Selected:</p>
          <div className="flex gap-2 flex-wrap">
            {selected.length === 0 ? (
              <span className="text-gray-500 text-sm">No interests selected</span>
            ) : (
              selected.map((item, index) => (
                <span
                  key={index}
                  className="text-xs bg-blue-500 px-3 py-1 rounded-full"
                >
                  {item}
                </span>
              ))
            )}
          </div>
        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-xl transition"
        >
          Save Interests
        </button>

      </div>

    </div>
  );
};

export default Profile;