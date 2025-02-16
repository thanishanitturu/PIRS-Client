import React,{useState} from 'react'
import HeadingComponent from './HeadingComponent'
import StatisticsLayout from './StatisticsLayout'
import SearchFilter from './SearchFilter'
import IssueGrid from './IssueGrid'
let initialIssues = [
  {
    id: 1,
    title: "Open Manhole on Main Street",
    date: "2025-01-25",
    location: "Main Street, City Center",
    category: "Roads",
    status: "Pending",
    image: "https://res.cloudinary.com/dgye02qt9/image/upload/v1737871824/publicissue_oiljot.jpg",
    description: "An open manhole poses a serious hazard to pedestrians and vehicles.",
    comments: [
      { user: "John Doe", text: "This needs urgent attention!", avatar: "https://res.cloudinary.com/dgye02qt9/image/upload/v1737871824/publicissue_oiljot.jpg" },
      { user: "Jane Smith", text: "Reported to the municipality.", avatar: "https://res.cloudinary.com/dgye02qt9/image/upload/v1737871824/publicissue_oiljot.jpg" },
    ],
    likes: 10,
    latitude: 51.505,
    longitude: -0.09,
  },
  {
    id: 2,
    title: "Streetlight Not Working",
    date: "2025-01-20",
    location: "5th Avenue, Downtown",
    category: "Electricity",
    status: "Resolved",
    image: "https://res.cloudinary.com/dgye02qt9/image/upload/v1737871824/publicissue_oiljot.jpg",
    description: "The streetlight on 5th Avenue was broken for weeks.",
    comments: [
      { user: "Alice Johnson", text: "It’s finally fixed!", avatar: "https://res.cloudinary.com/dgye02qt9/image/upload/v1737871824/publicissue_oiljot.jpg" },
    ],
    likes: 5,
    latitude: 51.515,
    longitude: -0.1,
  },
  {
    id: 3,
    title: "Open Manhole on Main Street",
    date: "2025-01-25",
    location: "Main Street, City Center",
    category: "Water",
    status: "Pending",
    image: "https://res.cloudinary.com/dgye02qt9/image/upload/v1737871824/publicissue_oiljot.jpg",
    description: "An open manhole poses a serious hazard to pedestrians and vehicles.",
    comments: [
      { user: "John Doe", text: "This needs urgent attention!", avatar: "https://res.cloudinary.com/dgye02qt9/image/upload/v1737871824/publicissue_oiljot.jpg" },
      { user: "Jane Smith", text: "Reported to the municipality.", avatar: "https://res.cloudinary.com/dgye02qt9/image/upload/v1737871824/publicissue_oiljot.jpg" },
    ],
    likes: 10,
    latitude: 51.525,
    longitude: -0.12,
  },
  {
    id: 4,
    title: "Streetlight Not Working",
    date: "2025-01-20",
    location: "5th Avenue, Downtown",
    category: "Electricity",
    status: "Resolved",
    image: "https://res.cloudinary.com/dgye02qt9/image/upload/v1737871824/publicissue_oiljot.jpg",
    description: "The streetlight on 5th Avenue was broken for weeks.",
    comments: [
      { user: "Alice Johnson", text: "It’s finally fixed!", avatar: "https://res.cloudinary.com/dgye02qt9/image/upload/v1737871824/publicissue_oiljot.jpg" },
    ],
    likes: 5,
    latitude: 51.535,
    longitude: -0.13,
  },
  {
    id: 5,
    title: "Open Manhole on Main Street",
    date: "2025-01-25",
    location: "Main Street, City Center",
    category: "Water",
    status: "Pending",
    image: "https://res.cloudinary.com/dgye02qt9/image/upload/v1737871824/publicissue_oiljot.jpg",
    description: "An open manhole poses a serious hazard to pedestrians and vehicles.",
    comments: [
      { user: "John Doe", text: "This needs urgent attention!", avatar: "https://res.cloudinary.com/dgye02qt9/image/upload/v1737871824/publicissue_oiljot.jpg" },
      { user: "Jane Smith", text: "Reported to the municipality.", avatar: "https://res.cloudinary.com/dgye02qt9/image/upload/v1737871824/publicissue_oiljot.jpg" },
    ],
    likes: 10,
    latitude: 51.545,
    longitude: -0.14,
  },
  {
    id: 6,
    title: "Streetlight Not Working",
    date: "2025-01-20",
    location: "5th Avenue, Downtown",
    category: "Waste",
    status: "Resolved",
    image: "https://res.cloudinary.com/dgye02qt9/image/upload/v1737871824/publicissue_oiljot.jpg",
    description: "The streetlight on 5th Avenue was broken for weeks.",
    comments: [
      { user: "Alice Johnson", text: "It’s finally fixed!", avatar: "https://res.cloudinary.com/dgye02qt9/image/upload/v1737871824/publicissue_oiljot.jpg" },
    ],
    likes: 5,
    latitude: 51.555,
    longitude: -0.15,
  },
];

function CommunityLayout() {
   const [searchTerm, setSearchTerm] = useState("");
    const [status, setStatus] = useState("");
    const [category, setCategory] = useState("");
    const [dateReported, setDateReported] = useState("");
    const [sortBy, setSortBy] = useState("newest");
  const [issues, setIssues] = useState(initialIssues);
  const [filteredIssues, setFilteredIssues] = useState(initialIssues);

  const handleFilterChange = ({ searchTerm, status, category, dateReported, sortBy }) => {
    let filtered = [...issues];
    console.log('called');
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((issue) => issue.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
  
    // Apply status filter
    if (status) {
      filtered = filtered.filter((issue) => issue.status === status);
    }
  
    // Apply category filter
    if (category) {
      filtered = filtered.filter((issue) => issue.category === category);
    }
  
    // Apply date filter
    if (dateReported) {
      filtered = filtered.filter((issue) => issue.date === dateReported);
    }
  
    // Apply sorting
    if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.dateReported) - new Date(a.dateReported));
    } else if (sortBy === "most-upvoted") {
      filtered.sort((a, b) => b.likes - a.likes); // Use 'likes' instead of 'upvotes'
    }
  
    console.log(filtered); // Log the filtered array
  
    // Update the state
    setFilteredIssues(filtered);
  };
  

  
  return (
    <>
    <HeadingComponent />
    <StatisticsLayout  initialIssues={initialIssues}/>
    <SearchFilter onFilterChange={handleFilterChange} setSortBy={setSortBy} setDateReported={setDateReported} searchTerm={searchTerm} status={status} category={category} dateReported={dateReported} sortBy={sortBy} setCategory={setCategory} setSearchTerm={setSearchTerm} setStatus={setStatus}/>
    <IssueGrid issues={filteredIssues} />

    </>
  )
}

export default CommunityLayout