"use client";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import React from "react";
import { SessionProvider } from "next-auth/react";
import Head from "next/head"; // Import Head to add external CSS

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
        {/* Load Mapbox GL CSS via CDN */}
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css"
          rel="stylesheet"
        />
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
