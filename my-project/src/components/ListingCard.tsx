import React from "react";
import { Box, Typography, Card, CardMedia } from "@mui/material";

interface ListingCardProps {
  image: string;
  title: string;
  price: number;
  groupCount: number;
}

const ListingCard: React.FC<ListingCardProps> = ({ image, title, price, groupCount }) => {
  return (
    <Card
      sx={{
        position: "relative",
        width: 300,
        height: 350,
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: 3,
      }}
    >
      {/* Background Image */}
      <CardMedia
        component="img"
        height="100%"
        image={image}
        alt={title}
        sx={{ objectFit: "cover" }}
      />

      {/* Overlay Island */}
      <Box
        sx={{
          position: "absolute",
          bottom: 16,
          left: 16,
          right: 16,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderRadius: 2,
          padding: 2,
          boxShadow: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold" noWrap>
          {title}
        </Typography>
        <Typography variant="body1" color="primary" fontWeight="bold">
          ${price}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {groupCount} group{groupCount !== 1 ? "s" : ""} created
        </Typography>
      </Box>
    </Card>
  );
};

export default ListingCard;
