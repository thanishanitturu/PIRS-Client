import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

let DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});
L.Marker.prototype.options.icon = DefaultIcon;

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search button clicked, query:', query); // Log the query when search is triggered
    if (query) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSearch} style={{ marginBottom: '10px' }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a location"
        style={{
          width: '300px',
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          marginRight: '10px',
        }}
      />
      <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
        Search
      </button>
    </form>
  );
};

const MapWithMarker = ({position,setPosition,address,setAddress}) => {
  // const [position, setPosition] = useState(null);
  // const [address, setAddress] = useState('Fetching address...');
  // const [searchControl, setSearchControl] = useState(null)
  // const [isSearchControlReady, setIsSearchControlReady] = useState(false);
  const mapRef = useRef(null);

  // Fetch user's current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (location) => {
        const { latitude, longitude } = location.coords;
        setPosition([latitude, longitude]);
        fetchAddress(latitude, longitude); // Initial reverse geocoding
      },
      () => {
        console.error('Error fetching location');
        setPosition([51.505, -0.09]); // Default to London if location is not available
      }
    );
  }, []);

  // Reverse Geocoding Function
  const fetchAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      setAddress(data.display_name || 'Address not found');
    } catch (error) {
      console.error('Error fetching address:', error);
      setAddress('Address not available');
    }
  };

  // Add GeoSearchControl to the map
  const addSearchControl = (map) => {
    const provider = new OpenStreetMapProvider();
    const geoSearch = new GeoSearchControl({
      provider,
      style: 'bar',
      showMarker: true,
      autoClose: true, // Close the search box after selecting a location
    });

    map.addControl(geoSearch);
    setSearchControl(geoSearch); // Store the control once it is added
    setIsSearchControlReady(true); // Set the flag to true when GeoSearchControl is ready
  };

  // Handle location search from the search bar
  const handleLocationSearch = (query) => {
    if (isSearchControlReady && searchControl) {
      console.log('GeoSearchControl initialized, performing search...');
      searchControl.search(query).then((results) => {
        console.log('Search results:', results); // Log search results
        if (results && results.length > 0) {
          const { x, y } = results[0].location;
          setPosition([y, x]);
          fetchAddress(y, x);
        } else {
          alert('Location not found');
        }
      }).catch(error => {
        console.error('Error during location search:', error);
        alert('There was an error searching for the location.');
      });
    } else {
      console.error('GeoSearchControl is not initialized yet');
    }
  };

  // Handle marker drag event
  const handleMarkerDrag = (event) => {
    const marker = event.target;
    const newPos = marker.getLatLng();
    setPosition([newPos.lat, newPos.lng]);
    fetchAddress(newPos.lat, newPos.lng); // Fetch address on marker drag
  };

  // Show loading text until position is fetched
  if (!position) {
    return <p>Loading map...</p>;
  }

  return (
    <div>
      {/* <SearchBar onSearch={handleLocationSearch} /> */}
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: '55vh', width: '100%' }}
        whenCreated={addSearchControl} // Initialize GeoSearchControl when the map is created
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />
        <Marker
          position={position}
          draggable={true}
          eventHandlers={{
            dragend: handleMarkerDrag,
          }}
        >
          <Popup>
            <strong>Current Address:</strong> {address}
          </Popup>
        </Marker>
      </MapContainer>
      <div style={{ padding: '10px', fontSize: '16px' }}>
        <strong>Current Address:</strong> {address}
      </div>
    </div>
  );
};

export default MapWithMarker;
