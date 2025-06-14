import React, { useState } from "react";
import AuthCard from "../components/auth/AuthCard";
import { Box } from "@mui/material";
import Footer from "../components/Footer";
import backgroundImg from "/assets/home.jpg";
import PreferenceForm from "../components/auth/PreferenceForm"; 

const Register: React.FC = () => {
  const [step, setStep] = useState(1);

  // Step 1 fields
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");

  // Step 2 fields will go to PreferenceForm component

  const fields = [
    { name: "name", label: "Name", value: name, onChange: (e) => setName(e.target.value) },
    { name: "surname", label: "Surname", value: surname, onChange: (e) => setSurname(e.target.value) },
    { name: "username", label: "Username", value: username, onChange: (e) => setUsername(e.target.value) },
    { name: "email", label: "Email", value: email, onChange: (e) => setEmail(e.target.value) },
    { name: "phone", label: "Phone Number", value: phone, onChange: (e) => setPhone(e.target.value) },
    { name: "password", label: "Password", type: "password", value: password, onChange: (e) => setPassword(e.target.value) },
    { name: "bio", label: "Bio", value: bio, onChange: (e) => setBio(e.target.value) },
  ];

  const handleNext = () => {
    setStep(2); // move to preference step
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Box sx={{ flex: 1, width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {step === 1 ? (
          <AuthCard
            title="Register"
            fields={fields}
            onSubmit={handleNext}
            submitLabel="Next"
            bottomLink={{ text: "Already have an account? Login", to: "/login" }}
          />
        ) : (
          <PreferenceForm
            name={name}
            surname={surname}
            username={username}
            email={email}
            phone={phone}
            password={password}
            bio={bio}
            onBack={() => setStep(1)}
          />
        )}
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
