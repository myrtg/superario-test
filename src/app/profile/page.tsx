// src/app/profile/page.tsx

"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  CircularProgress,
  TextField,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Box,
  Grid,
  Dialog,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import { db } from "../../config/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import axios from "axios";
import dynamic from "next/dynamic";

// Dynamically import the map component to avoid SSR issues
const MapWithNoSSR = dynamic(() => import("./MapComponent"), { ssr: false });

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
}

interface AddressSuggestion {
  properties: {
    id: string;
    label: string;
  };
}

export default function Profile() {
  const { data: session } = useSession();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [initialData, setInitialData] = useState<UserData>({
    firstName: "",
    lastName: "",
    email: session?.user?.email || "",
    phone: "",
    dob: "",
    address: "",
  });
  const [formData, setFormData] = useState<UserData>({ ...initialData });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    phone: "",
    address: "",
  });
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false); // State for handling map open/close

  const fetchUserData = useCallback(async () => {
    if (session?.user?.email) {
      const userDoc = doc(db, "users", session.user.email);
      const userSnapshot = await getDoc(userDoc);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data() as Partial<UserData>;
        const defaultUserData: UserData = {
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: session.user.email || "",
          phone: userData.phone || "",
          dob: userData.dob
            ? new Date(userData.dob).toISOString().split("T")[0]
            : "",
          address: userData.address || "",
        };
        setFormData(defaultUserData);
        setInitialData(defaultUserData);
      }
    }
  }, [session?.user?.email]);

  useEffect(() => {
    fetchUserData();
  }, [session, fetchUserData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "address") {
      fetchAddressSuggestions(value);
    }
  };

  const fetchAddressSuggestions = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(
        `https://api-adresse.data.gouv.fr/search/?q=${query}&limit=5`
      );
      setSuggestions(response.data.features);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
    }
  };

  const handleSelectSuggestion = (address: string) => {
    setFormData((prev) => ({
      ...prev,
      address,
    }));
    setSuggestions([]);
  };

  const handleMapSelectAddress = (address: string) => {
    setFormData((prev) => ({
      ...prev,
      address,
    }));
    setIsMapOpen(false); // Close the map after selecting
  };

  const handleMapToggle = () => {
    setIsMapOpen(!isMapOpen); // Toggle map visibility
  };

  const validateForm = () => {
    let isValid = true;
    let firstNameError = "";
    let lastNameError = "";
    let dobError = "";
    let phoneError = "";
    let addressError = "";

    if (!formData.firstName) {
      firstNameError = "First Name is required";
      isValid = false;
    }
    if (!formData.lastName) {
      lastNameError = "Last Name is required";
      isValid = false;
    }
    if (!formData.dob) {
      dobError = "Date of Birth is required";
      isValid = false;
    }
    const phoneRegex = /^(?:\+33|0)[1-9](?:\d{2}){4}$/;
    if (!phoneRegex.test(formData.phone)) {
      phoneError = "Phone number must be a valid French number";
      isValid = false;
    }
    if (!formData.address) {
      addressError = "Address is required";
      isValid = false;
    }

    setErrors({
      firstName: firstNameError,
      lastName: lastNameError,
      dob: dobError,
      phone: phoneError,
      address: addressError,
    });

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://api-adresse.data.gouv.fr/search/?q=${formData.address}&limit=1`
      );
      const addressData = response.data.features[0];
      if (!addressData) {
        setErrors((prev) => ({
          ...prev,
          address: "Address is invalid.",
        }));
        setIsLoading(false);
        return;
      }

      if (session?.user?.email) {
        const userDoc = doc(db, "users", session.user.email);
        await setDoc(userDoc, formData);
        alert("Profile updated successfully!");
      } else {
        alert("User email is not available");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", width: "100%", overflow: "hidden" }}>
      <Grid container sx={{ minHeight: "100vh" }}>
        {/* Left side - User Info */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            bgcolor: "primary.main",
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: 4,
          }}
        >
          {session?.user?.image ? (
            <Avatar
              alt={session?.user?.name || "User Avatar"}
              src={session.user.image || ""}
              sx={{
                width: isMobile ? 150 : 200,
                height: isMobile ? 150 : 200,
                mb: 3,
              }}
            />
          ) : (
            <Avatar
              sx={{
                width: isMobile ? 150 : 200,
                height: isMobile ? 150 : 200,
                mb: 3,
                fontSize: isMobile ? "3rem" : "5rem",
              }}
            >
              {session?.user?.name?.charAt(0) || "U"}
            </Avatar>
          )}
          <Typography
            variant={isMobile ? "h5" : "h4"}
            align="center"
            gutterBottom
          >
            {session?.user?.name || "User"}
          </Typography>
          <Typography
            variant={isMobile ? "body1" : "h6"}
            align="center"
            gutterBottom
          >
            {session?.user?.email || ""}
          </Typography>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => signOut()}
            sx={{ mt: 4 }}
          >
            Logout
          </Button>
        </Grid>

        {/* Right side - Update Profile Form */}
        <Grid
          item
          xs={12}
          md={8}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            p: isMobile ? 2 : 4,
            bgcolor: "background.paper",
            overflowY: "auto",
          }}
        >
          <Typography
            variant={isMobile ? "h5" : "h4"}
            align="center"
            gutterBottom
          >
            Update Your Profile
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ maxWidth: 600, width: "100%", mx: "auto" }}
          >
            <TextField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              margin="normal"
              fullWidth
              error={!!errors.firstName}
              helperText={errors.firstName || "Please enter your first name"}
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              margin="normal"
              fullWidth
              error={!!errors.lastName}
              helperText={errors.lastName || "Please enter your last name"}
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              margin="normal"
              fullWidth
              disabled
            />
            <TextField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              margin="normal"
              fullWidth
              error={!!errors.phone}
              helperText={
                errors.phone ||
                "Valid French number: +33612345678 or 0612345678"
              }
            />
            <TextField
              label="Date of Birth"
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              margin="normal"
              fullWidth
              error={!!errors.dob}
              helperText={errors.dob || "Please enter your date of birth"}
            />
            <TextField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              margin="normal"
              fullWidth
              error={!!errors.address}
              helperText={
                errors.address || "Enter a valid address within 50 km of Paris."
              }
            />

            {suggestions.length > 0 && (
              <List>
                {suggestions.map((suggestion) => (
                  <ListItem
                    key={suggestion.properties.id}
                    onClick={() =>
                      handleSelectSuggestion(suggestion.properties.label)
                    }
                    sx={{ cursor: "pointer" }}
                  >
                    <ListItemText primary={suggestion.properties.label} />
                  </ListItem>
                ))}
              </List>
            )}

            <Button
              variant="outlined"
              color="primary"
              onClick={handleMapToggle}
              sx={{ mt: 2 }}
            >
              {isMapOpen ? "Close Map" : "Choose Address on Map"}
            </Button>

            {isMapOpen && (
              <Dialog
                open={isMapOpen}
                onClose={handleMapToggle}
                fullWidth
                maxWidth="lg"
              >
                <MapWithNoSSR onSelectAddress={handleMapSelectAddress} />
              </Dialog>
            )}

            <Box
              display="flex"
              flexDirection={isMobile ? "column" : "row"}
              justifyContent="space-between"
              mt={2}
              gap={2}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading}
                fullWidth={isMobile}
              >
                {isLoading ? <CircularProgress size={24} /> : "Update Profile"}
              </Button>
              <Button
                type="button"
                variant="outlined"
                onClick={() => setFormData(initialData)}
                fullWidth={isMobile}
              >
                Clear Form
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
