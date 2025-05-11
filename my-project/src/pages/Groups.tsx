import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import { Box, Container, Button } from "@mui/material";
import Footer from "../components/Footer";
import Pagination from "@mui/material/Pagination";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import GroupList from "../components/GroupList";

const Groups = () => {
  const [groups, setGroups] = useState<any[]>([]);
  const [images, setImages] = useState<{ [groupId: number]: string }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const groupsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroupsWithImages();
  }, []);

const normalizeImagePath = (path: string) => {
  const cleaned = path.replace(/^\/+/, "").replace(/^uploads\//, "");
  return `${cleaned}`;
};


  
                                                                                        
  const fetchGroupsWithImages = async () => {
    try {
      const res = await api.get("/groups");
      const fetchedGroups = res.data;
      setGroups(fetchedGroups);

      const imageMap: { [groupId: number]: string } = {};

      await Promise.all(
        fetchedGroups.map(async (group: any) => {
          try {
            const listingRes = await api.get(`/listings/${group.listing_id}`);
            const listing = listingRes.data;
            imageMap[group.group_id] =
              listing.images && listing.images.length > 0
                ? normalizeImagePath(listing.images[0])
                : "/assets/default-image.jpg"; 
          } catch (err) {
            console.error(`Failed to fetch listing for group ${group.group_id}`, err);
            imageMap[group.group_id] = "/assets/default-image.jpg";
          }
        })
      );

      setImages(imageMap);
    } catch (error) {
      console.error("Failed to fetch groups", error);
    }
  };

  const indexOfLastGroup = currentPage * groupsPerPage;
  const indexOfFirstGroup = indexOfLastGroup - groupsPerPage;
  const currentGroups = groups.slice(indexOfFirstGroup, indexOfLastGroup);

  const mappedGroups = currentGroups.map((group) => ({
    id: group.group_id,
    name: group.name,
    description: group.description || "No description yet",
    memberCount: group.members ? group.members.length : 0,
    listingId: group.listing_id,
    image: images[group.group_id] || "/assets/default-image.jpg",
  }));

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Navbar />

      <Box
        sx={{
          width: "100vw",
          height: { xs: "40vh", sm: "50vh", md: "60vh", lg: "70vh" },
          backgroundImage: `url("/src/assets/waw_search.png")`,
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
          onClick={() => navigate("/creategroup")}
          sx={{
            fontWeight: "bold",
            backgroundColor: "#1F4B43",
            ":hover": { backgroundColor: "#164032" },
          }}
        >
          Create Group
        </Button>
      </Box>

      <Box sx={{ width: "100%", flexGrow: 1, px: { xs: 2, sm: 4, md: 8 } }}>
        <GroupList groups={mappedGroups} />

        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={Math.ceil(groups.length / groupsPerPage)}
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

export default Groups;
