import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from '../api/api'  

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/login", {
        email,
        password,
      });

      const token = res.data.access_token;
      console.log("Token received:", token);

      localStorage.setItem("token", token);

      navigate("/");
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: `url("/assets/home.jpg")`,
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
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          {error && (
            <Typography textAlign="center" color="error" mt={1}>
              {error}
            </Typography>
          )}

        <Typography textAlign="center" mt={2}>
          Don’t have an account?{" "}
          <Link 
            to="/register" 
            style={{
              color: "#1F4B43",
              fontWeight: "bold",
              textDecoration: "underline"
            }}
          >
            Register here
          </Link>
        </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
