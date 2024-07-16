import React, { useState } from 'react';
import { Box, Button, Stepper, Step, StepLabel, StepContent, Typography, TextField, InputAdornment, Tooltip } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import CalculateIcon from '@mui/icons-material/Calculate';
import DropzonePage from '../../../views/forms/plugins/dropzone';
import { openSnackbar } from '../../../api/snackbar';

const ScholarshipStepper = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState({ home: false, olympicGrant: false });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [cuantum, setCuantum] = useState('');

  const handleCuantumChange = (event) => {
    setCuantum(event.target.value);
  };

  const tooltipMessage = "Pentru a calcula bugetul pentru bursa olimpică / internațională";

  const updateScholarshipQuantities = async () => {
    setLoading(true);
    console.log("Starting update process..."); 
    try {
      const response = await fetch(`http://localhost:8080/api/tipBursa/update/${1}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cuantum: parseFloat(cuantum)
        })
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      openSnackbar({
        message: `Cuantumul și numărul de bursieri au fost actualizați: ${result.message}`,
        variant: 'success'
      });
      calculateNrBursieri(); // Procedează la calculul bursierilor
    } catch (error) {
      openSnackbar({
        message: `Eroare la actualizarea cuantumului: ${error.message}`,
        variant: 'error'
      });
      console.log(error.message)
      setLoading(false);
    }
  };


  const calculateNrBursieri = async () => {
    setLoading(true);
    const formData = new FormData();

    if (uploadedFile) {
        formData.append('file', uploadedFile);
      }

    try {
      const response = await fetch(`http://localhost:8080/uploads-students/${1}`, {
        method: 'POST',
        body: formData,
      });
      console.log(formData)
      const result = await response.json();
      openSnackbar({
        open: true,
        message: 'Calculul a fost realizat cu succes: ',
        variant: 'alert',
        alert: {
          color: 'success'
        }
      });
      console.log( result.message)
    } catch (error) {
      openSnackbar({
        open: true,
        message:  'Eroare la calculul bursei: ' + error.message,
        variant: 'alert',
        alert: {
          color: 'error'
        }
      });
      console.log(error.message)
    }
    setLoading(false);
  };

  const handleCalculateBursa = () => {
    updateScholarshipQuantities()
      .then(calculateNrBursieri)
      .catch(error => console.error('Eroare în procesarea datelor', error));
  };
  
  const steps = [
    {
      label: 'Pasul 1',
      description: (
        <Box>
          <Typography variant="h6" sx={{ mr: 2, minWidth: 120 }}>
            Buget primit de la stat
          </Typography>
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              variant="outlined"
              placeholder="0.00"
              id="outlined-start-adornment"
              value={cuantum}
              onChange={handleCuantumChange}
             
              InputProps={{
                startAdornment: <InputAdornment position="start">LEI</InputAdornment>
              }}
              sx={{ width: 300, mr: 1, fontSize: '0.875rem' }}
            />
            {/* <Tooltip title="Pentru a calcula cuantumul pentru bursa de excelență olimpică" enterDelay={500} leaveDelay={200}>
              <LoadingButton
                loading={loading.home}
                variant="contained"
                loadingPosition="start"
                startIcon={<CalculateIcon />}
               
                onClick={calculateBudget}
              >
                Calcul
              </LoadingButton>
            </Tooltip> */}
          </Box>
        </Box>
      )
    },
    {
      label: 'Pasul 2',
      description: <DropzonePage onFileUpload={setUploadedFile}></DropzonePage>
    },
    {
      label: 'Pasul 3',
      description: (
        <Tooltip title={tooltipMessage} enterDelay={500} leaveDelay={200}>
          <span>
            <LoadingButton
              loading={loading.olympicGrant}
              variant="contained"
              loadingPosition="start"
              startIcon={<CalculateIcon />}
              onClick={handleCalculateBursa}
            >
              Calcul bursa
            </LoadingButton>
          </span>
        </Tooltip>
        
      )
    },
    {
      label: 'Pasul 4',
      description: (
        <div>
          <a href="/apps/studenti/list">studenti calculati</a>
        </div>
      )
    }
 ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
            <StepContent>
              <Typography>{step.description}</Typography>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 1, mr: 1 }}
                >
                  {index === steps.length - 1 ? 'Terminați' : 'Continuați'}
                </Button>
                <Button
                  disabled={index === 0}
                  onClick={handleBack}
                  sx={{ mt: 1, mr: 1 }}
                >
                  Înapoi
                </Button>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Box sx={{ mt: 2 }}>
          <Typography>Toți pașii au fost parcurși cu succes!</Typography>
          <Button onClick={handleReset} sx={{ mt: 1 }}>
            De la capăt
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ScholarshipStepper;
