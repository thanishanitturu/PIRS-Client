import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Button, TextField, Box, Typography, InputLabel, Select, MenuItem, FormControl, FormHelperText } from '@mui/material';
import MapWithMarker from '../../../utilities/MapWithMarker';

const IssueForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [department, setDepartment] = useState('');
  const [photos, setPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  // const [location, setLocation] = useState('');
  const [position, setPosition] = useState(null);
   const [address, setAddress] = useState('Fetching address...');

  const steps = ['Issue Details', 'Upload Photos', 'Add Location', 'Confirmation'];

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPhotos((prev) => [...prev, ...files]);
    setPhotoPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = () => {
    const issueData = {
      title,
      description,
      category,
      department,
      location,
      photos,
    };
    console.log('Submitted Issue Data:', issueData);
    alert('Issue Submitted Successfully!');
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
          <MenuItem value="roads">Roads</MenuItem>
          <MenuItem value="lighting">Lighting</MenuItem>
          <MenuItem value="waste_management">Waste Management</MenuItem>
          <MenuItem value="water_supply">Water Supply</MenuItem>
          <MenuItem value="other">Other</MenuItem>
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
          <MenuItem value="municipal_corp">Municipal Corporation</MenuItem>
          <MenuItem value="electricity_board">Electricity Board</MenuItem>
          <MenuItem value="water_board">Water Board</MenuItem>
        </Select>
        <FormHelperText>Select the responsible department</FormHelperText>
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
    // <Box>
    //   <TextField
    //     label="Location"
    //     value={location}
    //     onChange={(e) => setLocation(e.target.value)}
    //     fullWidth
    //     required
    //     sx={{ mb: 2 }}
    //   />
    //   <Button variant="outlined" onClick={() => setLocation('Fetched Location')}>Add Location</Button>
    // </Box>
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
      {/* [Your Address] <br /> */}
      {/* [City, State, ZIP Code] <br /> */}
      {/* {address} */}
    </Typography>
    <Typography variant="body1" paragraph>
      <strong>To:</strong> <br />
      {/* Concerned Department <br /> */}
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
          {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
        </Button>
      </Box>
    </Box>
  );
};

export default IssueForm;
