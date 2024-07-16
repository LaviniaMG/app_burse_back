import { useState } from 'react';
import CalculateIcon from '@mui/icons-material/Calculate';
import { Typography, Box, TextField, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import DropzonePage from '../../forms/plugins/dropzone';
import { openSnackbar } from '../../../api/snackbar';
const BursaRezultateDeob = () => {
  const [loading, setLoading] = useState({ home: false });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [cuantum, setCuantum] = useState('');

  const handleCuantumChange = (event) => {
    setCuantum(event.target.value);
  };
  const updateScholarshipQuantities = async () => {
    setLoading(true);
    console.log("Starting update process..."); 
    try {
      const response = await fetch(`http://localhost:8080/api/tipBursa/update/${2}`, {
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
        open: true,
        message: `Cuantumul și numărul de bursieri au fost actualizați: ${result.message}`,
        variant: 'alert',
        alert: {
          color: 'success'
        }
      });
      calculateNrBursieri(); // Procedează la calculul bursierilor
    } catch (error) {
      openSnackbar({
        open: true,
        message: `Eroare la actualizarea cuantumului: ${error.message}`,
        variant: 'alert',
        alert: {
          color: 'success'
        }
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
      const response = await fetch(`http://localhost:8080/uploads-students/${2}`, {
        method: 'POST',
        body: formData,
      });
      console.log(formData)
      const result = await response.json();
      openSnackbar({
        open: true,
        message: 'Calculul a fost realizat cu succes: ' + result.message,
        variant: 'alert',
        alert: {
          color: 'success'
        }
      });
      console.log( result.message)
    } catch (error) {
      openSnackbar({
        open: true,
        message: 'Eroare la calculul bursei: ' + error.message,
        variant: 'alert',
        alert: {
          color: 'success'
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


  return (
    <>
      <Box sx={{ p: 2, maxWidth: 300 }}>
        <Typography variant="h6" gutterBottom>
          Suma alocată fiecărei burse
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="0.00"
          id="outlined-start-adornment"
          onChange={handleCuantumChange}
          value={cuantum}
          InputProps={{
            startAdornment: <InputAdornment position="start">LEI</InputAdornment>
          }}
          sx={{ my: 2 }}
        />
      </Box>
      <Box sx={{ my: 2 }}>
        <DropzonePage onFileUpload={setUploadedFile}/>
      </Box>
      <LoadingButton
        loading={loading.home}
        variant="contained"
        color="primary"
        loadingPosition="start"
        startIcon={<CalculateIcon />}
        onClick={handleCalculateBursa}
        sx={{ mt: 2 }}
      >
        Calcul
      </LoadingButton>
    </>
  );
};

export default BursaRezultateDeob;
