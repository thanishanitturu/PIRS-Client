import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const MapComponent = ({issues
}) => {
  // Locations with category
  // const locations = [
  //   { position: [51.505, -0.09], status: "resolved" },
  //   { position: [51.515, -0.1], status: "pending" },
  //   { position: [51.525, -0.12], status: "unresolved" },
  //   { position: [51.535, -0.13], status: "resolved" },
  //   { position: [51.545, -0.14], status: "pending" },
  // ];
  const locations = issues.map((issue)=>{
    return  { position: [issue.latitude, issue.longitude], status: issue.status }
  })

  const [selectedCategories, setSelectedCategories] = useState({
    Resolved: false,
    Pending: false,
    Unresolved: false,
  });

  // Handle checkbox change
  const handleCheckboxChange = (category) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Function to get the marker icon based on status
  const getMarkerIcon = (status) => {
    let iconColor = "#808080"; // Default color for unresolved

    if (status === "Resolved") {
      iconColor = "#28a745"; // Green for resolved
    } else if (status === "Pending") {
      iconColor = "#ffc107"; // Yellow for pending
    }

    // Create custom icon using L.divIcon
    return L.divIcon({
      className: "custom-marker", // Custom CSS class for styling
      html: `<div style="background-color: ${iconColor}; width: 20px; height: 30px; border-radius: 50% 50% 0 0; border: 2px solid #fff;"></div>`,
      iconSize: [20, 30],
      iconAnchor: [10, 30], // Anchor the icon at the base
      popupAnchor: [0, -30], // Position the popup above the marker
    });
  };

  // Filter locations based on selected categories
  const filteredLocations = locations.filter((location) => {
    return (
      selectedCategories[location.status] ||
      Object.values(selectedCategories).every((value) => !value)
    );
  });

  return (
    <div className="flex flex-col rounded-lg p-6 w-full">
      <h2 className="text-xl font-bold text-blue-600 mb-4 text-center">
        Map of Reported Issues
      </h2>

      {/* Map */}
      <MapContainer
        center={[51.505, -0.09]} // Centered at a default location
        zoom={13}
        style={{ height: "300px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {filteredLocations.map((location, index) => (
          <Marker
            key={index}
            position={location.position}
            icon={getMarkerIcon(location.status)} // Use the custom icon based on status
          >
            <Popup>
              Reported Issue {index + 1} - {location.status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Category Checkboxes */}
      <div className="flex flex-row justify-center items-center gap-4 mt-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedCategories.resolved}
            onChange={() => handleCheckboxChange("Resolved")}
            className="form-checkbox"
          />
          Resolved
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedCategories.pending}
            onChange={() => handleCheckboxChange("Pending")}
            className="form-checkbox"
          />
          Pending
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedCategories.unresolved}
            onChange={() => handleCheckboxChange("Unresolved")}
            className="form-checkbox"
          />
          Unresolved
        </label>
      </div>
    </div>
  );
};

export default MapComponent;
