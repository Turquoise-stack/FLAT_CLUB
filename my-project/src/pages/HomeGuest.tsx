import React from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import { Box, Grid, Typography, Container } from "@mui/material";
import ListingGrid from "../components/ListingGrid";
import CityCard from "../components/CityCard";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Footer from "../components/Footer";

const sampleListings = [
  { id: 1, image: "/src/assets/flats/flat1.png", title: "Modern Apartment in Warsaw", price: 5000, groupCount: 2 },
  { id: 2, image: "/src/assets/flats/flat2.png", title: "Modern Apartment in Warsaw", price: 5000, groupCount: 2 },
  { id: 3, image: "/src/assets/flats/flat3.png", title: "Modern Apartment in Warsaw", price: 5000, groupCount: 2 },
  { id: 4, image: "/src/assets/flats/flat4.png", title: "Modern Apartment in Warsaw", price: 5000, groupCount: 2 },
  { id: 5, image: "/src/assets/flats/flat5.png", title: "Modern Apartment in Warsaw", price: 5000, groupCount: 2 },
  { id: 6, image: "/src/assets/flats/flat6.png", title: "Modern Apartment in Warsaw", price: 5000, groupCount: 2 },
  { id: 7, image: "/src/assets/flats/flat1.png", title: "Modern Apartment in Warsaw", price: 5000, groupCount: 2 },
  { id: 8, image: "/src/assets/flats/flat2.png", title: "Modern Apartment in Warsaw", price: 5000, groupCount: 2 },
];

const cityData = [
  { city: "Warsaw", properties: 45, image: "/src/assets/cities/warsaw.jpg" },
  { city: "Elblag", properties: 120, image: "/src/assets/cities/elblag.png" },
  { city: "Gdansk", properties: 72, image: "/src/assets/cities/gdansk.png" },
  { city: "Krakow", properties: 93, image: "/src/assets/cities/krakow.png" },
  { city: "Wroclaw", properties: 45, image: "/src/assets/cities/wroclaw.png" },
];

const theme = createTheme({
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

const HomeGuest = () => {
  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar />

        <Box
        sx={{
          width: "100%",
          height: { xs: "40vh", md: "70vh" },
          backgroundImage: `url("/src/assets/home.jpg")`, 
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
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
            <Box component="span" sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem", md: "1.1rem" }, display: "block", mb: 1 }}>
              Search for properties or groups to rent them
            </Box>
          </Typography>

          <SearchBar onSearch={handleSearch} />
        </Box>

        <Box>
          <ListingGrid listings={sampleListings} />

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
