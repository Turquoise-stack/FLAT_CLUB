import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#1f4b43",
        color: "white",
        textAlign: "center",
        pt: 3,
        pb: 2,
        position: "relative",
        width: { xs: "40vh", md: "210.5vh" },
        height: "10%",
      }}
    >
      {/* Arrow Button */}
      <IconButton
        onClick={scrollToTop}
        sx={{
          position: "absolute",
          top: "-25px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "white",
          color: "#1f4b43",
          borderRadius: "50%",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
          zIndex: 2,
        }}
      >
        <ArrowUpwardIcon />
      </IconButton>

      {/* Footer Text */}
      <Typography variant="h6" fontWeight="bold" mb={1}>
        Flat Club
      </Typography>
      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
        © {new Date().getFullYear()} Flat Club. All rights reserved.
      </Typography>
      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", mt: 1 }}>
        Terms · Privacy · Contact
      </Typography>
    </Box>
  );
};

export default Footer;
