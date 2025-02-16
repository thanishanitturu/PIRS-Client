export default function getLocationFromCoordinates(lat, lng) {
    const apiKey = 'AIzaSyDztVJVZA0AnuSe8sUEZaTrNB9VeOGbF4c';
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.status === 'OK') {
          const results = data.results;
          // Extract the address details you need
          const address = results[0].formatted_address;
          console.log('Location:', address);
        } else {
          console.error('Geocoding failed:', data.status);
        }
      })
      .catch(error => console.error('Error fetching location:', error));
  }

  
//   // Example usage:
//   getLocationFromCoordinates(12.9716, 77.5946); // Replace with your latitude and longitude
  