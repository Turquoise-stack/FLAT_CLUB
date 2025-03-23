import React, { useState } from "react";
import { TextField, Box, Button, FormControl, Select, MenuItem, Typography, Slider } from "@mui/material";
import { Autocomplete } from "@mui/material";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [partyFriendly, setPartyFriendly] =  useState<string | null>(null);
  const [smoking, setSmoking] = useState<string | null>(null);
  const [petFriendly, setPetFriendly] = useState<string | null>(null);
  const [vegan, setVegan] = useState<string | null>(null);
  const [location, setLocation] = useState<string>("");
  const [priceRange, setPriceRange] = useState<number[]>([1000, 5000]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  
  const cityOptions = ["Warsaw", "Elblag", "Krakow", "Gdansk", "Wroclaw", "Poznan", "Lodz", "Lublin"];

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(searchQuery);
    }
  };

  return (
    <Box sx={{
      position: "absolute",
      top: { xs: "30px", sm: "210px", md: "280x", lg: "390px" }, 
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 2,
    }}>
      {/* Search Bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "white",
          borderRadius: "35px",
          flexDirection: "row",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          padding: "10px 20px",
          width: { xs: "250px", sm: "350px", md: "400px" },
        }}
      >
        <TextField
          fullWidth
          placeholder="Search listings..."
          variant="standard"
          value={searchQuery}
          onChange={handleSearch}
          onKeyPress={handleKeyPress}
          InputProps={{
            disableUnderline: true,
            sx: { fontSize: "1rem", padding: "5px 10px" },
          }}
        />

        <Autocomplete
          freeSolo
          options={cityOptions}
          value={location}
          onChange={(_e, newValue) => setLocation(newValue || "")}
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
          sx={{
            width: { xs: "250px", sm: "70px", md: "130px" },
            backgroundColor: "white",
            borderRadius: "35px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            paddingX: "15px",
            paddingY: "5px",
          }}
        />
      </Box>

      {/* Price Range Section */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          label="Min Price"
          type="number"
          size="small"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          sx={{
            width: "120px",
            border: "2px solid #1f4b43",
            backgroundColor: "white",
            borderRadius: "20px",
            "& .MuiInputBase-root": {
              borderRadius: "19px",
            },
          }}
          inputProps={{ min: 0 }}
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
            "& .MuiInputBase-root": {
              borderRadius: "19px",
            },
          }}
          inputProps={{ min: 1 }}
        />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "row", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
      {/* Smoking Toggle Button */}
      <Button
        onClick={() => setSmoking((prev) => (prev === "smoking" ? "non-smoking" : "smoking"))}
        sx={{
          backgroundColor: smoking === "smoking" ? "#1f4b43" : "white",
          color: smoking === "smoking" ? "white" : "#1f4b43",
          borderRadius: "20px",
          padding: "8px 20px",
          fontWeight: "bold",
          border: "2px solid #1f4b43",
          textTransform: "none",
          transition: "0.3s",
          "&:hover": {
            backgroundColor: smoking === "smoking" ? "#164032" : "#e7c873",
            color: "white",
          },
        }}
      >
        {smoking === "smoking" ? "Smoking" : "Non-Smoking"}
      </Button>

      {/* Vegan Toggle Button */}
      <Button
        onClick={() => setVegan((prev) => (prev === "vegan friendly" ? "non-vegan" : "vegan friendly"))}
        sx={{
          backgroundColor: vegan === "vegan friendly" ? "#1f4b43" : "white",
          color: vegan === "vegan friendly" ? "white" : "#1f4b43",
          borderRadius: "20px",
          padding: "8px 20px",
          fontWeight: "bold",
          border: "2px solid #1f4b43",
          textTransform: "none",
          transition: "0.3s",
          "&:hover": {
            backgroundColor: vegan === "vegan friendly" ? "#164032" : "#e7c873",
            color: "white",
          },
        }}
      >
        {vegan === "vegan friendly" ? "Vegan Friendly" : "Non-Vegan"}
      </Button>

      {/* Pets Toggle Button */}
      <Button
        onClick={() => setPetFriendly((prev) => (prev === "pet friendly" ? "non-pets" : "pet friendly"))}
        sx={{
          backgroundColor: petFriendly === "pet friendly" ? "#1f4b43" : "white",
          color: petFriendly === "pet friendly" ? "white" : "#1f4b43",
          borderRadius: "20px",
          padding: "8px 20px",
          fontWeight: "bold",
          border: "2px solid #1f4b43",
          textTransform: "none",
          transition: "0.3s",
          "&:hover": {
            backgroundColor: petFriendly === "pet friendly" ? "#164032" : "#e7c873",
            color: "white",
          },
        }}
      >
        {petFriendly === "pet friendly" ? "Pet Friendly" : "No-Pets"}
      </Button>

      {/* Party Friendly Button */}
      <Button
        onClick={() => setPartyFriendly((prev) => (prev === "party friendly" ? "No-Parties" : "party friendly"))}
        sx={{
          backgroundColor: partyFriendly === "party friendly" ? "#1f4b43" : "white",
          color: partyFriendly === "party friendly" ? "white" : "#1f4b43",
          borderRadius: "20px",
          padding: "8px 20px",
          fontWeight: "bold",
          border: "2px solid #1f4b43",
          textTransform: "none",
          transition: "0.3s",
          "&:hover": {
            backgroundColor: partyFriendly === "party friendly" ? "#164032" : "#e7c873",
            color: "white",
          },
        }}
      >
        {partyFriendly === "party friendly" ? "Party Friendly" : "No-Parties"}
      </Button>
      </Box>

      
    </Box>

    
  );
};

export default SearchBar;
