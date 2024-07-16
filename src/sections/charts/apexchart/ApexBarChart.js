'use client';

import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

// third-party
import ReactApexChart from 'react-apexcharts';

// project import
import useConfig from '../../../hooks/useConfig';
import { ThemeMode } from '../../../config';

// chart options
const barChartOptions = {
  chart: {
    type: 'bar',
    height: 350
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      horizontal: true
    }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    categories: []
  },
  yaxis: {
    labels: {
      style: {
        colors: []
      },
      offsetX: -10,
      formatter: (value) => `${value}`, // Format labels if needed
      minWidth: 200 // Set a minimum width for the labels
    }
  }
};

// ==============================|| APEXCHART - BAR ||============================== //

const ApexBarChart = () => {
  const theme = useTheme();
  const { mode } = useConfig();
  const line = theme.palette.divider;
  const { primary } = theme.palette.text;
  const successDark = theme.palette.success.main;

  const [series, setSeries] = useState([{ data: [] }]);
  const [options, setOptions] = useState(barChartOptions);

  useEffect(() => {
    const fetchTipBursa = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/tipBursa');
        const tipuriBurse = await response.json();

        const categories = tipuriBurse.map(bursa => bursa.denumire);
        const data = tipuriBurse.map(bursa => bursa.cuantum);

        setOptions((prevState) => ({
          ...prevState,
          xaxis: {
            categories,
            labels: {
              style: {
                colors: new Array(categories.length).fill(primary)
              }
            }
          },
          yaxis: {
            labels: {
              style: {
                colors: new Array(categories.length).fill(primary),
              },
              offsetX: -10,
              minWidth: 200 // Set a minimum width for the labels
            }
          }
        }));

        setSeries([{ data }]);
      } catch (error) {
        console.error('Failed to fetch tipuri de burse:', error);
      }
    };

    fetchTipBursa();
  }, [primary]);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [successDark],
      grid: {
        borderColor: line
      },
      theme: {
        mode: mode === ThemeMode.DARK ? 'dark' : 'light'
      }
    }));
  }, [mode, line, successDark]);

  return (
    <Box id="chart" sx={{ bgcolor: 'transparent' }}>
      <ReactApexChart options={options} series={series} type="bar" height={350} />
    </Box>
  );
};

export default ApexBarChart;
