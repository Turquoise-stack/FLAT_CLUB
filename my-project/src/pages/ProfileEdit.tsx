import React, { useState, useEffect } from "react";
import {
  Box, Container, Typography, TextField, Grid, FormControlLabel,
  Button, Switch, FormGroup
} from "@mui/material";
import Navbar from "../components/Navbar";
import api from "../api/api";
import getCurrentUserId from "../utils/getCurrentUserId";
import { useNavigate } from "react-router-dom";

const ProfileEdit = () => {
  const [form, setForm] = useState<any>({
    name: "",
    surname: "",
    phone_number: "",
    bio: "",
    preferences: {
      language: [],
      nationality: "",
      smoking: false,
      pet_friendly: false,
      party_friendly: false,
      outgoing: false,
      preferred_sex_to_live_with: [],
      religion: "",
      vegan: false,
      quiet_hours: { start: "", end: "" },
    },
    pets: {
      has_pets: false,
      species: [],
    },
  });

  const navigate = useNavigate();
  const userId = getCurrentUserId();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${userId}`);
        setForm({
          name: res.data.name || "",
          surname: res.data.surname || "",
          phone_number: res.data.phone_number || "",
          bio: res.data.bio || "",
          preferences: res.data.preferences || {
            language: [],
            nationality: "",
            smoking: false,
            pet_friendly: false,
            party_friendly: false,
            outgoing: false,
            preferred_sex_to_live_with: [],
            religion: "",
            vegan: false,
            quiet_hours: { start: "", end: "" },
          },
          pets: res.data.pets || {
            has_pets: false,
            species: [],
          },
        });
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const handleInput = (path: string, value: any) => {
    const keys = path.split(".");
    setForm(prev => {
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
    try {
      await api.put(`/users/${userId}`, form);
      alert("Profile updated successfully.");
      navigate("/profileview");
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Something went wrong while updating the profile.");
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
        px: 2,
      }}
    >
      <Navbar />
      <Container maxWidth="md" sx={{
        py: 4,
        px: { xs: 3, sm: 4 },
        bgcolor: "rgba(255, 255, 255, 0.85)",
        borderRadius: 4,
        backdropFilter: "blur(6px)",
        boxShadow: 3,
      }}>
        <Typography variant="h5" gutterBottom>Edit Your Profile</Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}><Typography variant="h6">Basic Info</Typography></Grid>
          <Grid item xs={6}><TextField label="Name" fullWidth value={form.name} onChange={(e) => handleInput("name", e.target.value)} /></Grid>
          <Grid item xs={6}><TextField label="Surname" fullWidth value={form.surname} onChange={(e) => handleInput("surname", e.target.value)} /></Grid>
          <Grid item xs={6}><TextField label="Phone Number" fullWidth value={form.phone_number} onChange={(e) => handleInput("phone_number", e.target.value)} /></Grid>
          <Grid item xs={12}><TextField label="Bio" fullWidth multiline rows={3} value={form.bio} onChange={(e) => handleInput("bio", e.target.value)} /></Grid>

          <Grid item xs={12}><Typography variant="h6">Preferences</Typography></Grid>
          <Grid item xs={6}><TextField label="Nationality" fullWidth value={form.preferences.nationality} onChange={(e) => handleInput("preferences.nationality", e.target.value)} /></Grid>
          <Grid item xs={6}><TextField label="Languages (comma-separated)" fullWidth value={form.preferences.language.join(", ")} onChange={(e) => handleInput("preferences.language", e.target.value.split(",").map(l => l.trim()))} /></Grid>

          <Grid item xs={12}>
            <FormGroup row>
              {["smoking", "pet_friendly", "party_friendly", "outgoing", "vegan"].map((pref) => (
                <FormControlLabel
                  key={pref}
                  control={
                    <Switch
                      checked={form.preferences[pref as keyof typeof form.preferences]}
                      onChange={(e) => handleInput(`preferences.${pref}`, e.target.checked)}
                    />
                  }
                  label={pref.replace("_", " ")}
                />
              ))}
            </FormGroup>
          </Grid>

          <Grid item xs={6}><TextField label="Preferred Roommate Genders" fullWidth value={form.preferences.preferred_sex_to_live_with.join(", ")} onChange={(e) => handleInput("preferences.preferred_sex_to_live_with", e.target.value.split(",").map(s => s.trim()))} /></Grid>
          <Grid item xs={6}><TextField label="Religion" fullWidth value={form.preferences.religion} onChange={(e) => handleInput("preferences.religion", e.target.value)} /></Grid>
          <Grid item xs={6}><TextField label="Quiet Hours Start" fullWidth value={form.preferences.quiet_hours.start} onChange={(e) => handleInput("preferences.quiet_hours.start", e.target.value)} /></Grid>
          <Grid item xs={6}><TextField label="Quiet Hours End" fullWidth value={form.preferences.quiet_hours.end} onChange={(e) => handleInput("preferences.quiet_hours.end", e.target.value)} /></Grid>

          <Grid item xs={12}><Typography variant="h6">Pets</Typography></Grid>
          <Grid item xs={12}><FormControlLabel control={<Switch checked={form.pets.has_pets} onChange={(e) => handleInput("pets.has_pets", e.target.checked)} />} label="Has Pets?" /></Grid>
          <Grid item xs={12}><TextField label="Pet Species (comma-separated)" fullWidth value={form.pets.species.join(", ")} onChange={(e) => handleInput("pets.species", e.target.value.split(",").map(s => s.trim()))} /></Grid>

          <Grid item xs={12}><Button variant="contained" onClick={handleSubmit}>Save</Button></Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProfileEdit;
