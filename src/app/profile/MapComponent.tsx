import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import axios from "axios";

// Dynamically import Leaflet without SSR
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
import "leaflet/dist/leaflet.css";

// Define the component
const MapComponent: React.FC<{
  onSelectAddress: (address: string) => void;
}> = ({ onSelectAddress }) => {
  const [position, setPosition] = useState<[number, number]>([48.8566, 2.3522]); // Default to Paris

  const fetchAddress = async (lat: number, lon: number) => {
    try {
      const response = await axios.get(
        `https://api-adresse.data.gouv.fr/reverse/?lon=${lon}&lat=${lat}`
      );
      const address =
        response.data.features[0]?.properties?.label || "Unknown Address";
      onSelectAddress(address);
    } catch (error) {
      console.error("Error fetching reverse address:", error);
    }
  };

  const LocationMarker = () => {
    // Handle map click events to get the clicked location's coordinates
    const map = useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        fetchAddress(e.latlng.lat, e.latlng.lng);
      },
    });

    return <Marker position={position} />;
  };

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker />
    </MapContainer>
  );
};

export default dynamic(() => Promise.resolve(MapComponent), { ssr: false });
