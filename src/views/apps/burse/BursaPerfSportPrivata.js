import { useState } from 'react';
import CalculateIcon from '@mui/icons-material/Calculate';
import { Typography, Box, TextField, InputAdornment, Button, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import DropzonePage from '../../forms/plugins/dropzone';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';

const BursaPerfSportPrivata = () => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const loadingHandler = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000); // Delay de 1 secundă
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleStartDateChange = (newValue) => {
    setStartDate(newValue);
  };

  const handleEndDateChange = (newValue) => {
    setEndDate(newValue);
  };

  const handleSubmit = () => {
    console.log({
      cuantum: value,
      dataStart: startDate,
      dataFinal: endDate
    });
    // Aici poți adăuga logica pentru a apela backend-ul
  };

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
    loading={loading.home}
    variant="contained"
    color="primary"
    loadingPosition="start"
    startIcon={<CalculateIcon />}
    onClick={() => loadingHandler()}
    sx={{ mt: 2 }}
  >
    Calcul
  </LoadingButton>
      </Box>
    </LocalizationProvider>
  );
};

export default BursaPerfSportPrivata;
