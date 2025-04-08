import { fetchUserReportsStatistics } from "../firebase/citizen/reportFuncs";



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

  
  const topThreeContributors = async () => {
    try {
        const res = await fetchUserReportsStatistics(); // res is array of users
        if (!Array.isArray(res)) {
            console.error('Unexpected data format', res);
            return;
        }

        const sorted = res.sort((a, b) => {
            return (b.stats.resolvingRatio || 0) - (a.stats.resolvingRatio || 0);
        });

        const topThree = sorted.slice(0, 3);

        console.log('Top 3 Contributors:', topThree);
        return topThree;
    } catch (error) {
        console.error('Error fetching top contributors:', error);
    }
};


const calculateIssueCounts = (initialIssues) => {
  // Initialize counters
  const counts = {
    total: 0,
    pending: 0,
    unresolved: 0,
    resolved: 0,
    progress:0
  };

  // Count each status
  initialIssues.forEach(issue => {
    counts.total++;
    switch (issue.status) {
      case 'pending':
        counts.pending++;
        break;
      case 'progress':
        counts.progress++;
        break;
      case 'unresolved':
        counts.unresolved++;
        break;
      case 'resolved':
        counts.resolved++;
        break;
      default:
        // Handle any unexpected statuses
        console.warn(`Unknown status: ${issue.status}`);
    }
  });

  return counts;
};

export{calculateIssueCounts,topThreeContributors}