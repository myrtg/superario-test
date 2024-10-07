// src/app/layout.tsx
"use client";

import "mapbox-gl/dist/mapbox-gl.css"; // Load Mapbox CSS globally
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import React from "react";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#f50057",
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        {/* Add any additional head elements here */}
        <title>Your App Title</title>
        <meta name="description" content="Your app description" />
        {/* Example: Load Mapbox GL CSS via CDN (optional if already imported globally) */}
        {/*
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css"
          rel="stylesheet"
        />
        */}
      </Head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SessionProvider>{children}</SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
