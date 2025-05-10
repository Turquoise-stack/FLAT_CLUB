import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
} from "@mui/material";

interface Listing {
  id: number;
  image: string;
  title: string;
  price: number;
  location?: string;
  groupCount: number;
}

interface ListingGridProps {
  listings: Listing[];
  onCardClick?: (id: number) => void;
}

const ListingGrid: React.FC<ListingGridProps> = ({ listings, onCardClick }) => {
  return (
    <Box sx={{ width: "100%", mt: 5}}>
      <Grid container spacing={2} justifyContent="center">
        {listings.map((listing) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={listing.id}>
            <Card sx={{ width: "100%", height: "100%", cursor: "pointer" }}>
              <CardActionArea onClick={() => onCardClick?.(listing.id)}>
                <CardMedia
                  component="img"
                  height="200"
                  image={listing.image}
                  alt={listing.title}
                />
                <CardContent>
                  <Typography variant="h6">{listing.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${listing.price}
                  </Typography>
                  <Typography variant="body2" color="primary">
                    {listing.groupCount} {listing.groupCount === 1 ? "group" : "groups"}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ListingGrid;
