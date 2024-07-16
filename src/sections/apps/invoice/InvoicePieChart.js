'use client';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, Typography, useMediaQuery } from '@mui/material';

// third-party
import ReactApexChart from 'react-apexcharts';

// project import
import useConfig from '../../../hooks/useConfig';
import MainCard from '../../../components/MainCard';
import Dot from '../../../components/@extended/Dot';

import { ThemeMode } from '../../../config';

// chart options
const areaChartOptions = {
  chart: {
    width: 350,
    type: 'donut',
    stacked: false,
    zoom: {
      enabled: false
    }
  },
  plotOptions: {
    donut: {
      size: '15%'
    }
  },
  stroke: {
    width: 0
  },
  dataLabels: {
    enabled: false
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        }
      }
    }
  ],
  legend: {
    show: false
  }
};

// ==============================|| INVOICE - PIE CHART ||============================== //

const InvoicePieChart = () => {
  const theme = useTheme();
  const { mode } = useConfig();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));
  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);
  const [series, setSeries] = useState([0, 0, 0]);
  const [totals, setTotals] = useState({ inCurs: 0, platit: 0, neplatit: 0 });

  useEffect(() => {
    const fetchFacturi = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/facturi');
        const facturi = await response.json();
        const inCurs = facturi.filter(factura => factura.idStatus === 3).reduce((acc, factura) => acc + Number(factura.suma), 0);
        const platit = facturi.filter(factura => factura.idStatus === 1).reduce((acc, factura) => acc + Number(factura.suma), 0);
        const neplatit = facturi.filter(factura => factura.idStatus === 2).reduce((acc, factura) => acc + Number(factura.suma), 0);

        setSeries([inCurs, platit, neplatit]);
        setTotals({ inCurs, platit, neplatit });
      } catch (error) {
        console.error('Failed to fetch facturi:', error);
      }
    };

    fetchFacturi();
  }, []);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      labels: ['În așteptare', 'Plătit', 'Neplătit'],
      colors: [theme.palette.warning.main, theme.palette.success.main, theme.palette.error.main, theme.palette.primary.lighter],
      tooltip: {
        custom: function ({ series, seriesIndex, w }) {
          return `<div class="pie_box">
          <span class="PieDot" style='background-color:${w.globals.colors[seriesIndex]}'></span>
          <span class="fontsize">${w.globals.labels[seriesIndex]}${' '}
          <span class="fontsizeValue">${series[seriesIndex].toFixed(2)} LEI</span></span></div>`;
        }
      },
      theme: {
        mode: mode === ThemeMode.DARK ? 'dark' : 'light'
      }
    }));
  }, [mode, primary, secondary, line, theme]);

  //sx style
  const DotSize = { display: 'flex', alignItems: 'center', gap: 1 };
  const ExpenseSize = { fontSize: '1rem', lineHeight: '1.5rem', fontWeight: 500 };

  return (
    <MainCard
      title="Total Cheltuieli"
      sx={{
        '.pie_box': { padding: 2, display: 'flex', gap: 1, alignItems: 'center', width: '100%' },
        '.PieDot': { width: 12, height: 12, borderRadius: '50%' },
        '.fontsize': { fontWeight: 500, fontSize: '0.875rem', lineHeight: '1.375rem', color: theme.palette.secondary.main },
        '.fontsizeValue': { color: theme.palette.secondary.dark }
      }}
    >
      <Grid container alignItems="center" spacing={1}>
        <Grid item xs={12} sx={{ '& .apexcharts-canvas': { margin: '0 auto' } }}>
          <ReactApexChart options={options} series={series} type="donut" height={downMD ? '100%' : 265} />
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            <Grid item></Grid>
            <Grid item xs sx={DotSize}>
              <Dot color="warning" size={12} />
              <Typography align="left" variant="subtitle1" color="textSecondary">
              În așteptare
              </Typography>
            </Grid>
            <Grid item sx={ExpenseSize}>
              LEI {totals.inCurs.toFixed(2)}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            <Grid item></Grid>
            <Grid item xs sx={DotSize}>
              <Dot color="success" size={12} />
              <Typography align="left" variant="subtitle1" color="textSecondary">
                Plătit
              </Typography>
            </Grid>
            <Grid item sx={ExpenseSize}>
              LEI {totals.platit.toFixed(2)}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            <Grid item></Grid>
            <Grid item xs sx={DotSize}>
              <Dot color="error" size={12} />
              <Typography align="left" variant="subtitle1" color="textSecondary">
                Neplătit
              </Typography>
            </Grid>
            <Grid item sx={ExpenseSize}>
              LEI {totals.neplatit.toFixed(2)}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default InvoicePieChart;
