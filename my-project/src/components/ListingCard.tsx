import React from "react";
import { Card, CardContent, CardMedia, Typography, Button, Box } from "@mui/material";

interface ListingProps {
  title: string;
  location: string;
  price: string;
  image: string;
  description: string;
}

const ListingCard: React.FC<ListingProps> = ({ title, location, price, image, description }) => {
  return (
    <Card sx={{ maxWidth: 350, boxShadow: 3, borderRadius: 2 }}>
      {/* Listing Image */}
      <CardMedia component="img" height="200" image={image} alt={title} />

      <CardContent>
        {/* Title & Location */}
        <Typography variant="h6" fontWeight="bold">{title}</Typography>
        <Typography variant="body2" color="textSecondary">{location}</Typography>

        {/* Price */}
        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
          {price}
        </Typography>

        {/* Description */}
        <Typography variant="body2" sx={{ mt: 1 }}>
          {description.length > 100 ? description.substring(0, 100) + "..." : description}
        </Typography>

        {/* View Details Button */}
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" fullWidth sx={{ backgroundColor: "#1f4b43", ":hover": { backgroundColor: "#164032" } }}>
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ListingCard;
