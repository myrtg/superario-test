"use client";

import { Box, Button, Typography, Container, Paper } from "@mui/material";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function SignInPage() {
  const { data: session } = useSession();

  // Redirect to profile if already signed in
  if (session) {
    redirect("/profile");
  }

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "300px",
          marginTop: 8,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Welcome Back!
        </Typography>
        <Typography variant="body1" gutterBottom>
          Please sign in to access your profile.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => signIn("google")}
          sx={{ mt: 3 }}
        >
          Sign in with Google
        </Button>
      </Paper>
    </Container>
  );
}
