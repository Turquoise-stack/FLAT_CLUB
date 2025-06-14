import React, { useState } from "react";
import { Box, Container, Typography, TextField, Button, Paper } from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/api";

const PasswordReset = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
  
      const formData = new FormData();
      formData.append("current_password", currentPassword);
      formData.append("new_password", newPassword);
  
      await api.post("/change-password", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
  
      alert("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to change password");
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
        px: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />

      <Container maxWidth="sm" sx={{ py: 5, flexGrow: 1, display: "flex", alignItems: "center" }}>
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3, width: "100%" }}>
          <Typography variant="h5" mb={3} textAlign="center">
            Change Password
          </Typography>

          <TextField
            label="Current Password"
            type="password"
            fullWidth
            margin="normal"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            onClick={handleChangePassword}
            disabled={loading}
          >
            Change Password
          </Button>
        </Paper>
      </Container>

      <Footer />
    </Box>
  );
};

export default PasswordReset;
