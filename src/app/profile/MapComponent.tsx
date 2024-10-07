// src/app/profile/MapComponent.tsx

import React, { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Map, { Marker } from "react-map-gl";
import axios from "axios";

const MapComponent: React.FC<{
  onSelectAddress: (address: string) => void;
}> = ({ onSelectAddress }) => {
  const [viewState, setViewState] = useState({
    longitude: 2.3522,
    latitude: 48.8566,
    zoom: 13,
  });

  const [position, setPosition] = useState({
    latitude: 48.8566,
    longitude: 2.3522,
  });

  const onMapClick = useCallback((event: any) => {
    // Adjust typing as needed
    const { lngLat } = event;
    const newPosition = {
      latitude: lngLat.lat,
      longitude: lngLat.lng,
    };
    setPosition(newPosition);

    fetchAddress(newPosition.latitude, newPosition.longitude);
  }, []);

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

export default dynamic(() => Promise.resolve(MapComponent), { ssr: false });
