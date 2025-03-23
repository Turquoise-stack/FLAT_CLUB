import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { Home } from "./pages/Home";
import HomeGuest from "./pages/HomeGuest";
import ListingCard from "./components/ListingCard"

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<HomeGuest/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
};

export default App;
