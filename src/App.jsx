import { useContext, useState } from 'react'
import './App.css'
import "font-awesome/css/font-awesome.min.css";
import Example from './Navbar';
import {Route, Routes} from 'react-router-dom';
import Navbar from './components/citizen/Navbar';

import DashbordMainLayout from './components/citizen/issues/DashbordMainLayout';
import IssueForm from './components/citizen/issues/IssueForm';
import Homepage from './components/Homepage';
import Footer from './components/Footer';
import AboutPage from './components/AboutPage';
import ScrollToTop from './utilities/ScrollToTop';
import CommunityLayout from './components/citizen/community/CommunityLayout';
import MapWithMarker from './utilities/MapWithMarker';
import MapWithMarkers from './utilities/MapWithMarkers';
import Notifyall from './components/citizen/notifications/Notifyall';
import LoginPage from './components/login/Loginpage';
import SignupPage from './components/login/SignupPage';
import AdminUsers from './components/admin/users/AdminUsers';
import { Snackbar,Alert } from '@mui/material';
import { AppContext } from './context/AppContext';
function App() {
  const[role,setRole] = useState('user');
  const{snackbar,setSnackbar} = useContext(AppContext);

  const [notifications, setNotifications] = useState([
    { id: 1, department: "Sanitation", message: "Your garbage collection issue  is under review.", time: "10:30 AM", date: "Jan 30, 2025", read: false },
    { id: 2, department: "Electricity Board", message: "Power outage in your area has been reported.", time: "09:15 AM", date: "Jan 30, 2025", read: false },
    { id: 3, department: "Water Department", message: "Your water leakage complaint is being addressed.", time: "08:45 AM", date: "Jan 30, 2025", read: false },
    { id: 4, department: "Traffic Police", message: "Your traffic signal issue has been forwarded.", time: "07:30 AM", date: "Jan 29, 2025", read: false },
    { id: 5, department: "Municipality", message: "Streetlight repair request is in progress.", time: "06:20 AM", date: "Jan 29, 2025", read: false },
  ]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  // Filter only unread notifications
  const unreadNotifications = notifications.filter((notif) => !notif.read);

  return (
      <>
      <ScrollToTop />
        { role==="user" && <Navbar notifications={unreadNotifications} />  }
        { role==="admin" && <Example /> }
        { role==="department" && <Example /> }


        <Routes>
            <Route path='/issue-report' element={<IssueForm /> } />
            <Route path='/about' element={<AboutPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<SignupPage />} />

            <Route path='/' element={<Homepage />} />
            <Route path='/notifications' element={<Notifyall notifications={notifications} setNotifications={setNotifications}  markAsRead={markAsRead}/>} />
            <Route path='/dashboard' element={<DashbordMainLayout /> } />
            <Route path='/community' element={<CommunityLayout /> } />
            <Route path='/admin/users' element={<AdminUsers />} />
        </Routes>
        <Footer />
        

        <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      </>
  )
}

export default App
