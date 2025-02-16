import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Create colored markers using L.divIcon
const createIcon = (color) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10], // Center the icon on the marker
    popupAnchor: [0, -10], // Adjust popup position relative to the marker
  });
};

// List of locations with status
const locations = [
  { lat: 51.505, lng: -0.09, title: "Location 1", status: "Pending" },
  { lat: 51.515, lng: -0.1, title: "Location 2", status: "Resolved" },
  { lat: 51.525, lng: -0.12, title: "Location 3", status: "Unresolved" },
  // Add more locations as needed
];

const MapWithMarkers = () => {
  const [position, setPosition] = useState([51.505, -0.09]); // Default center if no location

  return (
    <div>
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: '60vh', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />
        
        {/* Loop through the list of locations and create a marker for each */}
        {locations.map((location, index) => {
          // Assign color based on status
          let markerColor;
          switch (location.status) {
            case 'Pending':
              markerColor = 'yellow'; // Yellow for Pending
              break;
            case 'Resolved':
              markerColor = 'green'; // Green for Resolved
              break;
            case 'Unresolved':
              markerColor = 'red'; // Red for Unresolved
              break;
            default:
              markerColor = 'gray'; // Default color
          }

          return (
            <Marker
              key={index}
              position={[location.lat, location.lng]}
              title={location.title}
              icon={createIcon(markerColor)} // Set icon based on the status color
            >
              <Popup>{location.title} - {location.status}</Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapWithMarkers;
