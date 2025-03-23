import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <AppBar
      position="absolute"
      sx={{
        backgroundColor: "white",
        borderRadius: "35px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        width: "95%",
        maxWidth: "1200px",
        margin: "10px auto",
        transform: "translateX(-50%)",
        top: "20px",
        left: "50%",
        padding: "5px 20px", 
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "black",
            fontSize: { xs: "1rem", md: "1.5rem" },
          }}
        >
          Flat Club
        </Typography>

        {/* Centered Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: { xs: "20px", md: "40px" }, // spacing for responsiveness
            flexGrow: 1, // buttons stay centered       
            "& > *": {
                  color: "#1f4b43",
                  fontWeight: "bold",
                  fontSize: { xs: "0.9rem", md: "1.1rem" }, 
                  textTransform: "none",
                  padding: "6px 16px", 
                  transition: "0.3s", // smooth hover effect
                  ":hover": {
                    backgroundColor: "#e7c873", // Hover background color
                    color: "white", 
                  },
                },          
          }}
        >
          <Button sx={{color:"black", fontWeight: "bold"}} component={Link} to="/">Home</Button>
          <Button sx={{color:"black", fontWeight: "bold"}} component={Link} to="/listings">Listings</Button>
          <Button sx={{color:"black", fontWeight: "bold"}} component={Link} to="/groups">Groups</Button>
        </Box>

        <Button
          sx={{
            color: "#ffffff",
            backgroundColor: "#1f4b43",
            borderRadius: "20px",
            padding: "5px 15px",
            fontWeight: "bold",
            transition: "0.3s", // smooth hover effect

            ":hover": { backgroundColor: "#164032" },
          }}
          component={Link}
          to="/login"
        >
          Login
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
