// src/app/profile/MapComponent.tsx

import React, { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Map, { Marker, MapLayerMouseEvent } from "react-map-gl";
import axios from "axios";

// Define the props interface
interface MapComponentProps {
  onSelectAddress: (address: string) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ onSelectAddress }) => {
  const [viewState, setViewState] = useState({
    longitude: 2.3522,
    latitude: 48.8566,
    zoom: 13,
  });

  const [position, setPosition] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: 48.8566,
    longitude: 2.3522,
  });

  // Define fetchAddress outside of useCallback to prevent re-creation on every render
  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const address = response.data.display_name || "Unknown Address";
      onSelectAddress(address);
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  // Update useCallback to include fetchAddress in dependencies
  const onMapClick = useCallback(
    (event: MapLayerMouseEvent) => {
      const { lngLat } = event;
      const newPosition = {
        latitude: lngLat.lat,
        longitude: lngLat.lng,
      };
      setPosition(newPosition);

      fetchAddress(newPosition.latitude, newPosition.longitude);
    },
    [fetchAddress] // Include fetchAddress in dependencies
  );

  return (
    <Map
      initialViewState={viewState}
      style={{ width: "100%", height: "500px" }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      onMove={(evt) => setViewState(evt.viewState)}
      onClick={onMapClick}
    >
      <Marker latitude={position.latitude} longitude={position.longitude} />
    </Map>
  );
};

// Dynamically import to avoid SSR issues
export default dynamic(() => Promise.resolve(MapComponent), { ssr: false });
