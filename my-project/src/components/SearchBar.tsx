import React, { useState } from "react";
import { TextField, Box, Button, Autocomplete } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface SearchFilters {
  location?: string;
  min_price?: number;
  max_price?: number;
  smoking?: boolean;
  vegan?: boolean;
  pet_friendly?: boolean;
  party_friendly?: boolean;
}

const SearchBar = () => {
  const navigate = useNavigate();

  const [location, setLocation] = useState<string>("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [smoking, setSmoking] = useState<string | null>(null);
  const [vegan, setVegan] = useState<string | null>(null);
  const [petFriendly, setPetFriendly] = useState<string | null>(null);
  const [partyFriendly, setPartyFriendly] = useState<string | null>(null);

  const cityOptions = ["Warsaw", "Elblag", "Krakow", "Gdansk", "Wroclaw", "Poznan", "Lodz", "Lublin"];

const handleSubmit = () => {
  const params = new URLSearchParams();

  if (location) params.append("location", location);
  if (minPrice) params.append("min_price", minPrice);
  if (maxPrice) params.append("max_price", maxPrice);
  if (smoking === "smoking") params.append("smoking", "true");
  if (vegan === "vegan friendly") params.append("vegan", "true");
  if (petFriendly === "pet friendly") params.append("pet_friendly", "true");
  if (partyFriendly === "party friendly") params.append("party_friendly", "true");

  navigate(`/search-results?${params.toString()}`);
};


  return (
    <Box
      sx={{
        position: "absolute",
        top: "35%",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0.5,
      }}
    >
      {/* Search & City */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "white",
          borderRadius: "35px",
          flexDirection: "row",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          padding: "10px 20px",
          width: "100%",
        }}
      >
        <Autocomplete
          freeSolo
          options={cityOptions}
          value={location}
          onChange={(_, newValue) => setLocation(newValue || "")}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="City"
              variant="standard"
              InputProps={{
                ...params.InputProps,
                disableUnderline: true,
                sx: {
                  padding: "5px 10px",
                  fontSize: "1rem",
                  width: { xs: "250px", sm: "70px", md: "130px" },
                },
              }}
            />
          )}
        />
      </Box>

      {/* Price Range */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          label="Min Price"
          type="number"
          size="small"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          sx={{
            width: "120px",
            backgroundColor: "white",
            borderRadius: "20px",
            border: "2px solid #1f4b43",
          }}
        />
        <TextField
          label="Max Price"
          type="number"
          size="small"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          sx={{
            width: "120px",
            backgroundColor: "white",
            borderRadius: "20px",
            border: "2px solid #1f4b43",
          }}
        />
      </Box>

      {/* Filter Buttons */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
        {[
          {
            label: "Smoking",
            state: smoking,
            setter: setSmoking,
            match: "smoking",
          },
          {
            label: "Vegan Friendly",
            state: vegan,
            setter: setVegan,
            match: "vegan friendly",
          },
          {
            label: "Pet Friendly",
            state: petFriendly,
            setter: setPetFriendly,
            match: "pet friendly",
          },
          {
            label: "Party Friendly",
            state: partyFriendly,
            setter: setPartyFriendly,
            match: "party friendly",
          },
        ].map(({ label, state, setter, match }) => (
          <Button
            key={label}
            onClick={() => setter((prev) => (prev === match ? null : match))}
            sx={{
              backgroundColor: state === match ? "#1f4b43" : "white",
              color: state === match ? "white" : "#1f4b43",
              borderRadius: "20px",
              padding: "8px 20px",
              fontWeight: "bold",
              border: "2px solid #1f4b43",
              textTransform: "none",
              transition: "0.3s",
              "&:hover": {
                backgroundColor: state === match ? "#164032" : "#e7c873",
                color: "white",
              },
            }}
          >
            {label}
          </Button>
        ))}
      </Box>

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        variant="contained"
        sx={{
          mt: 2,
          fontWeight: "bold",
          backgroundColor: "#1f4b43",
          ":hover": { backgroundColor: "#164032" },
        }}
      >
        Search
      </Button>
    </Box>
  );
};

export default SearchBar;
