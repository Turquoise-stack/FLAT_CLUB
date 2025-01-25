import React from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Link,
  Avatar,
} from "@mui/material";

const Login = () => {
  return (
    <Container
    //   maxWidth="sm"
      sx={{
        width: "80vw",
        height: "90vh", 
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#ffffff",
      }}
    >
      {/* Logo Section */}
      <Avatar
        sx={{
          width: 100,
          height: 100,
          background: "#1f4b43",
          mb: 2,
        }}
      >
        <Typography variant="h5" color="white" fontWeight="bold">
          FC
        </Typography>
      </Avatar>
      <Typography
        variant="h4"
        color="#1f4b43"
        fontWeight="500"
        textAlign="center"
        gutterBottom
      >
        Flat Club
      </Typography>
      <Typography
        variant="subtitle1"
        color="#1f4b43"
        textAlign="center"
        mb={4}
      >
        Believe in finding it
      </Typography>

      {/* Login Form */}
      <Box
        sx={{
          background: "rgba(255, 255, 255, 0.3)",
          backdropFilter: "blur(25px)",
          borderRadius: "16px",
          p: 4,
          width: "100%",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h6"
          color="#1f4b43"
          fontWeight="500"
          textAlign="center"
          mb={2}
        >
          Login to your Flat Club account
        </Typography>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          sx={{ mb: 3 }}
        />
        <Button
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: "#1f4b43",
            ":hover": {
              backgroundColor: "#164032",
            },
          }}
        >
          Login
        </Button>
      </Box>

      {/* Register Section */}
      <Typography
        variant="body2"
        color="#1f4b43"
        mt={3}
        textAlign="center"
      >
        New here?{" "}
        <Link href="/register" underline="hover" color="#e7c873">
          Register
        </Link>
      </Typography>

      {/* Footer */}
      <Box mt={4} textAlign="center">
        <Typography variant="caption" color="gray">
          Copyright © 2024. Flat Club
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
