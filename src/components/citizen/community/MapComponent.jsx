import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const MapComponent = ({issues
}) => {
 
  const locations = issues.map((issue)=>{
    return  { position:[issue?.position[0],issue?.position[1]], status: issue.status }
  })

  

  const [selectedCategories, setSelectedCategories] = useState({
    Resolved: false,
    Pending: false,
    Unresolved: false,
  });

  const handleCheckboxChange = (category) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };


  const getMarkerIcon = (status) => {
    let iconColor = "#808080"; 
    if (status === "Resolved") {
      iconColor = "#28a745"; 
    } else if (status === "Pending") {
      iconColor = "#ffc107"; 
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
    <div className="flex flex-col rounded-lg p-6 w-full">
      <h2 className="text-xl font-bold text-blue-600 mb-4 text-center">
        Map of Reported Issues
      </h2>

      {/* Map */}
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: "300px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {filteredLocations.map((location, index) => (
          <Marker
            key={index}
            position={location.position}
            icon={getMarkerIcon(location.status)} 
          >
            <Popup>
              Reported Issue {index + 1} - {location.status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

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
