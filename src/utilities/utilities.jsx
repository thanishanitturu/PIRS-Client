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

        // console.log('Top 3 Contributors:', topThree);
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

const calculateDeptWiseIssueCounts = (initialIssues) => {
  const deptCounts = {};

  initialIssues.forEach(issue => {
    const { department, status } = issue;

    // Initialize department counters if not already
    if (!deptCounts[department]) {
      deptCounts[department] = {
        department, // store department name inside
        total: 0,
        pending: 0,
        unresolved: 0,
        resolved: 0,
        progress: 0
      };
    }

    // Update counters
    deptCounts[department].total++;
    switch (status) {
      case 'pending':
        deptCounts[department].pending++;
        break;
      case 'progress':
        deptCounts[department].progress++;
        break;
      case 'unresolved':
        deptCounts[department].unresolved++;
        break;
      case 'resolved':
        deptCounts[department].resolved++;
        break;
      default:
        console.warn(`Unknown status: ${status}`);
    }
  });

  // Convert the object into an array of objects
  const deptArray = Object.values(deptCounts);

  // console.log(deptArray);
  return deptArray;
};



const generateDepartmentEmail = (department) => {
  if (department.includes('water')) {
    return 'pirs_water_dept@gmail.com';
  } else if (department.includes('traffic')) {
    return 'pirs_traffic_dept@gmail.com';
  } else if (department.includes('electricity')) {
    return 'pirs_electricity_dept@gmail.com';
  } else if (department.includes('municipal')) {
    return 'pirs_municipal_dept@gmail.com';
  } else if (department.includes('public_works')) {
    return 'pirs_publicworks_dept@gmail.com';
  } else if (department.includes('parks')) {
    return 'pirs_parks_dept@gmail.com';
  } else {
    return 'pirs_general_dept@gmail.com'; // fallback
  }
};


export{calculateIssueCounts,topThreeContributors,generateDepartmentEmail,calculateDeptWiseIssueCounts}