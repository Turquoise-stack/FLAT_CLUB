import React, { useState } from "react";
import {
  Box, Container, Typography, TextField, Grid, Button, FormControlLabel, Switch, Paper
} from "@mui/material";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateListing = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    isRental: true,
    preferences: {
      language: [],
      nationality: "",
      smoking: false,
      pet_friendly: false,
      party_friendly: false,
      preferred_sex_of_the_flat: [],
      quiet_hours: { start: "", end: "" },
      vegan: false,
    },
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const navigate = useNavigate();

  const handleInput = (path: string, value: any) => {
    const keys = path.split(".");
    setForm((prev) => {
      const copy = { ...prev };
      let ref: any = copy;
      for (let i = 0; i < keys.length - 1; i++) {
        ref = ref[keys[i]];
      }
      ref[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to create a listing.");
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("price", form.price.toString());
    formData.append("location", form.location);
    formData.append("isRental", form.isRental.toString());
    formData.append("status", "active");

    formData.append("preferences", JSON.stringify({
      language: form.preferences.language,
      nationality: form.preferences.nationality,
      smoking: form.preferences.smoking,
      pet_friendly: form.preferences.pet_friendly,
      party_friendly: form.preferences.party_friendly,
      preferred_sex_of_the_flat: form.preferences.preferred_sex_of_the_flat,
      quiet_hours: form.preferences.quiet_hours,
      vegan: form.preferences.vegan,
    }));

    selectedImages.forEach((image) => {
      formData.append("images", image); 
    });

    try {
      await axios.post("/api/listings", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Listing created successfully!");
      navigate("/listings");
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.detail || "Failed to create listing.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "90vh",
        width: "100vw",
        backgroundImage: `url("/src/assets/home.jpg")`,
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
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" gutterBottom>
            Create a New Listing
          </Typography>

          <Grid container spacing={3}>
            {/* Basic Info */}
            <Grid item xs={12}>
              <TextField
                label="Title"
                fullWidth
                value={form.title}
                onChange={(e) => handleInput("title", e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={form.description}
                onChange={(e) => handleInput("description", e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Price"
                fullWidth
                type="number"
                value={form.price}
                onChange={(e) => handleInput("price", e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Location"
                fullWidth
                value={form.location}
                onChange={(e) => handleInput("location", e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.isRental}
                    onChange={(e) => handleInput("isRental", e.target.checked)}
                  />
                }
                label="Is for Rent?"
              />
            </Grid>

            {/* Preferences */}
            <Grid item xs={12}>
              <Typography variant="h6">Flat Preferences</Typography>
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Languages (comma-separated)"
                fullWidth
                value={form.preferences.language.join(", ")}
                onChange={(e) => handleInput("preferences.language", e.target.value.split(",").map(l => l.trim()))}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Nationality"
                fullWidth
                value={form.preferences.nationality}
                onChange={(e) => handleInput("preferences.nationality", e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.preferences.smoking}
                    onChange={(e) => handleInput("preferences.smoking", e.target.checked)}
                  />
                }
                label="Smoking Allowed"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={form.preferences.pet_friendly}
                    onChange={(e) => handleInput("preferences.pet_friendly", e.target.checked)}
                  />
                }
                label="Pet Friendly"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={form.preferences.party_friendly}
                    onChange={(e) => handleInput("preferences.party_friendly", e.target.checked)}
                  />
                }
                label="Party Friendly"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={form.preferences.vegan}
                    onChange={(e) => handleInput("preferences.vegan", e.target.checked)}
                  />
                }
                label="Vegan Friendly"
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Preferred Flatmate Genders (comma-separated)"
                fullWidth
                value={form.preferences.preferred_sex_of_the_flat.join(", ")}
                onChange={(e) => handleInput("preferences.preferred_sex_of_the_flat", e.target.value.split(",").map(s => s.trim()))}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Quiet Hours Start"
                fullWidth
                value={form.preferences.quiet_hours.start}
                onChange={(e) => handleInput("preferences.quiet_hours.start", e.target.value)}
                placeholder="22:00"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Quiet Hours End"
                fullWidth
                value={form.preferences.quiet_hours.end}
                onChange={(e) => handleInput("preferences.quiet_hours.end", e.target.value)}
                placeholder="08:00"
              />
            </Grid>

            {/* Image Upload */}
            <Grid item xs={12}>
              <Button
                variant="contained"
                component="label"
              >
                Upload Images (Max 10)
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) {
                      const filesArray = Array.from(e.target.files).slice(0, 10);
                      setSelectedImages(filesArray);
                    }
                  }}
                />
              </Button>
              <Grid item xs={12}>
  {selectedImages.length > 0 && (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
      {selectedImages.map((file, index) => (
        <Box key={index} sx={{ width: 100, height: 100, position: "relative" }}>
          <img
            src={URL.createObjectURL(file)}
            alt={`preview-${index}`}
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
          />
        </Box>
      ))}
    </Box>
  )}
</Grid>
            </Grid>
          </Grid>

          <Grid container spacing={3} mt={2}>
            <Grid item xs={12}>
              <Button variant="contained" fullWidth onClick={handleSubmit}>
                Create Listing
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default CreateListing;
