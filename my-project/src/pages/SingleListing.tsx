import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Container, Typography, Paper, CircularProgress, Button, Stack } from "@mui/material";
import Navbar from "../components/Navbar";
import api from "../api/api";
import getCurrentUserId from "../utils/getCurrentUserId";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const languageCountryCodes: { [key: string]: string } = {
  English: "gb",
  French: "fr",
  German: "de",
  Spanish: "es",
  Turkish: "tr",
  Italian: "it",
  Polish: "pl",
};

const SingleListing = () => {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<any>(null);
  const [owner, setOwner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const id = getCurrentUserId();
    setCurrentUserId(id);
    fetchCurrentUser(id);
    fetchListing();
  }, []);

  const fetchListing = async () => {
    try {
      const res = await api.get(`/listings/${id}`);
      setListing(res.data);
      if (res.data.owner_id) fetchOwner(res.data.owner_id);
    } catch (err) {
      console.error("Failed to fetch listing:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async (id: string | null) => {
    if (!id) return;
    try {
      const res = await api.get(`/users/${id}`);
      setCurrentUser(res.data);
    } catch (err) {
      console.error("Failed to fetch current user:", err);
    }
  };

  const fetchOwner = async (ownerId: number) => {
    try {
      const res = await api.get(`/users/${ownerId}`);
      setOwner(res.data);
    } catch (err) {
      console.error("Failed to fetch owner info:", err);
    }
  };

  const handleDeleteListing = async () => {
    if (!id) return;
    const confirmed = window.confirm("Are you sure you want to delete this listing?");
    if (!confirmed) return;

    try {
      await api.delete(`/listings/${id}`);
      alert("Listing deleted.");
      navigate("/listings");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete listing.");
    }
  };

  const handleDeleteUser = async () => {
    if (!owner?.user_id || !id) return;
    const confirmed = window.confirm("Are you sure that you want to delete the owners account and their listing?");
    if (!confirmed) return;

    try {
      await api.delete(`/listings/${id}`);
      await api.delete(`/users/${owner.user_id}`);
      alert("Owner and their listing deleted...");
      navigate("/listings");
    } catch (err) {
      console.error("Failed to delete ownmr and listing:", err);
      alert("Failed to delete owners and listing...");
    }
  };

  const normalizeImagePath = (path: string) => {
    return path.startsWith("uploads/")
      ? `/${path.replace(/^\/+/g, "")}`
      : `/uploads/${path.replace(/^\/+/g, "")}`;
  };

  if (loading) {
    return (
      <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  if (!listing) {
    return (
      <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center">
        <Typography>Listing not found</Typography>
      </Box>
    );
  }

  const canDelete = currentUserId === String(listing.owner_id) || currentUser?.role === "admin";
  const isAdmin = currentUser?.role === "admin";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: `url("/assets/home.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        px: 2,
      }}
    >
      <Navbar />
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Paper elevation={4} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, mt: { xs: 6, md: 10 } }}>
          <Typography variant="h4" gutterBottom>{listing.title}</Typography>
          <Typography variant="h6" color="textSecondary" gutterBottom>{listing.location}</Typography>
          <Typography variant="body1" gutterBottom>{listing.description}</Typography>
          <Typography variant="h6" color="primary" gutterBottom>
            ${listing.price} {listing.isRental ? "/ month" : ""}
          </Typography>

          {listing.images?.length > 0 && (
            <Box mt={3}>
              <Swiper
                modules={[Navigation]}
                navigation
                spaceBetween={10}
                slidesPerView={1}
                style={{ borderRadius: "10px" }}
              >
                {listing.images.map((rawPath: string, idx: number) => {
                  const src = normalizeImagePath(rawPath);

                  return (
                    <SwiperSlide key={idx}>
                      <img
                        src={src}
                        alt={`listing-img-${idx}`}
                        style={{
                          width: "100%",
                          height: "400px",
                          objectFit: "cover",
                          borderRadius: "10px",
                        }}
                      />
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </Box>
          )}

          {listing.preferences && (
            <Box mt={4}>
              <Typography variant="h6" gutterBottom>Preferences:</Typography>
              {listing.preferences.language?.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1">Spoken Languages:</Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    {listing.preferences.language.map((lang: string, idx: number) => (
                      <Box key={idx}>
                        {languageCountryCodes[lang] ? (
                          <img
                            src={`https://flagcdn.com/32x24/${languageCountryCodes[lang]}.png`}
                            alt={lang}
                            style={{ width: "32px", height: "24px", borderRadius: "4px" }}
                          />
                        ) : (
                          <Typography variant="body2">{lang}</Typography>
                        )}
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                {Object.entries(listing.preferences).map(([key, value]) => {
                  if (key === "language") return null;

                  if (key === "quiet_hours" && value) {
                    return (
                      <Typography key={key} variant="subtitle1">
                        🕒 {value.start || "N/A"} - {value.end || "N/A"}
                      </Typography>
                    );
                  }
                  // emojis for easier understandingf 
                  if (typeof value === "boolean") {
                    const icons: Record<string, string> = {
                      smoking: "🚬",
                      pet_friendly: "🐾",
                      party_friendly: "🎉",
                      vegan: "🥗"
                    };
                    return (
                      <Typography key={key} variant="subtitle1">
                        {icons[key] || "✅"} {value ? key.replace("_", " ") : `No ${key.replace("_", " ")}`}
                      </Typography>
                    );
                  }

                  return null;
                })}
              </Box>
            </Box>
          )}

          {owner && (
            <Box mt={4}>
              <Typography variant="h6" color="primary">Contact Owner:</Typography>
              <Typography><strong>Email:</strong> {owner.email}</Typography>
              <Typography><strong>Phone:</strong> {owner.phone_number}</Typography>
            </Box>
          )}

          {canDelete && (
            <Stack mt={4} direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="contained" color="error" onClick={handleDeleteListing}>
                Delete  Listing
              </Button>
              {isAdmin && (
                <Button variant="outlined" color="error" onClick={handleDeleteUser}>
                  Delete owner
                </Button>
              )}
            </Stack>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default SingleListing;
