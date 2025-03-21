import { useContext, useState } from 'react'
import './App.css'
import "font-awesome/css/font-awesome.min.css";
import {Route, Routes} from 'react-router-dom';
import Navbar from './components/citizen/Navbar';
import DashbordMainLayout from './components/citizen/issues/DashbordMainLayout';
import IssueForm from './components/citizen/issues/IssueForm';
import Homepage from './components/Homepage';
import Footer from './components/Footer';
import AboutPage from './components/AboutPage';
import ScrollToTop from './utilities/ScrollToTop';
import CommunityLayout from './components/citizen/community/CommunityLayout';
// import MapWithMarker from './utilities/MapWithMarker';
// import MapWithMarkers from './utilities/MapWithMarkers';
import Notifyall from './components/notifications/Notifyall';
import LoginPage from './components/login/Loginpage';
import SignupPage from './components/login/SignupPage';
import AdminUsers from './components/admin/users/AdminUsers';
import AdminIssues from './components/admin/reports/AdminIssues';
import { Snackbar,Alert } from '@mui/material';
import { AppContext } from './context/AppContext';
import AdminStatistics from './components/admin/statistics/AdminStatistics';
import ProfileLayout from './components/profile/ProfileLayout';
function App() {
  const[role,setRole] = useState('user');
  const{snackbar,setSnackbar} = useContext(AppContext);



 

  return (
      <>
      <ScrollToTop />
        <Navbar />


        <Routes>
            <Route path='/issue-report' element={<IssueForm /> } />
            <Route path='/about' element={<AboutPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<SignupPage />} />
            <Route path='/' element={<Homepage />} />
            <Route path='/notifications' element={<Notifyall />} />
            <Route path='/dashboard' element={<DashbordMainLayout /> } />
            <Route path='/community' element={<CommunityLayout />} />
            <Route path='/admin/users' element={<AdminUsers />} />
            <Route path='/admin/issues' element={<AdminIssues />} />
            <Route path='/admin/statistics' element={<AdminStatistics />} />
            <Route path='/profile' element={<ProfileLayout />} />
        </Routes>
        <Footer />
        

        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} >
          <Alert  onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
      </Snackbar>
      </>
  )
}

export default App
