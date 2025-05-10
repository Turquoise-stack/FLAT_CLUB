import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";
import api from "../api/api";

const GroupList = ({ groups }: { groups: any[] }) => {
  const [images, setImages] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const fetchImages = async () => {
      const newImages: { [key: number]: string } = {};
      await Promise.all(
        groups.map(async (group) => {
          try {
            const res = await api.get(`/listings/${group.listingId}`);
            const listing = res.data;
            newImages[group.id] = listing.images && listing.images.length > 0
              ? `${listing.images[0]}`
              : "/src/assets/default-image.jpg";
          } catch (error) {
            console.error(`Failed to fetch listing for group ${group.id}`, error);
            newImages[group.id] = "/src/assets/default-image.jpg";
          }
        })
      );
      setImages(newImages);
    };

    fetchImages();
  }, [groups]);

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center", mt: 4 }}>
      {groups.map((group) => (
        <Link to={`/group/${group.id}`} style={{ textDecoration: "none" }} key={group.id}>
          <Card sx={{ width: 300, height: 350, display: "flex", flexDirection: "column" }}>
            {images[group.id] && (
              <CardMedia
                component="img"
                height="180"
                image={images[group.id]}
                alt={group.name}
              />
            )}
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>
                {group.name}
              </Typography>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                {group.description.length > 60 ? group.description.slice(0, 60) + "..." : group.description}
              </Typography>

              <Typography variant="body2" color="primary" sx={{ mt: 2 }}>
                {group.memberCount} {group.memberCount === 1 ? "member" : "members"}
              </Typography>
            </CardContent>
          </Card>
        </Link>
      ))}
    </Box>
  );
};

export default GroupList;
