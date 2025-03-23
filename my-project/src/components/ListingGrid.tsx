import React from "react";
import { Grid, Box, Paper, Typography } from "@mui/material";
import ListingCard from "./ListingCard";

interface Listing {
  id: number;
  image: string;
  title: string;
  price: number;
  groupCount: number;
}

interface ListingGridProps {
  listings: Listing[];
}

const ListingGrid: React.FC<ListingGridProps> = ({ listings }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#fefefe", // light white
        borderRadius: 4,
        boxShadow: 3,
        p: 4,
        mx: "auto",
        maxWidth: "1400px",
        mt: 5,
      }}
    >
      <Typography variant="h5" fontWeight="bold" mb={3} align="center" color="black">
        Featured Properties
      </Typography>

      <Grid container spacing={3}>
        {listings.map((listing) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={listing.id}>
            <ListingCard
              image={listing.image}
              title={listing.title}
              price={listing.price}
              groupCount={listing.groupCount}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ListingGrid;
