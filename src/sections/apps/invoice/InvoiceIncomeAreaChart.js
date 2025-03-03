'use client';

import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

// third-party
import ReactApexChart from 'react-apexcharts';

// project import
import useConfig from  '../../../hooks/useConfig';
import { ThemeMode } from '../../../config';

// chart options
const areaChartOptions = {
  chart: {
    height: 350,
    type: 'line',
    stacked: false,
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    bar: {
      columnWidth: '50%'
    }
  },
  fill: {
    type: 'gradient',
    gradient: {
      inverseColors: false,
      shade: 'light',
      type: 'vertical',
      opacityFrom: [0, 1],
      opacityTo: [0.35, 1],
      stops: [0, 100],
      hover: {
        inverseColors: false,
        shade: 'light',
        type: 'vertical',
        opacityFrom: 0.15,
        opacityTo: 0.65,
        stops: [0, 96, 100]
      }
    }
  },
  legend: {
    show: false
  },
  stroke: {
    width: [0, 4],
    curve: 'smooth'
  },
  dataLabels: {
    enabled: false
  }
};

// ==============================|| INVOICE - INCOME AREA CHART ||============================== //

const InvoiceIncomeAreaChart = ({ series }) => {
  const theme = useTheme();
  const { mode } = useConfig();

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [theme.palette.warning.main, theme.palette.warning.main],
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        labels: {
          style: {
            colors: [
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary
            ]
          }
        },
        axisBorder: {
          show: false,
          color: line
        },
        tickAmount: 11
      },
      yaxis: {
        labels: {
          style: {
            colors: [secondary]
          }
        }
      },
      markers: {
        size: [0, 4],
        colors: theme.palette.common.white,
        strokeWidth: [0, 2],
        strokeColors: theme.palette.warning.main,
        hover: {
          size: 8,
          colors: theme.palette.warning.main,
          strokeColors: theme.palette.common.white
        }
      },
      grid: {
        borderColor: line
      },
      theme: {
        mode: mode === ThemeMode.DARK ? 'dark' : 'light'
      }
    }));
  }, [mode, primary, secondary, line, theme]);

  console.log('InvoiceIncomeAreaChart series:', series); // Verifică datele transmise

  return (
    <Box sx={{ '.apexcharts-bar-area': { strokeWidth: 0 } }}>
      <ReactApexChart options={options} series={series} type="line" height={265} />
    </Box>
  );
};

InvoiceIncomeAreaChart.propTypes = {
  series: PropTypes.any
};

export default InvoiceIncomeAreaChart;
