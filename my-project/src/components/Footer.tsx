import React from "react";
import { Box, Typography, IconButton } from "@mui/material";

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
        width: "100%",
      }}
    >
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