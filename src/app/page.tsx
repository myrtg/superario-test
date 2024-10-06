"use client";

import React from "react";
import { Button, Typography, Box, Grid } from "@mui/material";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const Logo = () => (
  <svg width="80" height="80" viewBox="0 0 50 50">
    <circle cx="25" cy="25" r="20" fill="#ffffff" />
    <text
      x="25"
      y="30"
      fontSize="14"
      fontWeight="bold"
      fill="#3f51b5"
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
    <Box sx={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
      <Grid container sx={{ height: "100%" }}>
        {/* Left side - Welcome message */}
        <Grid
          item
          xs={12}
          md={6}
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
          <Box mb={4}>
            <Logo />
          </Box>
          <Typography
            variant="h2"
            fontWeight="bold"
            align="center"
            gutterBottom
          >
            Welcome to Superiamo
          </Typography>
          <Typography variant="h5" align="center" sx={{ maxWidth: "80%" }}>
            Join our community and unlock a world of possibilities.
          </Typography>
        </Grid>

        {/* Right side - Sign-in button */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: 4,
            bgcolor: "background.paper",
          }}
        >
          <Box sx={{ maxWidth: 400, width: "100%" }}>
            <Typography
              variant="h3"
              fontWeight="bold"
              align="center"
              gutterBottom
            >
              Sign in to Your Account
            </Typography>
            <Typography
              variant="body1"
              color="textSecondary"
              align="center"
              mb={4}
            >
              Access your profile and stay updated with the latest features.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={handleSignIn}
              sx={{
                py: 2,
                mb: 2,
                fontSize: "1.2rem",
                backgroundColor: "#4285F4",
                "&:hover": { backgroundColor: "#3367D6" },
              }}
            >
              Sign in with Google
            </Button>
            <Typography variant="body2" color="textSecondary" align="center">
              By signing in, you agree to our Terms and Privacy Policy.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
