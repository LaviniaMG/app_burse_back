'use client'
import React, { useState } from 'react';
import { Box, Grid, Tabs, Tab, Card, CardContent, Typography, TextField, InputAdornment, Button } from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { BookOutlined } from '@ant-design/icons';
import { openSnackbar } from '../../../api/snackbar';
import BursaExOlimpica from './BursaExOlimpica';
import BursaPerf from './BursaPerf';
import BursaSpeciala from './BursaSpeciala';
import BursaSocialaPrivata from './BursaSocialaPrivata';
import { LoadingButton } from '@mui/lab';

const ProductsPage = () => {
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [budget, setBudget] = useState('');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const loadingHandler = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);  // Simularea unui proces de încărcare
  };
  const handleInputChange = (event) => {
    const value = event.target.value;
    if (!value.match(/^\d*\.?\d*$/)) {
      openSnackbar({
        open: true,
        message: "Trebuie să introduceți numere valide!",
        variant: 'alert',
        alert: {
          color: 'error'
        }
      });
    } else {
      setBudget(value);
    }
  };

  const loadingHandlerOlympicGrant = () => {
    setLoading((prev) => ({ ...prev, olympicGrant: true }));
    setTimeout(() => {
      setLoading((prev) => ({ ...prev, olympicGrant: false }));
    }, 1000); // Delay de 1 secundă
  };
  const loadingHandlerSocial = () => {
    setLoading((prev) => ({ ...prev, social: true }));
    setTimeout(() => {
      setLoading((prev) => ({ ...prev, social: false }));
    }, 1000); // Delay de 1 secundă
  };
  let tooltipMessage = "";
  let calculationFunction = () => {};
  
  switch (value) {
    case 0:
      tooltipMessage = "Pentru a calcula bugetul pentru bursa olimpică / internațională";
      calculationFunction = loadingHandlerOlympicGrant;
      break;
    case 2:
      tooltipMessage = "Pentru a calcula bugetul pentru burse speciale";
      calculationFunction = loadingHandlerSocial;
      break;
  }
  const calculateBudget = async () => {
    const numericBudget = parseFloat(budget);
    if (isNaN(numericBudget) || numericBudget <= 0) {
      openSnackbar({
        open: true,
        message: "Introduceți un buget valid!",
        variant: 'alert',
        alert: {
          color: 'error'
        }
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/tipBursa/updatePrivateBudgetTotal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bugetTotal: numericBudget })
      });
      const result = await response.json();
      setLoading(false);
      if (response.ok) {
        openSnackbar({
          open: true,
          message: `Calculul bugetelor pentru fiecare bursă a fost alocat cu succes!`,
          variant: 'alert',
          alert: {
            color: 'success',
            variant: 'filled'
          }
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      setLoading(false);
      alert(`Eroare la calculul bugetului: ${error.message}`);
    }
  };

  

  return (
    <Box sx={{ display: 'flex' }}>
      <Card sx={{ flexGrow: 1 }}>
        <CardContent>
          <Typography  variant="h6" sx={{ mr: 2, minWidth: 120 }}>Buget din fonduri proprii</Typography>
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              placeholder="0.00"
              id="outlined-start-adornment"
              onChange={handleInputChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">LEI</InputAdornment>
              }}
              sx={{ width: 300, mr: 1, fontSize: '0.875rem' }} // Setează o lățime de 150px și dimensiunea fontului la 0.875rem
            
            />
            <LoadingButton
              loading={loading}
              variant="contained"
              color="primary"
              loadingPosition="start"
              startIcon={<CalculateIcon />}
              onClick={calculateBudget}
            >
              Calcul
            </LoadingButton>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Button onClick={() => setValue(oldValue => Math.max(0, oldValue - 1))} disabled={value === 0}>
              <ArrowBackIosIcon />
            </Button>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Burse de excelență pentru rezultate remarcabile" icon={<BookOutlined />}iconPosition="start" {...a11yProps(0)} />
              <Tab label="Burse de performanță" icon={<BookOutlined />}iconPosition="start"{...a11yProps(1)} />
              <Tab label="Burse de excelență pentru rezultate deosebite în cercetare" icon={<BookOutlined />}iconPosition="start"{...a11yProps(2)} />
              <Tab label="Bursa ''Mihail Manoilescu''" icon={<BookOutlined />}iconPosition="start"{...a11yProps(3)} />
               </Tabs>
            <Button onClick={() => setValue(oldValue => Math.min(oldValue + 1, 3))} disabled={value === 4}>
              <ArrowForwardIosIcon />
            </Button>
          </Box>
          {value === 0 && <BursaExOlimpica />}
          {value === 1 && <BursaPerf />}
          {value === 2 && <BursaSpeciala />}
          {value === 3 && <BursaSocialaPrivata />}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProductsPage;

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
};
