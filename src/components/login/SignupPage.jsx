import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser,loginUser } from '../../firebase/citizen/authFuncs';

const SignupPage = () => {
  const [role, setRole] = useState('citizen');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState(null);
  const [department, setDepartment] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async () => {
    e.preventDefault();
    try {
      console.log("Signing up...");
      const response = await registerUser(name, email, password, role, address, department, phone, photo);
      console.log("Signup success:", response);

      if (response) {
        navigate("/dashboard"); // Redirect user after successful signup
      }
    } catch (error) {
      console.error("Signup failed:", error.message);
      alert(error.message); // Display error message
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
    }
  };

  return (
    <div className="flex justify-center items-center pt-8 bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl border-t-2 border-t-blue-500">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Sign Up</h2>
        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <label htmlFor="role" className="block text-gray-700">Select Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="citizen">Citizen</option>
              <option value="authority">Authority</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-gray-700">Phone Number</label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
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
            <div>
              <label htmlFor="password" className="block text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Create a password"
                required
              />
            </div>
          </div>

          {role === 'citizen' && (
            <div className="mb-4">
              <label htmlFor="address" className="block text-gray-700">Address</label>
              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your address"
                required
              />
            </div>
          )}

          {role === 'authority' && (
            <div className="mb-4">
              <label htmlFor="department" className="block text-gray-700">Department</label>
              <input
                type="text"
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your department"
                required
              />
            </div>
          )}

          <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="photo" className="block text-gray-700">Profile Photo</label>
              <input
                type="file"
                id="photo"
                onChange={handlePhotoChange}
                className="w-full mt-2 text-gray-700"
                accept="image/*"
                required
              />
            </div>
            {photo && (
              <div className="flex items-center mt-4 sm:mt-0">
                <img
                  src={URL.createObjectURL(photo)}
                  alt="Profile Preview"
                  className="w-16 h-16 object-cover rounded-full"
                />
                <p className="ml-4 text-gray-500">{photo.name}</p>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-800"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
