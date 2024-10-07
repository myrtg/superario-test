"use client";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import React from "react";
import { SessionProvider } from "next-auth/react";
import "leaflet/dist/leaflet.css"; // Import the Leaflet CSS globally

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
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SessionProvider>{children}</SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
