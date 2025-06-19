import React, { useEffect, useState } from "react";
import {
  Box, Container, Typography, Grid, Button, Divider, Paper, Card, CardContent, CardMedia
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/api";
import Footer from "../components/Footer";
import getCurrentUserId from "../utils/getCurrentUserId";

const UserProfileView = () => {
  const [userData, setUserData] = useState<any>(null);
  const [userListings, setUserListings] = useState<any[]>([]);
  const [userGroups, setUserGroups] = useState<any[]>([]);
  const [allListings, setAllListings] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = getCurrentUserId();
    if (!userId) {
      alert("You must be logged in.");
      navigate("/login");
      return;
    }

    fetchUser(userId);
    fetchListingsAndGroups(userId);
  }, []);

  const fetchUser = async (userId: number) => {
    try {
      const res = await api.get(`/users/${userId}`);
      setUserData(res.data);
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    }
  };

  const fetchListingsAndGroups = async (userId: number) => {
    try {
      const listingsRes = await api.get("/listings/search");
      setAllListings(listingsRes.data);

      const filteredListings = listingsRes.data.filter(
        (listing: any) => listing.owner_id === Number(userId)
      );
      setUserListings(filteredListings);

      const groupsRes = await api.get("/groups");
      const filteredGroups = groupsRes.data.filter(
        (group: any) => group.owner_id === Number(userId)
      );
      setUserGroups(filteredGroups);
    } catch (err) {
      console.error("Failed to fetch listings or groups:", err);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmDelete) return;

    const userId = getCurrentUserId();
    if (!userId) return;

    try {
      await api.delete(`/users/${userId}`);
      localStorage.removeItem("token");
      alert("Account deleted successfully.");
      navigate("/login");
    } catch (err) {
      console.error("Failed to delete account:", err);
      alert("Error deleting account. Please try again later.");
    }
  };

  if (!userData) return <Typography>Loading...</Typography>;

  const { name, surname, username, bio, phone_number, preferences, pets } = userData;

  const getListingImage = (listingId: number | null) => {
    if (!listingId) return "/assets/default-image.jpg";
    const listing = allListings.find((l) => l.listing_id === listingId);
    if (listing && listing.images && listing.images.length > 0) {
      const cleaned = listing.images[0].replace(/^uploads\//, "");
      return `/uploads/${cleaned}`;
    }
    return "/assets/default-image.jpg";
  };



  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: `url("/assets/home.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflowX: "hidden",
      }}
    >
      <Navbar />
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Paper
          elevation={4}
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.85)",
            p: { xs: 2, sm: 4 },
            borderRadius: 4,
            mt: { xs: 6, md: 10 },
            backdropFilter: "blur(6px)",
            boxShadow: 5,
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h5">Your Profile</Typography>
            <Box>
              <Button variant="outlined" sx={{ mr: 2 }} onClick={() => navigate("/profileedit")}>Edit Profile</Button>
              <Button variant="contained" color="error" onClick={handleDeleteAccount}>Delete Account</Button>
            </Box>
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography textAlign="center" mt={2}>
              Forgot password?{" "}
              <a href="/password-reset" style={{ color: "#1F4B43", fontWeight: "bold", textDecoration: "underline" }}>
                Reset here
              </a>
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12}><Typography><strong>Username:</strong> {username}</Typography></Grid>
            <Grid item xs={6}><Typography><strong>Name:</strong> {name || "N/A"}</Typography></Grid>
            <Grid item xs={6}><Typography><strong>Surname:</strong> {surname || "N/A"}</Typography></Grid>
            <Grid item xs={12}><Typography><strong>Phone:</strong> {phone_number || "N/A"}</Typography></Grid>
            <Grid item xs={12}><Typography><strong>Bio:</strong> {bio || "No bio yet"}</Typography></Grid>

            {preferences && (
              <>
                <Grid item xs={12}><Divider sx={{ my: 2 }} /></Grid>
                <Grid item xs={12}><Typography variant="h6">Preferences</Typography></Grid>
                <Grid item xs={6}><Typography><strong>Nationality:</strong> {preferences.nationality || "N/A"}</Typography></Grid>
                <Grid item xs={6}><Typography><strong>Languages:</strong> {preferences.language?.join(", ") || "N/A"}</Typography></Grid>
                <Grid item xs={12}><Typography><strong>Religion:</strong> {preferences.religion || "N/A"}</Typography></Grid>
                <Grid item xs={12}><Typography><strong>Preferred Roommate Gender:</strong> {preferences.preferred_sex_to_live_with?.join(", ") || "N/A"}</Typography></Grid>
                <Grid item xs={6}><Typography><strong>Quiet Hours:</strong> {preferences.quiet_hours?.start || "N/A"} - {preferences.quiet_hours?.end || "N/A"}</Typography></Grid>
                {["smoking", "pet_friendly", "party_friendly", "outgoing", "vegan"].map((key) => (
                  <Grid item xs={6} key={key}>
                    <Typography><strong>{key.replace("_", " ")}:</strong> {preferences[key] ? "✅ Yes" : "❌ No"}</Typography>
                  </Grid>
                ))}
              </>
            )}

            {pets && (
              <>
                <Grid item xs={12}><Divider sx={{ my: 2 }} /></Grid>
                <Grid item xs={12}><Typography variant="h6">Pets</Typography></Grid>
                <Grid item xs={6}><Typography><strong>Has Pets:</strong> {pets.has_pets ? "✅ Yes" : "❌ No"}</Typography></Grid>
                <Grid item xs={6}><Typography><strong>Species:</strong> {pets.species?.join(", ") || "N/A"}</Typography></Grid>
              </>
            )}

            <Grid item xs={12}><Divider sx={{ my: 2 }} /></Grid>
            <Grid item xs={12}><Typography variant="h6">Your Listings</Typography></Grid>
            {userListings.length > 0 ? (
              userListings.map((listing) => (
                <Grid item xs={12} key={listing.listing_id}>
                  <Link to={`/listing/${listing.listing_id}`} style={{ textDecoration: "none" }}>
                    <Card sx={{ display: "flex", mb: 2 }}>
                      {listing.images && listing.images.length > 0 && (
                        <CardMedia
                          component="img"
                          sx={{ width: 150 }}
                          image={`/uploads/${listing.images[0].replace(/^uploads\//, "")}`}
                          alt={listing.title}
                        />
                      )}
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="bold">{listing.title}</Typography>
                        <Typography variant="body2" color="text.secondary">{listing.location}</Typography>
                        <Typography variant="body2" color="primary">${listing.price}</Typography>
                      </CardContent>
                    </Card>
                  </Link>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}><Typography>No listings yet</Typography></Grid>
            )}

            <Grid item xs={12}><Divider sx={{ my: 2 }} /></Grid>
            <Grid item xs={12}><Typography variant="h6">Your Groups</Typography></Grid>
            {userGroups.length > 0 ? (
              userGroups.map((group) => (
                <Grid item xs={12} key={group.group_id}>
                  <Link to={`/group/${group.group_id}`} style={{ textDecoration: "none" }}>
                    <Card sx={{ display: "flex", mb: 2 }}>
                      <CardMedia
                        component="img"
                        sx={{ width: 150 }}
                        image={group.listing_id ? getListingImage(group.listing_id) : "/assets/default-image.jpg"}
                        alt={group.name}
                      />
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="bold">{group.name}</Typography>
                      </CardContent>
                    </Card>
                  </Link>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}><Typography>No groups yet</Typography></Grid>
            )}
          </Grid>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};

export default UserProfileView;
