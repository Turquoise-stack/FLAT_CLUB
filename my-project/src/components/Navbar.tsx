import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#1f4b43", padding: "10px" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left Side: Logo */}
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "white" }}>
          Flat Club
        </Typography>

        <Box sx={{ display: "flex", gap: "15px" }}>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/listings">
            Listings
          </Button>
          <Button color="inherit" component={Link} to="/groups">
            Groups
          </Button>
          <Button color="inherit" component={Link} to="/blog">
            Blog
          </Button>
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
