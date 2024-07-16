'use client';
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Select,
  Typography
} from '@mui/material';

// project import
import DropZone from '../../views/forms/plugins/dropzone';
import Page from '../../components/Page';
import { Stepper, Step, StepLabel, StepContent, FormControl, InputLabel } from '@mui/material';
import { openSnackbar } from '../../api/snackbar';

const WidgetChart = () => {
  const [selectedScholarship, setSelectedScholarship] = useState('');
  const [selectedScholarshipLabel, setSelectedScholarshipLabel] = useState('');
  const [scholarships, setScholarships] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    fetchScholarships();
  }, []);

  const handleScholarshipChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedScholarship(selectedValue);
    const scholarshipLabel = scholarships.find(scholarship => scholarship.value === selectedValue)?.label || 'Unknown';
    setSelectedScholarshipLabel(scholarshipLabel);
    openSnackbar({
      open: true,
      message: `Ați selectat bursa: ${scholarshipLabel}`,
      variant: 'alert',
      alert: {
        color: 'success',
        variant: 'filled'
      }
    });
  };

  const fetchScholarships = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/tipBursa');
      const data = await response.json();
      const allowedIds = [4, 6, 7, 8, 9, 10, 11];
      const filteredData = data.filter(item => allowedIds.includes(item.idBursa));
      const formattedData = filteredData.map(item => ({
        value: item.idBursa.toString(),
        label: item.denumire
      }));
      setScholarships(formattedData);
    } catch (error) {
      console.error("Eroare la fetch pentru tipBursa", error);
      openSnackbar({
        open: true,
        message: "Eroare la încărcarea burselor!",
        variant: 'alert',
        alert: {
          color: 'error'
        }
      });
    }
  };

  const handleFileUpload = (file) => {
    if (file instanceof File) {
      setUploadedFile(file);
      console.log("File uploaded successfully");
    } else {
      console.error("Invalid file");
    }
  };
  
  const steps = [
    {
      label: 'Pasul 1',
      description: (
        <Grid>
          <Typography>Selectați o bursă din cele de mai jos:</Typography>
          <FormControl sx={{ my: 4, width: '50%' }}>
            <InputLabel>Bursă</InputLabel>
            <Select value={selectedScholarship} label="Bursă" onChange={handleScholarshipChange}>
              {scholarships.map((scholarship) => (
                <MenuItem key={scholarship.value} value={scholarship.value}>
                  {scholarship.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      ),
    },
    {
      label: 'Pasul 2',
      description: <DropZone onFileUpload={handleFileUpload} />
    },
    {
      label: 'Pasul 3',
      description: 'Sunteți sigur că vreți să aplicați?'
    },
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = async () => {
    const endDate = await fetchScholarshipEndDate(selectedScholarship);
    const currentDate = new Date();
    const endDateDate = new Date(endDate);

    if (endDateDate > currentDate) {
      
      // Prepare formData for submission
      const formData = new FormData();
      const idUtilizator2= 3;
      formData.append('idBursa', selectedScholarship);
      formData.append('denumireBursa', selectedScholarshipLabel); // Add the scholarship name
      formData.append('idUtilizator',idUtilizator2);
      formData.append('file', uploadedFile);

      // Send formData to the server
      try {
        const response = await fetch('http://localhost:8080/api/solicitari', {
          method: 'POST',
          body: formData
        });
        if (response.ok) {
          openSnackbar({
            open: true,
            message: 'Formularul a fost trimis cu succes',
            variant: 'success',
          });
          setActiveStep(0);
        } else {
          throw new Error('Failed to send the form');
        }
      } catch (error) {
        console.error('Eroare la trimiterea formularului', error);
        openSnackbar({
          open: true,
          message: 'Eroare la trimiterea formularului',
          variant: 'error',
        });
      }
    } else {
      openSnackbar({
        open: true,
        message: 'Bursa selectată nu mai este activă pentru a depune cereri!',
        variant: 'alert',
        alert: {
          color: 'error'
        }
      });
      
      setActiveStep(0);
    }
  };

  const fetchScholarshipEndDate = async (scholarshipId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/tipBursa/${scholarshipId}`);
      const data = await response.json();
      return data.dataFinal; // Assume the final date is returned in this field
    } catch (error) {
      console.error("Eroare la fetch pentru tipBursa", error);
      return null;
    }
  };

  return (
    <Page>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel optional={index === 2 ? <Typography variant="caption">Ultimul pas</Typography> : null}>{step.label}</StepLabel>
            <StepContent>
              <Typography>{step.description}</Typography>
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" onClick={handleNext} sx={{ mt: 1, mr: 1 }}>
                  {index === steps.length - 1 ? 'Da' : 'Continuați'}
                </Button>
                <Button disabled={index === 0} onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                 Înapoi
                </Button>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Box sx={{ pt: 2 }}>
          <Typography sx={{ color: 'success.main' }}>Ați terminat toți pașii! Felicitări!</Typography>
          <Button variant="contained" color="error" onClick={handleReset} sx={{ mt: 2, mr: 1 }}>
            De la capăt
          </Button>
        </Box>
      )}
    </Page>
  );
};

export default WidgetChart;
