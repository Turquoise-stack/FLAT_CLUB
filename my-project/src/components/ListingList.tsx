import { Link } from "react-router-dom";
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";

const ListingList = ({ listings }: { listings: any[] }) => {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center", mt: 4 }}>
      {listings.map((listing) => (
        <Link to={`/listing/${listing.id}`} style={{ textDecoration: "none" }} key={listing.id}>
          <Card sx={{ width: 300, height: 420, display: "flex", flexDirection: "column" }}>
            <CardMedia
              component="img"
              height="200"
              image={listing.image}
              alt={listing.title}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>
                {listing.title}
              </Typography>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                Location: {listing.location}
              </Typography>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                ${listing.price} {listing.isRental ? "/ month" : ""}
              </Typography>

              <Typography variant="body2" color="primary">
                {listing.groupCount} {listing.groupCount === 1 ? "group" : "groups"} created
              </Typography>
            </CardContent>
          </Card>
        </Link>
      ))}
    </Box>
  );
};

export default ListingList;
