import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Box, Container, Button, Typography } from "@mui/material";
import ListingList from "../components/ListingList";
import Footer from "../components/Footer";
import Pagination from "@mui/material/Pagination";
import api from "../api/api";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
const filters = Object.fromEntries(new URLSearchParams(location.search));

  const [listings, setListings] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const listingsPerPage = 6;

  const normalizeImagePath = (path: string) => {
  const cleanPath = path.replace(/^\/+/, "").replace(/^uploads\//, "");
  return `/uploads/${cleanPath}`;
  };


  useEffect(() => {
    fetchListings();
  }, [location.state]); // re-fetch if user makes new search

const fetchListings = async () => {
  try {
    const cleanedFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (["true", "false"].includes(value)) {
          acc[key] = value === "true";
        } else if (!isNaN(Number(value))) {
          acc[key] = Number(value);
        } else {
          acc[key] = value;
        }
      }
      return acc;
    }, {} as Record<string, any>);

    const res = await api.get("/listings/search", { params: cleanedFilters });
    setListings(res.data);
  } catch (error) {
    console.error("Failed to fetch listings", error);
  }
};

  const indexOfLastListing = currentPage * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentListings = listings.slice(indexOfFirstListing, indexOfLastListing);

  const mappedListings = currentListings.map(listing => ({
    id: listing.listing_id,
    image: listing.images && listing.images.length > 0
      ? normalizeImagePath(listing.images[0])
      : "/uploads/default-image.jpg",
    title: listing.title,
    price: listing.price,
    location: listing.location,
    isRental: listing.isRental,
    groupCount: 2,
  }));


  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Navbar />

      <Box
        sx={{
          width: "100vw",
          height: { xs: '30vh', sm: '40vh', md: '50vh' },
          backgroundImage: `url("/assets/waw_search.png")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          px: 2,
          overflowX: "hidden",
        }}
      >
        <Container>
          <Button
            variant="contained"
            onClick={() => navigate("/listings")}
            sx={{ fontWeight: "bold", backgroundColor: "#1F4B43", ":hover": { backgroundColor: "#164032" } }}
          >
            Back to All Listings
          </Button>
        </Container>
      </Box>

      <Box sx={{ width: "100%", flexGrow: 1, px: { xs: 2, sm: 4, md: 8 }, pt: 4 }}>
        {listings.length > 0 ? (
          <>
            <ListingList listings={mappedListings} />
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={Math.ceil(listings.length / listingsPerPage)}
                page={currentPage}
                onChange={(_event, value) => setCurrentPage(value)}
                color="primary" 
              />
            </Box>
          </>
        ) : (
          <Typography variant="h6" textAlign="center" mt={4}>
            No listings match your search.
          </Typography>
        )}
      </Box>

      <Footer />
    </Box>
  );
};

export default SearchResults;
