import React, { useContext, useState, useEffect } from 'react';
import { 
  Stepper, 
  Step, 
  StepLabel, 
  Button, 
  TextField, 
  Box, 
  Typography, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormControl, 
  FormHelperText, 
  Backdrop, 
  CircularProgress,
  Paper,
  Grid,
  Avatar
} from '@mui/material';
import { 
  Title as TitleIcon,
  Description as DescriptionIcon,
  Category as CategoryIcon,
  Apartment as DepartmentIcon,
  AddPhotoAlternate as PhotoIcon,
  LocationOn as LocationIcon,
  Check as CheckIcon,
  ArrowBack as BackIcon,
  ArrowForward as NextIcon,
  Send as SubmitIcon,
  Email,
  ConstructionOutlined
} from '@mui/icons-material';
import MapWithMarker from '../../../utilities/MapWithMarker';
import axios from 'axios';
import { createReport, getUserIdByEmail } from '../../../firebase/citizen/reportFuncs';
import { AppContext } from '../../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { getUserData } from '../../../firebase/citizen/authFuncs';
import { sendNotificationToUser } from '../../../firebase/admin/manageUserFuncs';

const categoryDepartmentMap = {
  'water_issues': 'water_supply_department',
  'electrical_issues': 'electricity_board',
  'waste_management': 'municipal_department',
  'road_problems': 'public_works_department',
  'traffic_problems': 'traffic_control_department',
  'public_parks': 'parks_department'
};

const steps = [
  { label: 'Issue Details', icon: <DescriptionIcon /> },
  { label: 'Upload Photos', icon: <PhotoIcon /> },
  { label: 'Add Location', icon: <LocationIcon /> },
  { label: 'Confirmation', icon: <CheckIcon /> }
];

const IssueForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [department, setDepartment] = useState('');
  const [photos, setPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { setSnackbar } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (category && categoryDepartmentMap[category]) {
      setDepartment(categoryDepartmentMap[category]);
    }
  }, [category]);

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 0) {
      if (!title.trim()) newErrors.title = 'Title is required';
      if (!description.trim()) newErrors.description = 'Description is required';
      if (!category) newErrors.category = 'Category is required';
      if (!department) newErrors.department = 'Department is required';
    } else if (step === 1) {
      if (photos.length === 0) newErrors.photos = 'At least one photo is required';
    } else if (step === 2) {
      if (!position) newErrors.position = 'Please select a location on the map';
      if (!address.trim()) newErrors.address = 'Address is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + photos.length > 5) {
      setSnackbar({ open: true, severity: "error", message: "You can upload maximum 5 photos" });
      return;
    }
    
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPhotos((prev) => [...prev, ...files]);
    setPhotoPreviews((prev) => [...prev, ...newPreviews]);
    setErrors(prev => ({ ...prev, photos: undefined }));
  };

  const removePhoto = (index) => {
    const newPhotos = [...photos];
    const newPreviews = [...photoPreviews];
    
    newPhotos.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setPhotos(newPhotos);
    setPhotoPreviews(newPreviews);
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
      return response.data.secure_url;
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(activeStep)) return;
    
    setLoading(true);

    try {
      const photoUrls = await Promise.all(
        photos.map(async (photo) => {
          return await uploadImageToCloudinary(photo);
        })
      );

      const userData = await getUserData(localStorage.getItem("uid"));
      const response = await createReport(
        title,
        description,
        category,
        department,
        address,
        photoUrls,
        position,
        userData
      );
      
      setSnackbar({ open: true, severity: "success", message: "Issue reported successfully!" });
      resetForm();
      navigate("/dashboard");
      
      const adminUserID = await getUserIdByEmail("admin@gmail.com");
       const notification = {
        title: `New Report(${title})from user"+localStorage.getItem("username")`,
        message: `A new Report(${title}) from the user with email id: ${localStorage.getItem("useremail")}. Kindly consider this and hoping a fast clearance regarding this problem..`,
        timestamp:new Date(),
        department:"A New Report by Community Person",
        isRead: false,
      };

      
      try{
        const resNotify = await sendNotificationToUser(adminUserID,notification);
        setSnackbar({open:true,severity:"success",message:"Notification sent succesfully to the admin.."})
      }
      catch(error){
        console.log("error OCcured while sending notficiaton to the amdin")
      }


    } catch (error) {
      setSnackbar({ open: true, severity: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setAddress("");
    setDepartment("");
    setCategory("");
    setPhotos([]);
    setPhotoPreviews([]);
    setDescription("");
    setPosition(null);
    setActiveStep(0);
    setErrors({});
  };

  const renderIssueDetails = () => (
    <Box component="form" noValidate autoComplete="off">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setErrors(prev => ({ ...prev, title: undefined }));
            }}
            fullWidth
            required
            error={!!errors.title}
            helperText={errors.title}
            InputProps={{
              startAdornment: (
                <TitleIcon color="action" sx={{ mr: 1 }} />
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setErrors(prev => ({ ...prev, description: undefined }));
            }}
            fullWidth
            multiline
            rows={4}
            required
            error={!!errors.description}
            helperText={errors.description}
            InputProps={{
              startAdornment: (
                <DescriptionIcon color="action" sx={{ mr: 1, alignSelf: 'flex-start', mt: 1 }} />
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required error={!!errors.category}>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setErrors(prev => ({ ...prev, category: undefined }));
              }}
              label="Category"
              startAdornment={<CategoryIcon color="action" sx={{ mr: 1 }} />}
            >
              <MenuItem value="water_issues">Water Issues</MenuItem>
              <MenuItem value="electrical_issues">Electrical Issues</MenuItem>
              <MenuItem value="waste_management">Waste Management</MenuItem>
              <MenuItem value="road_problems">Road Problems</MenuItem>
              <MenuItem value="traffic_problems">Traffic Problems</MenuItem>
              <MenuItem value="public_parks">Public Parks</MenuItem>
            </Select>
            {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required error={!!errors.department}>
            <InputLabel>Department</InputLabel>
            <Select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setErrors(prev => ({ ...prev, department: undefined }));
              }}
              label="Department"
              startAdornment={<DepartmentIcon color="action" sx={{ mr: 1 }} />}
            >
              <MenuItem value="water_supply_department">Water Supply Department</MenuItem>
              <MenuItem value="electricity_board">Electricity Board</MenuItem>
              <MenuItem value="municipal_department">Municipal Department</MenuItem>
              <MenuItem value="public_works_department">Public Works Department</MenuItem>
              <MenuItem value="traffic_control_department">Traffic Control Department</MenuItem>
              <MenuItem value="parks_department">Parks and Recreation Department</MenuItem>
            </Select>
            {errors.department && <FormHelperText>{errors.department}</FormHelperText>}
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );

  const renderPhotoUpload = () => (
    <Box sx={{ minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body1" color="error" gutterBottom>
          {errors.photos}
        </Typography>
        
        <Button
          variant="contained"
          component="label"
          startIcon={<PhotoIcon />}
          sx={{ mb: 2 }}
        >
          Upload Photos
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoChange}
            hidden
          />
        </Button>
        
        <Typography variant="caption" display="block" gutterBottom>
          Maximum 5 photos allowed ({photos.length}/5 uploaded)
        </Typography>
        
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {photoPreviews.map((preview, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Paper elevation={3} sx={{ position: 'relative' }}>
                <img
                  src={preview}
                  alt={`Preview ${index}`}
                  style={{ 
                    width: '100%', 
                    height: '150px', 
                    objectFit: 'cover',
                    borderRadius: '4px'
                  }}
                />
                <Button
                  size="small"
                  color="error"
                  onClick={() => removePhoto(index)}
                  sx={{ 
                    position: 'absolute', 
                    top: 4, 
                    right: 4,
                    minWidth: 'auto',
                    padding: '4px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.8)'
                  }}
                >
                  ×
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );

  const renderLocationInput = () => (
    <Box sx={{ minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="body1" color="error" gutterBottom>
        {errors.position || errors.address}
      </Typography>
      <Box sx={{ flexGrow: 1 }}>
        <MapWithMarker 
          position={position} 
          setPosition={(pos) => {
            setPosition(pos);
            setErrors(prev => ({ ...prev, position: undefined }));
          }} 
          address={address} 
          setAddress={(addr) => {
            setAddress(addr);
            setErrors(prev => ({ ...prev, address: undefined }));
          }} 
        />
      </Box>
      <TextField
        label="Address"
        value={address}
        onChange={(e) => {
          setAddress(e.target.value);
          setErrors(prev => ({ ...prev, address: undefined }));
        }}
        fullWidth
        required
        error={!!errors.address}
        helperText={errors.address}
        sx={{ mt: 2 }}
        InputProps={{
          startAdornment: (
            <LocationIcon color="action" sx={{ mr: 1 }} />
          ),
        }}
      />
    </Box>
  );

  const renderConfirmation = () => (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom align="center" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckIcon color="primary" sx={{ mr: 1 }} />
          Confirmation Letter
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2">From:</Typography>
          <Typography variant="body2">Public Issue Reporting System</Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2">To:</Typography>
          <Typography variant="body2">{department}</Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2">Date:</Typography>
          <Typography variant="body2">{new Date().toLocaleDateString()}</Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2">Subject:</Typography>
          <Typography variant="body2">Report of an Issue in the {category.replace('_', ' ')} Category</Typography>
        </Box>
        
        <Typography variant="body1" paragraph>
          Dear Sir/Madam,
        </Typography>
        
        <Typography variant="body1" paragraph>
          I would like to bring to your attention an issue that requires immediate action. Below are the details:
        </Typography>
        
        <Box component="ul" sx={{ pl: 4, mb: 3 }}>
          <li><strong>Title of Issue:</strong> {title}</li>
          <li><strong>Description:</strong> {description}</li>
          <li><strong>Category:</strong> {category.replace('_', ' ')}</li>
          <li><strong>Department:</strong> {department.replace('_', ' ')}</li>
          <li><strong>Location:</strong> {address}</li>
        </Box>
        
        {photoPreviews.length > 0 && (
          <>
            <Typography variant="body1" paragraph>
              Attached below are the photos relevant to the issue:
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {photoPreviews.map((preview, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <Avatar 
                    variant="rounded" 
                    src={preview} 
                    sx={{ width: '100%', height: '100px' }} 
                  />
                </Grid>
              ))}
            </Grid>
          </>
        )}
        
        <Typography variant="body1" paragraph>
          I kindly request your department to look into this matter at the earliest and take necessary action.
        </Typography>
        
        <Typography variant="body1" paragraph>
          Thank you for your cooperation.
        </Typography>
        
        <Typography variant="body1" paragraph>
          Sincerely, <br />
          Public Issue Reporting System
        </Typography>
      </Paper>
    </Box>
  );

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Submitting your report...
        </Typography>
      </Backdrop>

      <Box sx={{ 
        width: '100%', 
        maxWidth: { xs: '100%', md: '90vw' }, 
        margin: 'auto', 
        p: { xs: 1, sm: 2, md: 3 },
        opacity: loading ? 0.5 : 1 
      }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ mb: 3 }}>
          Report An Issue
        </Typography>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepLabel StepIconComponent={() => (
                <Avatar sx={{ bgcolor: activeStep >= index ? 'primary.main' : 'grey.400' }}>
                  {step.icon}
                </Avatar>
              )}>
                <Typography variant="caption" sx={{ display: { xs: 'none', sm: 'block' } }}>
                  {step.label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
          {activeStep === 0 && renderIssueDetails()}
          {activeStep === 1 && renderPhotoUpload()}
          {activeStep === 2 && renderLocationInput()}
          {activeStep === 3 && renderConfirmation()}
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={activeStep === 0 || loading}
            startIcon={<BackIcon />}
            sx={{ minWidth: '120px' }}
          >
            Back
          </Button>

          <Button
            variant="contained"
            onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
            disabled={loading}
            endIcon={activeStep === steps.length - 1 ? <SubmitIcon /> : <NextIcon />}
            sx={{ minWidth: '120px' }}
          >
            {activeStep === steps.length - 1 ? "Submit" : 'Next'}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default IssueForm;