import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Switch,
  MenuItem,
  FormControlLabel,
  Select,
  InputLabel,
  OutlinedInput,
  Checkbox,
  ListItemText,
  FormControl,
} from "@mui/material";
import axios from "axios";

const languages = ["English", "French", "German", "Spanish"];
const nationalities = ["Canadian", "Turkish", "German", "Italian"];
const speciesOptions = ["Cat", "Dog", "Fish", "Bird"];
const genderOptions = ["Male", "Female", "Other"];

interface Props {
  name: string;
  surname: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  bio: string;
  onBack: () => void;
}

const PreferenceForm: React.FC<Props> = ({
  name,
  surname,
  username,
  email,
  phone,
  password,
  bio,
  onBack,
}) => {
  const [language, setLanguage] = useState<string[]>(["English"]);
  const [nationality, setNationality] = useState("Canadian");
  const [smoking, setSmoking] = useState(false);
  const [petFriendly, setPetFriendly] = useState(true);
  const [partyFriendly, setPartyFriendly] = useState(false);
  const [outgoing, setOutgoing] = useState(false);
  const [preferredSex, setPreferredSex] = useState<string[]>(["Female"]);
  const [religion, setReligion] = useState("None");
  const [vegan, setVegan] = useState(false);
  const [quietStart, setQuietStart] = useState("21:00");
  const [quietEnd, setQuietEnd] = useState("07:00");

  const [hasPets, setHasPets] = useState(true);
  const [species, setSpecies] = useState<string[]>(["Cat"]);

  const handleSubmit = async () => {
    const registerData = {
      name,
      surname,
      username,
      email,
      phone_number: phone,
      password,
      role: "tenant",
      bio,
      preferences: {
        language,
        nationality,
        smoking,
        pet_friendly: petFriendly,
        party_friendly: partyFriendly,
        outgoing,
        preferred_sex_to_live_with: preferredSex,
        religion,
        vegan,
        quiet_hours: {
          start: quietStart,
          end: quietEnd,
        },
      },
      pets: {
        has_pets: hasPets,
        species,
      },
    };

    try {
      const res = await axios.post("/api/register", registerData);
      alert("Registered successfully!");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <Card sx={{ maxWidth: 600, width: "100%", p: 3, borderRadius: 4, backdropFilter: "blur(10px)", background: "rgba(255,255,255,0.05)" }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Preferences & Pets
        </Typography>

        {/* Languages */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Languages</InputLabel>
          <Select
            multiple
            value={language}
            onChange={(e) => setLanguage(e.target.value as string[])}
            input={<OutlinedInput label="Languages" />}
            renderValue={(selected) => selected.join(", ")}
          >
            {languages.map((lang) => (
              <MenuItem key={lang} value={lang}>
                <Checkbox checked={language.includes(lang)} />
                <ListItemText primary={lang} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Nationality */}
        <TextField
          fullWidth
          margin="normal"
          select
          label="Nationality"
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
        >
          {nationalities.map((n) => (
            <MenuItem key={n} value={n}>
              {n}
            </MenuItem>
          ))}
        </TextField>

        {/* Switches */}
        <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
          <FormControlLabel control={<Switch checked={smoking} onChange={() => setSmoking(!smoking)} />} label="Smoking" />
          <FormControlLabel control={<Switch checked={petFriendly} onChange={() => setPetFriendly(!petFriendly)} />} label="Pet Friendly" />
          <FormControlLabel control={<Switch checked={partyFriendly} onChange={() => setPartyFriendly(!partyFriendly)} />} label="Party Friendly" />
          <FormControlLabel control={<Switch checked={outgoing} onChange={() => setOutgoing(!outgoing)} />} label="Outgoing" />
          <FormControlLabel control={<Switch checked={vegan} onChange={() => setVegan(!vegan)} />} label="Vegan" />
        </Box>

        {/* Preferred Sex */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Preferred Gender</InputLabel>
          <Select
            multiple
            value={preferredSex}
            onChange={(e) => setPreferredSex(e.target.value as string[])}
            input={<OutlinedInput label="Preferred Gender" />}
            renderValue={(selected) => selected.join(", ")}
          >
            {genderOptions.map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox checked={preferredSex.includes(option)} />
                <ListItemText primary={option} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Religion */}
        <TextField
          fullWidth
          margin="normal"
          label="Religion"
          value={religion}
          onChange={(e) => setReligion(e.target.value)}
        />

        {/* Quiet Hours */}
        <Box display="flex" gap={2} mt={2}>
          <TextField
            label="Quiet Start"
            type="time"
            value={quietStart}
            onChange={(e) => setQuietStart(e.target.value)}
            fullWidth
          />
          <TextField
            label="Quiet End"
            type="time"
            value={quietEnd}
            onChange={(e) => setQuietEnd(e.target.value)}
            fullWidth
          />
        </Box>

        {/* Pets */}
        <Box mt={3}>
          <FormControlLabel control={<Switch checked={hasPets} onChange={() => setHasPets(!hasPets)} />} label="I have pets" />
          {hasPets && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Pet Species</InputLabel>
              <Select
                multiple
                value={species}
                onChange={(e) => setSpecies(e.target.value as string[])}
                input={<OutlinedInput label="Pet Species" />}
                renderValue={(selected) => selected.join(", ")}
              >
                {speciesOptions.map((s) => (
                  <MenuItem key={s} value={s}>
                    <Checkbox checked={species.includes(s)} />
                    <ListItemText primary={s} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>

        {/* Actions */}
        <Box mt={4} display="flex" justifyContent="space-between">
          <Button variant="outlined" onClick={onBack}>
            Back
          </Button>
          <Button variant="contained" sx={{ backgroundColor: "#1F4B43" }} onClick={handleSubmit}>
            Register
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PreferenceForm;
