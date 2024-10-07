import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

interface MapComponentProps {
  onSelectAddress: (address: string) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ onSelectAddress }) => {
  const [position, setPosition] = useState<[number, number]>([48.8566, 2.3522]);
  const [address, setAddress] = useState<string>("");

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        fetchAddress(e.latlng.lat, e.latlng.lng);
      },
    });

    return position ? <Marker position={position}></Marker> : null;
  };

  const fetchAddress = async (lat: number, lon: number) => {
    try {
      const response = await axios.get(
        `https://api-adresse.data.gouv.fr/reverse/?lon=${lon}&lat=${lat}`
      );
      const address =
        response.data.features[0]?.properties?.label || "Unknown Address";
      setAddress(address);
      onSelectAddress(address);
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

export default MapComponent;
