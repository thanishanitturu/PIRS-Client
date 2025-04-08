import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const MapComponent = ({ issues }) => {
  const locations = issues.map((issue) => ({
    position: [issue?.position[0], issue?.position[1]],
    status: issue.status,
    department: issue.department,
    message: issue.title,
  }));
  console.log(locations);

  const [selectedCategories, setSelectedCategories] = useState({
    resolved: false,
    pending: false,
    unresolved: false,
  });

  const handleCheckboxChange = (category) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const getMarkerIcon = (status) => {
    let iconColor = "#808080"; // default: unresolved
    if (status === "resolved") {
      iconColor = "#28a745"; // green
    } else if (status === "pending") {
      iconColor = "#ffc107"; // yellow
    }

    return L.divIcon({
      className: "custom-marker",
      html: `<div style="background-color: ${iconColor}; width: 20px; height: 30px; border-radius: 50% 50% 0 0; border: 2px solid #fff;"></div>`,
      iconSize: [20, 30],
      iconAnchor: [10, 30],
      popupAnchor: [0, -30],
    });
  };

  const filteredLocations = locations.filter((location) => {
    return (
      selectedCategories[location.status] ||
      Object.values(selectedCategories).every((value) => !value)
    );
  });

  return (
    <div className="flex flex-col rounded-lg p-6 w-full bg-white shadow-md">
      <h2 className="text-xl font-bold text-blue-600 mb-4 text-center">
        Map of Reported Issues
      </h2>

      {/* Checkboxes for Filtering */}
      <div className="flex justify-center gap-4 mb-4">
        {["resolved", "pending", "unresolved"].map((category) => (
          <label key={category} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedCategories[category]}
              onChange={() => handleCheckboxChange(category)}
              className="accent-blue-600"
            />
            <span className="capitalize text-gray-700">{category}</span>
          </label>
        ))}
      </div>

      {/* Map */}
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {filteredLocations.map((location, index) => (
          <Marker
            key={index}
            position={location.position}
            icon={getMarkerIcon(location.status)}
          >
            <Popup>
              <div>
                <p className="font-semibold">{location.department}</p>
                <p className="text-sm">{location.message}</p>
                <p className="text-xs text-gray-500 mt-1 capitalize">{location.status}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
