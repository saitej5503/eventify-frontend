import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Landing from "./pages/Landing";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Register from "./pages/Register";
import UserLogin from "./pages/UserLogin";

import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import MyBookings from "./pages/MyBookings";
import AllEvents from "./pages/AllEvents";
import Profile from "./pages/Profile";
import UserDashboard from "./pages/UserDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        {/* Protected with Layout */}
        <Route
          path="/events"
          element={
            <Layout>
              <Events />
            </Layout>
          }
        />

        <Route
          path="/dashboard"
          element={
            <Layout>
              <UserDashboard />
            </Layout>
          }
        />

        <Route
          path="/bookings"
          element={
            <Layout>
              <MyBookings />
            </Layout>
          }
        />

        <Route
          path="/all-events"
          element={
            <Layout>
              <AllEvents />
            </Layout>
          }
        />

        <Route
          path="/event/:id"
          element={
            <Layout>
              <EventDetails />
            </Layout>
          }
        />

        <Route
          path="/profile"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;