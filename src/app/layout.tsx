// src/app/layout.tsx
"use client";

import "mapbox-gl/dist/mapbox-gl.css"; // Load Mapbox CSS globally
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import React from "react";
import { SessionProvider } from "next-auth/react";

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
