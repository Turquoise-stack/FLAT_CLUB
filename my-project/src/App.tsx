import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import HomeGuest from "./pages/HomeGuest";
import Search from "./pages/Listings";
import Searchgroups from "./pages/Groups";
import UserProfile from "./pages/ProfileEdit";
import UserProfileView from "./pages/UserProfileView";
import CreateGroup from "./pages/CreateGroup";
import CreateListing from "./pages/CreateListing";
import SingleListing from "./pages/SingleListing";
import SingleGroupView from "./pages/SingleGroupView";
import PasswordReset from "./pages/PasswordReset";
import SearchResults from "./pages/SearchResults";

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<HomeGuest/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<Search />} />
        <Route path="/listings" element={<Search />} />
        <Route path="/groups" element={<Searchgroups />} />
        <Route path="/profileedit" element={<UserProfile />} />
        <Route path="/profileview" element={<UserProfileView />} />
        <Route path="/createGroup" element={<CreateGroup/>} />
        <Route path="/createListing" element={<CreateListing/>} />
        <Route path="/listing/:id" element={<SingleListing/>} />
        <Route path="/group/:id" element={<SingleGroupView/>} />
        <Route path="/password-reset" element={<PasswordReset />} />
        <Route path="/search-results" element={<SearchResults />} />

      </Routes>
    </Router>
  );
};

export default App;
