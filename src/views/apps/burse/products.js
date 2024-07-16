'use client';

import {useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

import Tooltip from '@mui/material/Tooltip';
// project import
import CalculateIcon from '@mui/icons-material/Calculate';

import { Button, TextField, InputAdornment } from '../../../../node_modules/@mui/material/index';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import React from 'react';
import { Tabs, Tab, Card, CardContent, Typography, Box, Grid } from '@mui/material';
import { openSnackbar } from '../../../api/snackbar';
import { LoadingButton } from '../../../../node_modules/@mui/lab/index';
import VerticalTabs from './verticalTabs';
import BursaSociala from './BursaSociala';
import BursaPerfSport from './BursaPerfSport';


import { BookOutlined } from '@ant-design/icons';
import ScholarshipStepper from './ScholarshipStepper';
import ScholarshipStepperSpeciale from './ScholarshipStepperSpeciale';


const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
};



const ProductsPage = () => {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [budget, setBudget] = useState('');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [loading, setLoading] = useState({ home: false, olympicGrant: false,social:false });

  const loadingHandler = () => {
    setLoading((prev) => ({ ...prev, home: true }));
    setTimeout(() => {
      setLoading((prev) => ({ ...prev, home: false }));
    }, 1000); // Delay de 1 secundă
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
      const response = await fetch('http://localhost:8080/api/tipBursa/updateStateBudgetTotal', {
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
      openSnackbar({
        open: true,
        message:  'Eroare la calculul bugetului' + error.message,
        variant: 'alert',
        alert: {
          color: 'error'
        }
      });
      
    }
  };

  
  return (
    <Box sx={{ display: 'flex' }}>
      <Card sx={{ flexGrow: 1 }}>
        <CardContent>
          <Grid spacing={10}>
            <Typography variant="h6" sx={{ mr: 2, minWidth: 120 }}>
              Buget primit de la stat
            </Typography>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
              <TextField
                variant="outlined"
                placeholder="0.00"
                value={budget}
                id="outlined-start-adornment"
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">LEI</InputAdornment>
                }}
                sx={{ width: 300, mr: 1, fontSize: '0.875rem' }} // Setează o lățime de 150px și dimensiunea fontului la 0.875rem
              />

              <Tooltip title="Pentru a calcula bugetul pentru bursa socială" enterDelay={500} leaveDelay={200}>
                <LoadingButton
                  loading={loading.home}
                  variant="contained"
                  loadingPosition="start"
                  startIcon={<CalculateIcon />}
                  onClick={calculateBudget}
                >
                  Calcul
                </LoadingButton>
              </Tooltip>
            </Box>
          </Grid>
  
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
  <Button
    onClick={() => setValue(oldValue => Math.max(0, oldValue - 1))}
    disabled={value === 0}
  >
    <ArrowBackIosIcon />
  </Button>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Burse excelență Olimpică / Internațională " icon={<BookOutlined />} iconPosition="start"{...a11yProps(0)} />
            <Tab label="Burse de performanță" icon={<BookOutlined />} iconPosition="start"{...a11yProps(1)} />
            <Tab label="Burse speciale" icon={<BookOutlined />} iconPosition="start"{...a11yProps(2)} />
            <Tab label="Burse sociale" icon={<BookOutlined />} iconPosition="start"{...a11yProps(3)} />
            <Tab label="Burse de performanță sportivă" icon={<BookOutlined />} iconPosition="start"{...a11yProps(4)} />
          </Tabs>
          <Button
    onClick={() => setValue(oldValue => Math.min(oldValue + 1, 4))}
    disabled={value === 4}
  >
    <ArrowForwardIosIcon />
  </Button>
</Box>

          <TabPanel value={value} index={0}>
        <ScholarshipStepper></ScholarshipStepper>
          </TabPanel>
          <TabPanel value={value} index={1}>
         <VerticalTabs></VerticalTabs>
          </TabPanel>
          <TabPanel value={value} index={2}>
      <ScholarshipStepperSpeciale></ScholarshipStepperSpeciale>
          </TabPanel>
          <TabPanel value={value} index={3}><BursaSociala></BursaSociala></TabPanel>
          <TabPanel value={value} index={4}><BursaPerfSport></BursaPerfSport></TabPanel>
        </CardContent>
      </Card>

    </Box>
  );
};

export default ProductsPage;
