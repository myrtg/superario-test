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
  Divider,
} from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import { db } from "../../config/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import axios from "axios";

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
    // ... (rest of the function remains the same)
  };

  const handleSelectSuggestion = (address: string) => {
    // ... (rest of the function remains the same)
  };

  const validateForm = () => {
    // ... (rest of the function remains the same)
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // ... (rest of the function remains the same)
  };

  const handleClearForm = () => {
    // ... (rest of the function remains the same)
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "http://localhost:3000/" });
  };

  const calculateDistance = (
    coords1: [number, number],
    coords2: [number, number]
  ) => {
    // ... (rest of the function remains the same)
  };

  return (
    <Box sx={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
      <Grid container sx={{ height: "100%" }}>
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
              sx={{ width: 200, height: 200, mb: 3 }}
            />
          ) : (
            <Avatar sx={{ width: 200, height: 200, mb: 3, fontSize: "5rem" }}>
              {session?.user?.name?.charAt(0) || "U"}
            </Avatar>
          )}
          <Typography variant="h4" align="center" gutterBottom>
            {session?.user?.name || "User"}
          </Typography>
          <Typography variant="h6" align="center" gutterBottom>
            {session?.user?.email || ""}
          </Typography>
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleLogout}
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
            p: 4,
            bgcolor: "background.paper",
            overflowY: "auto",
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
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

            <Box display="flex" justifyContent="space-between" mt={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : "Update Profile"}
              </Button>
              <Button
                type="button"
                variant="outlined"
                onClick={handleClearForm}
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
