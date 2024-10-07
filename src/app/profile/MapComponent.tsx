import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import dynamic from "next/dynamic";
import axios from "axios";

// Dynamically import Leaflet CSS to avoid SSR issues
const leafletCssUrl = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.css";

// Ensure leaflet's CSS is loaded on the client side
const MapComponent: React.FC<{
  onSelectAddress: (address: string) => void;
}> = ({ onSelectAddress }) => {
  useEffect(() => {
    // Dynamically load Leaflet CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = leafletCssUrl;
    document.head.appendChild(link);
  }, []);

  const [position, setPosition] = useState<[number, number]>([48.8566, 2.3522]); // Default to Paris

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]); // Update position on click
        fetchAddress(e.latlng.lat, e.latlng.lng); // Fetch address based on position
      },
    });

    return <Marker position={position} />;
  };

  const fetchAddress = async (lat: number, lon: number) => {
    try {
      const response = await axios.get(
        `https://api-adresse.data.gouv.fr/reverse/?lon=${lon}&lat=${lat}`
      );
      const address =
        response.data.features[0]?.properties?.label || "Unknown Address";
      onSelectAddress(address); // Call parent component's callback to pass the address
    } catch (error) {
      console.error("Error fetching reverse address:", error);
    }
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
