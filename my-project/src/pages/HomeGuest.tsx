import React from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import { Box, Typography } from "@mui/material";
import ListingGrid from "../components/ListingGrid";

const sampleListings = [
  { id: 1, image: "/src/assets/card.png", title: "Modern Apartment in Warsaw", price: 5000, groupCount: 2 },
  { id: 2, image: "/src/assets/card.png", title: "Modern Apartment in Warsaw", price: 5000, groupCount: 2 },
  { id: 3, image: "/src/assets/card.png", title: "Modern Apartment in Warsaw", price: 5000, groupCount: 2 },
  { id: 4, image: "/src/assets/card.png", title: "Modern Apartment in Warsaw", price: 5000, groupCount: 2 },
  { id: 5, image: "/src/assets/card.png", title: "Modern Apartment in Warsaw", price: 5000, groupCount: 2 },
  { id: 6, image: "/src/assets/card.png", title: "Modern Apartment in Warsaw", price: 5000, groupCount: 2 },
  { id: 1, image: "/src/assets/card.png", title: "Modern Apartment in Warsaw", price: 5000, groupCount: 2 },
  { id: 2, image: "/src/assets/card.png", title: "Modern Apartment in Warsaw", price: 5000, groupCount: 2 },
];

const HomeGuest = () => {
  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Navbar */}
      <Navbar />

      <Box
        sx={{
          width: { xs: "40vh", md: "210.5vh" },
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
          variant="h4"
          sx={{
            color: "#1f4b43",
            fontWeight: "bold",
            fontSize: { xs: "0.4rem", sm: "0.5rem", md: "1rem" },
            mb: 1,
            mt: -5,
          }}
        >
          Search for properties or groups to rent them
        </Typography>

        <Typography
          variant="h3"
          sx={{
            color: "#1f4b43",
            fontWeight: "bold",
            fontSize: { xs: "1.5rem", sm: "2rem", md: "3rem" },
            mb: 3,
            mt: -30,
          }}
        >
          Believe in finding it 
        </Typography>

        <SearchBar onSearch={handleSearch} />

      </Box>

      <div>
      <ListingGrid listings={sampleListings} />
      </div>
    </Box>
  );
};

export default HomeGuest;
