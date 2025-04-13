import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {FaSpinner} from "react-icons/fa";

import { loginUser } from '../../firebase/citizen/authFuncs';
import { AppContext } from '../../context/AppContext';
import { NavigationOff } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currRole, setCurrRole] = useState("citizen"); 
  const navigate = useNavigate();
  const[loading,setLoading] = useState(false);
  const{setSnackbar,token,setToken,setRole} = useContext(AppContext);


  useEffect(()=>{
      if(token){
        navigate("/dashboard");
      }
  },[])
  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setTimeout(async()=>{
      try {
        console.log("Login attempt with:", { email, password, currRole });
        
        const response = await loginUser(email, password, currRole);
        console.log("Login successful:", response);
        
        // Store user data in localStorage
        localStorage.setItem("role", response.role); // Note: response.data doesn't exist in our loginUser function
        localStorage.setItem("uid", response.uid); // Store user ID as well
        setRole(response.role);
        setToken(response.uid);
        
        // Navigate to dashboard
        setSnackbar({open:true,severity:"success",message:"Login Successfull..."})
        if(currRole === "admin")
            navigate("/");
        else if(currRole==="dept")
            navigate("/");
        else  
            navigate("/dashboard");
      } catch (error) {
        console.error("Login failed:", error.message);
        setSnackbar({open:true,severity:"error",message:error.message});
      }
      setLoading(false);
    },2000)
  };

  // Navigate to signup page
  const handleSignUpRedirect = () => {
    navigate('/register');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 border-t-2 border-t-blue-500">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          {/* Role Selection */}
          <div className="mb-4">
            <label htmlFor="role" className="block text-gray-700">Select Role</label>
            <select
              id="role"
              value={currRole}
              onChange={(e) => setCurrRole(e.target.value)}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="admin">Admin</option>
              <option value="citizen">Citizen</option>
              <option value="dept">Authority</option>
            </select>
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Login Button */}
         
          {
  loading ? (
    <div className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-center items-center">
      <FaSpinner className="animate-spin text-lg" />
    </div>
  ) : (
    <button
      type="submit"
      className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      onClick={handleLogin}
    >
      Login
    </button>
  )
}
        </form>

        {/* Sign Up Link */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={handleSignUpRedirect}
              className="text-blue-600 hover:text-blue-800"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;