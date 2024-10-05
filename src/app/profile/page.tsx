"use client";

import {
  Button,
  CircularProgress,
  TextField,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { db } from "../../config/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import axios from "axios";

export default function Profile() {
  const { data: session } = useSession();
  const [initialData, setInitialData] = useState({
    firstName: "",
    lastName: "",
    email: session?.user?.email || "",
    phone: "",
    dob: "",
    address: "",
  });
  const [formData, setFormData] = useState({ ...initialData });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    phone: "",
    address: "",
  });
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUserData();
    console.log("User image URL:", session?.user?.image); // Log image URL to check if it's valid
  }, [session, fetchUserData]); // Add fetchUserData to the dependency array

  const fetchUserData = async () => {
    if (session?.user?.email) {
      const userDoc = doc(db, "users", session.user.email);
      const userSnapshot = await getDoc(userDoc);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        if (userData.dob) {
          const formattedDob = new Date(userData.dob)
            .toISOString()
            .split("T")[0];
          userData.dob = formattedDob;
        }
        setFormData(userData);
        setInitialData(userData);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "address") {
      fetchAddressSuggestions(value);
    }
  };

  const fetchAddressSuggestions = async (query) => {
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

  const handleSelectSuggestion = (address) => {
    setFormData((prev) => ({
      ...prev,
      address,
    }));
    setSuggestions([]);
  };

  const validateForm = () => {
    let isValid = true;
    let firstNameError = "";
    let lastNameError = "";
    let dobError = "";
    let phoneError = "";
    let addressError = "";
    const nameRegex = /^[A-Za-z\s]+$/;

    if (!formData.firstName || !nameRegex.test(formData.firstName.trim())) {
      firstNameError =
        "First Name is required and should contain only letters and spaces";
      isValid = false;
    }
    if (!formData.lastName || !nameRegex.test(formData.lastName.trim())) {
      lastNameError =
        "Last Name is required and should contain only letters and spaces";
      isValid = false;
    }
    if (!formData.dob) {
      dobError = "Date of Birth is required";
      isValid = false;
    }
    const phoneRegex = /^(?:\+33|0)[1-9](?:\d{2}){4}$/;
    if (!phoneRegex.test(formData.phone)) {
      phoneError =
        "Phone number must be a valid French number, e.g., +33612345678 or 0612345678";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://api-adresse.data.gouv.fr/search/?q=${formData.address}&limit=1`
      );
      const addressData = response.data.features[0];
      if (!addressData) {
        setErrors((prev) => ({
          ...prev,
          address: "Address is invalid. Please enter a valid address.",
        }));
        setIsLoading(false);
        return;
      }
      const userCoordinates = addressData.geometry.coordinates;
      const parisCoordinates = [2.3522, 48.8566];
      const distance = calculateDistance(parisCoordinates, userCoordinates);
      if (distance > 50) {
        setErrors((prev) => ({
          ...prev,
          address: "The address is more than 50 km away from Paris.",
        }));
        setIsLoading(false);
        return;
      }
      const userDoc = doc(db, "users", session?.user?.email);
      await setDoc(userDoc, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dob,
        address: formData.address,
      });
      alert("Profile updated successfully!");
      fetchUserData();
    } catch (error) {
      alert("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearForm = () => {
    setFormData(initialData);
    setErrors({ firstName: "", lastName: "", dob: "", phone: "", address: "" });
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "http://localhost:3000/" });
  };

  const calculateDistance = (coords1, coords2) => {
    const R = 6371;
    const dLat = (coords2[1] - coords1[1]) * (Math.PI / 180);
    const dLon = (coords2[0] - coords1[0]) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(coords1[1] * (Math.PI / 180)) *
        Math.cos(coords2[1] * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      {session?.user?.image ? (
        <Avatar
          alt={session?.user?.name}
          src={session.user.image}
          sx={{ width: 120, height: 120, mb: 3 }} // Larger size and margin below
          imgProps={{ style: { objectFit: "cover" } }} // Ensure the image fits the Avatar
        />
      ) : (
        <Avatar sx={{ width: 120, height: 120, mb: 3 }}>
          {session?.user?.name?.charAt(0)}
        </Avatar>
      )}

      <Typography variant="h4" gutterBottom>
        Update Your Profile
      </Typography>

      <form onSubmit={handleSubmit}>
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
            errors.phone || "Valid French number: +33612345678 or 0612345678"
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
                button
                onClick={() =>
                  handleSelectSuggestion(suggestion.properties.label)
                }
              >
                <ListItemText primary={suggestion.properties.label} />
              </ListItem>
            ))}
          </List>
        )}

        <Box display="flex" justifyContent="space-between" width="100%" mt={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Update Profile"}
          </Button>
          <Button type="button" variant="outlined" onClick={handleClearForm}>
            Clear Form
          </Button>
        </Box>
      </form>

      <Button
        variant="outlined"
        color="secondary"
        onClick={handleLogout}
        sx={{ mt: 2 }}
      >
        Logout
      </Button>
    </Box>
  );
}
