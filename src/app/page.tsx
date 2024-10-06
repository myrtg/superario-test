"use client";

import React from "react";
import {
  Button,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Typography,
  Box,
} from "@mui/material";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const Logo = () => (
  <svg width="50" height="50" viewBox="0 0 50 50">
    <circle cx="25" cy="25" r="20" fill="#4285F4" />
    <text
      x="25"
      y="30"
      fontSize="14"
      fontWeight="bold"
      fill="white"
      textAnchor="middle"
    >
      S
    </text>
  </svg>
);

export default function SignInPage() {
  const { data: session } = useSession();

  // Redirect the user to the profile page if already signed in
  if (session) {
    redirect("/profile");
  }

  const handleSignIn = () => {
    signIn("google"); // Trigger Google sign-in through next-auth
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="grey.100"
    >
      <Card sx={{ width: 350, boxShadow: 3 }}>
        <CardHeader
          title={
            <Box display="flex" justifyContent="center" mb={2}>
              <Logo />
            </Box>
          }
          subheader={
            <>
              <Typography variant="h5" fontWeight="bold" align="center">
                Welcome to Superiamo
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center">
                Sign in to access your profile
              </Typography>
            </>
          }
        />
        <CardContent>
          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            mb={2}
          >
            Please sign in to manage your information and stay updated.
          </Typography>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSignIn}
            sx={{
              backgroundColor: "#4285F4",
              "&:hover": { backgroundColor: "#3367D6" },
            }}
          >
            Sign in with Google
          </Button>
        </CardContent>
        <CardActions>
          <Typography
            variant="caption"
            color="textSecondary"
            align="center"
            sx={{ width: "100%" }}
          >
            By signing in, you agree to our Terms and Privacy Policy.
          </Typography>
        </CardActions>
      </Card>
    </Box>
  );
}
