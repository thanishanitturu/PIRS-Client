import React, { useContext, useState,useEffect } from 'react';
import { Stepper, Step, StepLabel, Button, TextField, Box, Typography, InputLabel, Select, MenuItem, FormControl, FormHelperText, Menu } from '@mui/material';
import MapWithMarker from '../../../utilities/MapWithMarker';
import axios from 'axios';
import { createReport } from '../../../firebase/citizen/reportFuncs';
import { AppContext } from '../../../context/AppContext';
import {FaSpinner} from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { getUserData } from '../../../firebase/citizen/authFuncs';
const categoryDepartmentMap = {
  'water issues': 'water_supply_department',
  'electrical issues': 'electricity_board',
  'waste_management': 'municipal_department',
  'road problems': 'public_works_department',
  'Traffic Problems': 'traffic_control_department',
  'public parks': 'parks_department'
};

const IssueForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [department, setDepartment] = useState('');
  const [photos, setPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [position, setPosition] = useState(null);
   const [address, setAddress] = useState('Fetching address...');
   const[loading,setLoading] = useState(false);
  const{setSnackbar} = useContext(AppContext);
  const steps = ['Issue Details', 'Upload Photos', 'Add Location', 'Confirmation'];
  const navigate = useNavigate();

  useEffect(() => {
    if (category && categoryDepartmentMap[category]) {
      setDepartment(categoryDepartmentMap[category]);
    }
  }, [category]);

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPhotos((prev) => [...prev, ...files]);
    setPhotoPreviews((prev) => [...prev, ...newPreviews]);
  };


  const uploadImageToCloudinary = async (currphoto) => {
    const uploadData = new FormData();
    uploadData.append("file", currphoto);
    uploadData.append("upload_preset", "unsigned_upload");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dkzzeiqhh/image/upload",
        uploadData
      );
      console.log(response.data.secure_url);
      return response.data.secure_url;
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    const photoUrls = await Promise.all(
      photos.map(async (photo) => {
        return await uploadImageToCloudinary(photo);
      })
    );


     try {
        const userData = await getUserData(localStorage.getItem("uid"));
        const response = await createReport(title,description,category,department,address,photoUrls,position,userData);
        console.log(response);
        setSnackbar({open:true,severity:"success",message:response});
        setTitle("");
        setAddress("");
        setDepartment("");
        setCategory("");
        setPhotos([]);
        setPhotoPreviews([]);
        setDescription("");
        navigate("/dashboard");
     } catch (error) {
        setSnackbar({open:true,severity:"error",message:error.message});
     }
  };

  const renderIssueDetails = () => (
    <Box>
    <TextField
      label="Title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      fullWidth
      required
      sx={{ mb: 2 }}
    />
    <TextField
      label="Description"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      fullWidth
      multiline
      rows={4}
      required
      sx={{ mb: 2 }}
    />
    <FormControl fullWidth required sx={{ mb: 2 }}>
      <InputLabel>Category</InputLabel>
      <Select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        label="Category"
      >
        <MenuItem value="water_issues">Water Issues</MenuItem>
        <MenuItem value="electrical_issues">Electrical Issues</MenuItem>
        <MenuItem value="waste_management">Waste Management</MenuItem>
        <MenuItem value="road_problems">Road Problems</MenuItem>
        <MenuItem value="traffic_problems">Traffic Problems</MenuItem>
        <MenuItem value="public_parks">Public Parks</MenuItem>
      </Select>
      <FormHelperText>Select the category of the issue</FormHelperText>
    </FormControl>
    <FormControl fullWidth required sx={{ mb: 2 }}>
      <InputLabel>Department</InputLabel>
      <Select
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        label="Department"
      >
        <MenuItem value="water_supply_department">Water Supply Department</MenuItem>
        <MenuItem value="electricity_board">Electricity Board</MenuItem>
        <MenuItem value="municipal_department">Municipal Department/Corporation</MenuItem>
        <MenuItem value="public_works_department">Public Works Department</MenuItem>
        <MenuItem value="traffic_control_department">Traffic Control Department</MenuItem>
        <MenuItem value="parks_department">Parks and Recreation Department</MenuItem>
      </Select>
      <FormHelperText>Department will be auto-selected based on category</FormHelperText>
    </FormControl>
  </Box>
  );

  const renderPhotoUpload = () => (
    <Box>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handlePhotoChange}
        style={{ marginBottom: '10px' }}
      />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
        {photoPreviews.map((preview, index) => (
          <img
            key={index}
            src={preview}
            alt={`Preview ${index}`}
            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
          />
        ))}
      </Box>
    </Box>
  );

  const renderLocationInput = () => (
    <MapWithMarker position={position} setPosition={setPosition} address={address} setAddress={setAddress}/>
  );

  const renderConfirmation = () => (
    <Box>
    <Typography variant="h5" gutterBottom align='center' >
      Confirmation Letter
    </Typography>
    <Typography variant="body1" paragraph>
      <strong>From:</strong> <br />
      [Your Organization's Name] <br />
    
    </Typography>
    <Typography variant="body1" paragraph>
      <strong>To:</strong> <br />
      {department} <br />
    </Typography>
    <Typography variant="body1" paragraph>
      <strong>Date:</strong> {new Date().toLocaleDateString()}
    </Typography>
    <Typography variant="body1" paragraph>
      <strong>Subject:</strong> Report of an Issue in the {category} Category
    </Typography>
    <Typography variant="body1" paragraph>
      Dear Sir/Madam,
    </Typography>
    <Typography variant="body1" paragraph>
      I would like to bring to your attention an issue that requires immediate action. Below are the details:
    </Typography>
    <Typography variant="body1" paragraph>
      <strong>Title of Issue:</strong> {title} <br />
      <strong>Description:</strong> {description} <br />
      <strong>Category:</strong> {category} <br />
      <strong>Department:</strong> {department} <br />
      <strong>Location:</strong> {address} <br />
    </Typography>
    <Typography variant="body1" paragraph>
      Attached below are the photos relevant to the issue:
    </Typography>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
      {photoPreviews.map((preview, index) => (
        <img
          key={index}
          src={preview}
          alt={`Confirmation Preview ${index}`}
          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
        />
      ))}
    </Box>
    <Typography variant="body1" paragraph>
      I kindly request your department to look into this matter at the earliest and take necessary action.
    </Typography>
    <Typography variant="body1" paragraph>
      Thank you for your cooperation.
    </Typography>
    <Typography variant="body1" paragraph>
      Sincerely, <br />
      [Your Name or Organization's Representative] <br />
    </Typography>
  </Box>
  
  );

  return (
    <Box sx={{ width: '100%', maxWidth:{xs:'100vw',md:'90vw'}, margin: 'auto', padding: '20px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Report An Issue
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ paddingTop: '20px' }}>
        {activeStep === 0 && renderIssueDetails()}
        {activeStep === 1 && renderPhotoUpload()}
        {activeStep === 2 && renderLocationInput()}
        {activeStep === 3 && renderConfirmation()}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <Button
          variant="outlined"
          onClick={handleBack}
          disabled={activeStep === 0}
        >
          Back
        </Button>

        <Button
          variant="contained"
          onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
        >
          {activeStep === steps.length - 1 ?"Submit" : 'Next'}
        </Button>
      </Box>
    </Box>
  );
};

export default IssueForm;
