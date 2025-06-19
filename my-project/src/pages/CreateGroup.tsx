import React, { useState, useEffect } from "react";
import {
  Box, Container, Typography, TextField, Grid, Button, MenuItem, Paper
} from "@mui/material";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const CreateGroup = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    listing_id: "",
    quiet_hours: { start: "", end: "" },
  });

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    listing_id: "",
  });
  const [listings, setListings] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const res = await api.get("/listings");
      setListings(res.data);
    } catch (error: any) {
      console.error("Failed to fetch listings", error);
    }
  };

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleQuietChange = (field: "start" | "end", value: string) => {
    setForm((prev) => ({
      ...prev,
      quiet_hours: { ...prev.quiet_hours, [field]: value },
    }));
  };

  const validate = () => {
    const validationErrors = { name: "", description: "", listing_id: "" };
    if (!form.name.trim()) {
      validationErrors.name = "Group name is required";
    }
    if (!form.description.trim()) {
      validationErrors.description = "Description is required";
    }
    if (!form.listing_id) {
      validationErrors.listing_id = "Please select a listing";
    }
    setErrors(validationErrors);
    return Object.values(validationErrors).every((err) => !err);
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to create a group.");
      navigate("/login");
      return;
    }

    const payload = {
      name: form.name,
      description: form.description,
      listing_id: Number(form.listing_id),
    };

    try {
      await api.post("/groups", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Group created successfully!");
      navigate("/groups");
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.detail || "Failed to create group.");
    }
  };

  const isFormValid =
    form.name.trim() !== "" &&
    form.description.trim() !== "" &&
    Boolean(form.listing_id);

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
        px: 2,
      }}
    >
      <Navbar />
      <Container maxWidth="sm" sx={{ py: 5 }}>
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" gutterBottom>
            Create a New Group
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Group Name"
                required
                fullWidth
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                error={Boolean(errors.name)}
                helperText={errors.name}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Description"
                required
                fullWidth
                multiline
                rows={3}
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                error={Boolean(errors.description)}
                helperText={errors.description}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Select Listing"
                select
                required
                fullWidth
                value={form.listing_id}
                onChange={(e) => handleChange("listing_id", e.target.value)}
                error={Boolean(errors.listing_id)}
                helperText={errors.listing_id}
              >
                {listings.map((listing) => (
                  <MenuItem key={listing.listing_id} value={listing.listing_id}>
                    {listing.title} - {listing.location}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Quiet Hours Start"
                fullWidth
                value={form.quiet_hours.start}
                onChange={(e) => handleQuietChange("start", e.target.value)}
                placeholder="22:00"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Quiet Hours End"
                fullWidth
                value={form.quiet_hours.end}
                onChange={(e) => handleQuietChange("end", e.target.value)}
                placeholder="08:00"
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!isFormValid}
                fullWidth
              >
                Create Group
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default CreateGroup;
