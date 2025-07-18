import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import { Box, Container, Button } from "@mui/material";
import ListingList from "../components/ListingList";
import Footer from "../components/Footer";
import Pagination from "@mui/material/Pagination";
import api from "../api/api";

const Listings = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const listingsPerPage = 6;

  const navigate = useNavigate();
  const locationObj = useLocation();

  useEffect(() => {
    fetchData();
  }, [locationObj.search]);

  const fetchData = async () => {
    try {
      const [listingsRes, groupsRes] = await Promise.all([
        api.get(`/listings/search${locationObj.search}`),
        api.get("/groups"),
      ]);
      setListings(listingsRes.data);
      setGroups(groupsRes.data);
    } catch (error) {
      console.error("Failed to fetch listings or groups", error);
    }
  };

  const groupCountsByListing = groups.reduce((acc: Record<number, number>, group: any) => {
    const listingId = group.listing_id;
    if (listingId) {
      acc[listingId] = (acc[listingId] || 0) + 1;
    }
    return acc;
  }, {});

  const indexOfLastListing = currentPage * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentListings = listings.slice(indexOfFirstListing, indexOfLastListing);

  const normalizeImagePath = (path: string) => {
    const cleanPath = path.replace(/^\/+/, "").replace(/^uploads\//, "");
    return `/uploads/${cleanPath}`;
  };

  const mappedListings = currentListings.map(listing => ({
    id: listing.listing_id,
    image: listing.images && listing.images.length > 0
      ? normalizeImagePath(listing.images[0])
      : "/uploads/default-image.jpg",  
    title: listing.title,
    price: listing.price,
    location: listing.location,
    isRental: listing.isRental,
    groupCount: groupCountsByListing[listing.listing_id] || 0,
  }));


  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Navbar />

      <Box
        sx={{
          width: "100vw",
          height: { xs: "40vh", sm: "50vh", md: "60vh", lg: "70vh" },
          backgroundImage: `url("/assets/home.jpg")`,
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
        <SearchBar />
      </Box>

      <Box sx={{ width: "100%", mt: 3, textAlign: "center" }}>
        <Button
          variant="contained"
          onClick={() => navigate("/createListing")}
          sx={{
            fontWeight: "bold",
            backgroundColor: "#1F4B43",
            ":hover": { backgroundColor: "#164032" },
          }}
        >
          Create Listing
        </Button>
      </Box>

      <Box sx={{ width: "100%", flexGrow: 1, px: { xs: 2, sm: 4, md: 8 } }}>
        <ListingList listings={mappedListings} />

        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={Math.ceil(listings.length / listingsPerPage)}
            page={currentPage}
            onChange={(_event, value) => setCurrentPage(value)}
            color="primary"
          />
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default Listings;
