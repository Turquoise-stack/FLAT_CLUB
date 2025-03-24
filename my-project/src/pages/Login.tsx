import React, { useState } from "react";
import AuthCard from "../components/auth/AuthCard";
import { Box } from "@mui/material";
import Footer from "../components/Footer";
import backgroundImg from "../assets/home.jpg";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // call /api/login
  };

  const fields = [
    {
      name: "email",
      label: "Email",
      value: email,
      onChange: (e) => setEmail(e.target.value),
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      value: password,
      onChange: (e) => setPassword(e.target.value),
    },
  ];

  return (
    <Box
    sx={{
      backgroundImage: `url("/src/assets/home.jpg")`, 
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
    }}
  >
      {/* AuthCard centered in vertical space */}
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <AuthCard
          title="Login"
          fields={fields}
          onSubmit={handleLogin}
          submitLabel="Login"
          bottomLink={{ text: "Don't have an account? Register", to: "/register" }}
        />
      </Box>

      <Footer />
    </Box>
  );
};

export default Login;
