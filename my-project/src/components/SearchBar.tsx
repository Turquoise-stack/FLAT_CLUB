import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center", width: "100%", maxWidth: 600, margin: "20px auto" }}>
      <TextField
        label="Search listings..."
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Button
        variant="contained"
        onClick={handleSearch}
        sx={{ backgroundColor: "#1f4b43", ":hover": { backgroundColor: "#164032" } }}
      >
        Search
      </Button>
    </Box>
  );
};

export default SearchBar;
