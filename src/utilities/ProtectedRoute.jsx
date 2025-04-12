import { Navigate} from 'react-router-dom';
import { useEffect } from 'react';

const ProtectedRoute = ({ token,setSnackbar,children }) => {
  useEffect(() => {
    if (!token) {
      // alert('Need to Login first!');
      setSnackbar({open:"true",severity:"warning",message:"Need to login first!!!.."})
    }
  }, []);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
