import React from "react";
import { Box, Typography, Grid, Card, CardMedia, CardContent } from "@mui/material";

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
    <Box sx={{ width: "100%", mt: 5, px: 2 }}>
      <Grid container spacing={2} justifyContent="center">
        {listings.map((listing) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={listing.id}>
            <Card sx={{ width: "100%", height: "100%" }}>
              <CardMedia
                component="img"
                height="200"
                image={listing.image}
                alt={listing.title}
              />
              <CardContent>
                <Typography variant="h6">{listing.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  ${listing.price} / {listing.groupCount} groups
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ListingGrid;
