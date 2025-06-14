import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import { Box, Grid, Typography } from "@mui/material";
import ListingGrid from "../components/ListingGrid";
import CityCard from "../components/CityCard";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Footer from "../components/Footer";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const cityData = [
  { city: "Warsaw", image: "/assets/cities/warsaw.jpg" },
  { city: "Elblag", image: "/assets/cities/elblag.png" },
  { city: "Gdansk", image: "/assets/cities/gdansk.png" },
  { city: "Krakow", image: "/assets/cities/krakow.png" },
  { city: "Wroclaw", image: "/assets/cities/wroclaw.png" },
];




const theme = createTheme({
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

const HomeGuest = () => {
  const [listings, setListings] = useState<any[]>([]);
  const navigate = useNavigate(); 

  const handleCardClick = (id: number) => {
    navigate(`/listing/${id}`);
  };
  
  useEffect(() => {
    fetchListings();
  }, []);

  const normalizeImagePath = (path: string) => {
    return path.startsWith("uploads/")
      ? `/${path.replace(/^\/+/, "")}`
      : `/uploads/${path.replace(/^\/+/, "")}`;
  };

  const fetchListings = async () => {
    try {
      const res = await api.get("/listings");
      const formatted = res.data.map((listing: any) => ({
        id: listing.listing_id,
        title: listing.title,
        price: listing.price,
        location: listing.location,
        groupCount: 2,
        image:
          listing.images?.length > 0
            ? normalizeImagePath(listing.images[0])
            : "/assets/default-image.jpg", 
      }));
      setListings(formatted);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar />

        <Box
          sx={{
            width: "100%",
            maxWidth: "100%", 
            height: { xs: "40vh", md: "70vh" },
            backgroundImage: `url("/assets/home.jpg")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            overflowX: "hidden", 
          }}
        >
          <Typography
            variant="h3"
            sx={{
              color: "#1f4b43",
              fontWeight: "medium",
              textAlign: "center",
              fontSize: { xs: "1.5rem", sm: "2.5rem", md: "3rem" },
              mb: 3,
              mt: -10,
              lineHeight: 1.4,
            }}
          >
            Believe in finding it
            <Box
              component="span"
              sx={{
                fontSize: { xs: "0.7rem", sm: "0.8rem", md: "1.1rem" },
                display: "block",
                mb: 1,
              }}
            >
              Search for properties or groups to rent them
            </Box>
          </Typography>

          <SearchBar />
        </Box>

        <Box>
        <ListingGrid listings={listings} onCardClick={handleCardClick} />

          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              fontWeight: "medium",
              color: "#1f4b43",
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
              mt: 6,
              mb: 2,
              lineHeight: 1.4,
            }}
          >
            Find Properties in These Cities
            <Box
              component="span"
              sx={{
                display: "block",
                fontSize: { xs: "0.8rem", sm: "1rem" },
                color: "text.secondary",
                fontWeight: "normal",
                mt: 1,
              }}
            >
              Browse cities where listings are currently active and connect with other renters.
            </Box>
          </Typography>

          <Grid container spacing={4} justifyContent="center" sx={{ mt: 2 }}>
            {cityData.map((item, idx) => (
              <Grid item key={idx} xs={12} sm={6} md={4} lg={3}>
                <CityCard {...item} />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default HomeGuest;
