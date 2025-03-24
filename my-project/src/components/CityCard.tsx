import React from "react";
import { Box, Typography } from "@mui/material";

interface CityCardProps {
  city: string;
  properties: number;
  image: string; // path to island/city image
}

const CityCard: React.FC<CityCardProps> = ({ city, properties, image }) => {
  return (
    <Box
      sx={{
        width: 200,
        height: 300,
        backgroundColor: "#ffffff",
        borderRadius: "20px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "0.3s",
        ":hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
        },
      }}
    >
      {/* Island image or background */}
      <Box
        sx={{
          height: "60%",
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Content */}
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="h6" fontWeight="bold" color="#1f4b43">
          {city}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {properties} properties
        </Typography>
      </Box>
    </Box>
  );
};

export default CityCard;
