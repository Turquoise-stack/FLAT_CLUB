import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Avatar,
  Switch,
  FormControlLabel,
  MenuItem,
  Select,
  InputLabel,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  // State for the form
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    phone_number: "",
    password: "",
    role: "tenant", // Default role is tenant
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
      quiet_hours: {
        start: "",
        end: "",
      },
    },
    pets: {
      has_pets: false,
      species: [],
    },
  });

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle nested object change
  const handleNestedChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, category: string) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [name]: value,
      },
    }));
  };

  // Handle Switch changes
  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>, category: string, key: string) => {
    const { checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: checked,
      },
    }));
  };

  // Handle multiple selection
  const handleMultipleSelection = (e: React.ChangeEvent<{ value: unknown }>, category: string, key: string) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: e.target.value as string[],
      },
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register", formData);
      console.log("Registration successful:", response.data);
      navigate("/login"); // Redirect to login page after success
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
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
      <Typography variant="h4" color="#1f4b43" mb={4}>
        Create your Flat Club account
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          background: "rgba(255, 255, 255, 0.9)",
          borderRadius: "16px",
          p: 4,
          width: "100%",
          maxWidth: "600px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* User Info */}
        <TextField label="Name" name="name" fullWidth sx={{ mb: 2 }} onChange={handleChange} />
        <TextField label="Surname" name="surname" fullWidth sx={{ mb: 2 }} onChange={handleChange} />
        <TextField label="Username" name="username" required fullWidth sx={{ mb: 2 }} onChange={handleChange} />
        <TextField label="Email" name="email" type="email" fullWidth sx={{ mb: 2 }} onChange={handleChange} />
        <TextField label="Phone Number" name="phone_number" fullWidth sx={{ mb: 2 }} onChange={handleChange} />
        <TextField label="Password" name="password" type="password" required fullWidth sx={{ mb: 2 }} onChange={handleChange} />

        {/* Preferences */}
        <Typography variant="h6" mt={3} mb={2}>
          Preferences
        </Typography>
        <TextField
          label="Nationality"
          name="nationality"
          fullWidth
          sx={{ mb: 2 }}
          onChange={(e) => handleNestedChange(e, "preferences")}
        />
        <TextField
          label="Languages (comma-separated)"
          name="language"
          fullWidth
          sx={{ mb: 2 }}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              preferences: { ...prev.preferences, language: e.target.value.split(",") },
            }))
          }
        />
        <TextField
          label="Preferred Sex to Live With (comma-separated)"
          name="preferred_sex_to_live_with"
          fullWidth
          sx={{ mb: 2 }}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              preferences: { ...prev.preferences, preferred_sex_to_live_with: e.target.value.split(",") },
            }))
          }
        />
        <TextField
          label="Religion"
          name="religion"
          fullWidth
          sx={{ mb: 2 }}
          onChange={(e) => handleNestedChange(e, "preferences")}
        />
        <TextField
          label="Quiet Hours Start"
          name="start"
          type="time"
          fullWidth
          sx={{ mb: 2 }}
          onChange={(e) => handleNestedChange(e, "preferences")}
        />
        <TextField
          label="Quiet Hours End"
          name="end"
          type="time"
          fullWidth
          sx={{ mb: 2 }}
          onChange={(e) => handleNestedChange(e, "preferences")}
        />
        <FormControlLabel
          control={<Switch onChange={(e) => handleSwitchChange(e, "preferences", "smoking")} />}
          label="Smoking Allowed"
        />
        <FormControlLabel
          control={<Switch onChange={(e) => handleSwitchChange(e, "preferences", "vegan")} />}
          label="Vegan"
        />
        <FormControlLabel
          control={<Switch onChange={(e) => handleSwitchChange(e, "preferences", "party_friendly")} />}
          label="Party Friendly"
        />
        <FormControlLabel
          control={<Switch onChange={(e) => handleSwitchChange(e, "preferences", "outgoing")} />}
          label="Outgoing"
        />

        {/* Pets */}
        <Typography variant="h6" mt={3} mb={2}>
          Pets
        </Typography>
        <FormControlLabel
          control={<Switch onChange={(e) => handleSwitchChange(e, "pets", "has_pets")} />}
          label="Do you have pets?"
        />
        <TextField
          label="Pet Species (comma-separated)"
          name="species"
          fullWidth
          sx={{ mb: 2 }}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              pets: { ...prev.pets, species: e.target.value.split(",") },
            }))
          }
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            mt: 3,
            backgroundColor: "#1f4b43",
            ":hover": { backgroundColor: "#164032" },
          }}
        >
          Register
        </Button>
      </Box>
    </Container>
  );
};

export default Register;
