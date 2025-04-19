import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: `url("/src/assets/home.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2, // mobile padding
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "600px",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderRadius: "20px",
          padding: 4,
          boxShadow: 4,
        }}
      >
        <Typography variant="h5" textAlign="center" mb={3}>
          Login
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant="contained"
            fullWidth
            sx={{ backgroundColor: "#1F4B43", textTransform: "none", fontWeight: "bold" }}
          >
            Login
          </Button>
          <Typography textAlign="center" mt={2}>
            Don't have an account?{" "}
            <a href="/register" style={{ color: "#1F4B43", fontWeight: "bold", textDecoration: "underline" }}>
              Register here
            </a>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
