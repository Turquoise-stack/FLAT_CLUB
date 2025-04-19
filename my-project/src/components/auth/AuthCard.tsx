import React from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  styled,
  Link as MuiLink,
} from "@mui/material";

const GlassCard = styled(Card)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(10px)",
  borderRadius: "1.5rem",
  padding: theme.spacing(4),
  width: "100%", // Take full width of parent
  maxWidth: "600px", // Limit on large screens
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  border: "1px solid rgba(255, 255, 255, 0.18)",
  color: "#000",
}));

const FirstButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#1F4B43",
  color: "#fff",
  borderRadius: "2rem",
  padding: theme.spacing(1.2),
  fontWeight: 600,
  textTransform: "none",
  fontSize: "1rem",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "#173D36",
  },
}));

interface AuthField {
  name: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface AuthCardProps {
  title: string;
  fields: AuthField[];
  onSubmit: () => void;
  submitLabel: string;
  bottomLink?: {
    text: string;
    to: string;
  };
}

const AuthCard: React.FC<AuthCardProps> = ({
  title,
  fields,
  onSubmit,
  submitLabel,
  bottomLink,
}) => {
  return (
    <GlassCard>
      <CardContent>
        <Typography variant="h5" fontWeight={600} textAlign="center" gutterBottom>
          {title}
        </Typography>
        <Box display="flex" flexDirection="column" gap={2} mt={3}>
          {fields.map((field) => (
            <TextField
              key={field.name}
              label={field.label}
              type={field.type || "text"}
              value={field.value}
              onChange={field.onChange}
              fullWidth
              variant="outlined"
              InputProps={{
                style: {
                  backgroundColor: "rgba(255, 255, 255, 0.6)",
                  borderRadius: "0.75rem",
                },
              }}
            />
          ))}
          <FirstButton fullWidth onClick={onSubmit}>
            {submitLabel}
          </FirstButton>
          {bottomLink && (
            <Typography textAlign="center" variant="body2">
              <MuiLink href={bottomLink.to} underline="hover" sx={{ color: "#173D36" }}>
                {bottomLink.text}
              </MuiLink>
            </Typography>
          )}
        </Box>
      </CardContent>
    </GlassCard>
  );
};

export default AuthCard;
