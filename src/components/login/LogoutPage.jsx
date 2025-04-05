import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import { Button, CircularProgress, Box, Typography } from '@mui/material'; // Using Material-UI for styling
import { AppContext } from '../../context/AppContext';

const LogoutPage = () => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [error, setError] = React.useState(null);
  const{setToken,setRole,setSnackbar} = useContext(AppContext);

  // Automatic logout on component mount
  useEffect(() => {
    handleLogout();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setError(null);
    
    try {
      await signOut(auth);
      localStorage.removeItem("uid");
      localStorage.removeItem("role");
      setToken(null);
      setRole("empty");
      setSnackbar({open:true,severity:"success",message:'Logout succesfull...'});
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1000);
    } catch (err) {
      console.error('Logout error:', err);
      setSnackbar({open:true,severity:"success",message:err.message});
      setError('Failed to sign out. Please try again.');
      setIsLoggingOut(false);
    }
  };

  // Manual logout button handler
  const handleManualLogout = () => {
    handleLogout();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 3,
        textAlign: 'center'
      }}
    >
      {isLoggingOut ? (
        <>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h6" gutterBottom>
            Signing you out...
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please wait while we securely log you out
          </Typography>
        </>
      ) : error ? (
        <>
          <Typography variant="h6" color="error" gutterBottom>
            {error}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleManualLogout}
            sx={{ mt: 2 }}
          >
            Try Again
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/')}
            sx={{ mt: 2, ml: 2 }}
          >
            Go Home
          </Button>
        </>
      ) : (
        // This state shouldn't normally appear due to auto-logout
        <Button
          variant="contained"
          color="primary"
          onClick={handleManualLogout}
        >
          Click to Sign Out
        </Button>
      )}
    </Box>
  );
};

export default LogoutPage;