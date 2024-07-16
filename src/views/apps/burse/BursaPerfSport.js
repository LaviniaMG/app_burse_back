import { useState, useEffect } from 'react';
import { Typography, Box, TextField, InputAdornment, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { openSnackbar } from '../../../api/snackbar';
import CalculateIcon from '@mui/icons-material/Calculate';
import SearchIcon from '@mui/icons-material/Search';
import dayjs from 'dayjs';
const BursaPerfSport = () => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [buget, setBuget] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);

  const [dataFinal, setDataFinal] = useState(null);
  useEffect(() => {
    const fetchBuget = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/tipBursa/7'); // Presupunem că id-ul bursăi este 4
        const data = await response.json();
        setBuget(data.buget || 0);
       
      } catch (error) {
        console.error('Failed to fetch budget:', error);
      }
    };

    fetchBuget();
  }, []);
  useEffect(() => {
    const fetchDataFinal = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/tipBursa/7');
        const data = await response.json();
        setDataFinal(dayjs(data.dataFinal));
      } catch (error) {
        console.error('Failed to fetch dataFinal:', error);
      }
    };

    fetchDataFinal();
  }, []);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleStartDateChange = (newValue) => {
    setStartDate(newValue);
  };

  const handleEndDateChange = (newValue) => {
    setEndDate(newValue);
  };

  const handleSubmit = async () => {
    setLoading(true); // Start loading animation

    const bursaData = {
      cuantum: parseFloat(value),
      buget: buget, // Bugetul dinamic
      dataStart: startDate?.format("YYYY-MM-DD"),
      dataFinal: endDate?.format("YYYY-MM-DD")
    };

    try {
      const response = await fetch('http://localhost:8080/api/tipBursa/7', { // Presupunem că id-ul bursăi este 4
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bursaData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Eroare necunoscută');
      }

      openSnackbar({
        open: true,
        message: `Tipul de bursă a fost actualizat cu succes.`,
        variant: 'alert',
        alert: {
          color: 'success',
          variant: 'filled'
        }
      });
    } catch (error) {
      openSnackbar({
        open: true,
        message: `Eroare la actualizarea bursei: ${error.message}`,
        variant: 'alert',
        alert: {
          color: 'error',
          variant: 'filled'
        }
      });
    } finally {
      setLoading(false);
    }
  };
  const handleIdentifyStudents = async () => {
    setSearchLoading(true); // Start loading animation for search

    try {
      const response = await fetch('http://localhost:8080/api/concurs/sportiva', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Eroare necunoscută');
      }

      openSnackbar({
        open: true,
        message: `Solicitările au fost actualizate cu succes.`,
        variant: 'alert',
        alert: {
          color: 'success',
          variant: 'filled'
        }
      });
    } catch (error) {
      openSnackbar({
        open: true,
        message: `Eroare la actualizarea solicitărilor: ${error.message}`,
        variant: 'alert',
        alert: {
          color: 'error',
          variant: 'filled'
        }
      });
    } finally {
      setSearchLoading(false);
    }
  };
  const isIdentifyButtonDisabled = !dataFinal || dataFinal.isAfter(dayjs());

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 2, maxWidth: 600, mx: "auto" }}>
        <Typography variant="h6" gutterBottom>
          Suma alocată fiecărei burse
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="0.00"
          id="outlined-start-adornment"
          value={value}
          onChange={handleChange}
          InputProps={{
            startAdornment: <InputAdornment position="start">LEI</InputAdornment>
          }}
          sx={{ my: 2 }}
        />
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <DesktopDatePicker
              label="Data de început"
              inputFormat="DD/MM/YYYY"
              value={startDate}
              onChange={handleStartDateChange}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={6}>
            <DesktopDatePicker
              label="Data de sfârșit"
              inputFormat="DD/MM/YYYY"
              value={endDate}
              onChange={handleEndDateChange}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
        </Grid>
        <LoadingButton
          loading={loading}
          variant="contained"
          color="primary"
          loadingPosition="start"
          startIcon={<CalculateIcon />}
          onClick={handleSubmit}
          sx={{ mt: 2 }}
        >
          Calcul
        </LoadingButton>
        <Typography variant='h5'sx={{mt: 2 }}>Se poate accesa doar după ce s-a finalizat perioada de încărcare a cererilor.</Typography>
        <LoadingButton
          loading={searchLoading}
          variant="contained"
          color="primary"
          loadingPosition="start"
          startIcon={<SearchIcon />}
       onClick={handleIdentifyStudents}
          sx={{ mt: 2 }}
        //  disabled={isIdentifyButtonDisabled}
        >
          Identifică Studenții Eligibili
        </LoadingButton>
      </Box>
    </LocalizationProvider>
  );
};

export default BursaPerfSport;
