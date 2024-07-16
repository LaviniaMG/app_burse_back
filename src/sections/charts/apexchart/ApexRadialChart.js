import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import ReactApexChart from 'react-apexcharts';
import useConfig from '../../../hooks/useConfig';
import { ThemeMode } from '../../../config';

// chart options
const radialBarChartOptions = {
  chart: {
    type: 'radialBar',
    height: 450
  },
  plotOptions: {
    radialBar: {
      offsetY: 0,
      startAngle: -90,
      endAngle: 270,
      hollow: {
        margin: 5,
        size: '30%',
        background: 'transparent'
      },
      dataLabels: {
        name: {
          show: true,
          fontSize: '14px',
          fontWeight: 'bold',
          formatter: function (val, opts) {
            const labels = opts?.w?.globals?.labels;
            if (labels && opts?.seriesIndex !== undefined) {
              return `${labels[opts.seriesIndex]}`;
            }
            return '';
          },
          color: '#000'
        },
        value: {
          show: true,
          fontSize: '14px',
          fontWeight: 'bold',
          formatter: function (val, opts) {
            const series = opts?.w?.config?.series;
            if (series && opts?.seriesIndex !== undefined) {
              return `${series[opts.seriesIndex]}`; // Afișează numărul de bursieri
            }
            return '';
          },
          color: '#000',
          offsetY: 16
        }
      }
    }
  },
  labels: [],
  legend: {
    show: false
  },
  annotations: {
    position: 'front',
    labels: []
  },
  tooltip: {
    enabled: true,
    theme: 'dark',
    style: {
      fontSize: '12px',
      colors: ['#FFF']
    },
    marker: {
      show: false
    }
  },
  responsive: [
    {
      breakpoint: 450,
      options: {
        chart: {
          width: 280,
          height: 280
        }
      }
    }
  ]
};

// ==============================|| APEXCHART - RADIAL ||============================== //

const ApexRadialBarChart = () => {
  const theme = useTheme();
  const { mode } = useConfig();

  const { primary } = theme.palette.text;
  const line = theme.palette.divider;
  const grey200 = theme.palette.grey[200];

  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState(radialBarChartOptions);

  const secondary = theme.palette.primary[700];
  const primaryMain = theme.palette.primary.main;
  const successDark = theme.palette.success.main;
  const error = theme.palette.error.main;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/tipBursa');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('Invalid data format');
        }

        // Sortează bursele după nrBursieri și selectează primele 4
        const topBurses = data.sort((a, b) => (b?.nrBursieri || 0) - (a?.nrBursieri || 0)).slice(0, 4);

        // Extrage datele pentru grafic
        const seriesData = topBurses.map(bursa => bursa?.nrBursieri || 0);
        const labels = topBurses.map(bursa => `${bursa?.denumire || ''} (${bursa?.cuantum || ''})`);
        const cuantumuri = topBurses.map(bursa => bursa?.cuantum || 0);

        setSeries(seriesData);
        setOptions((prevState) => ({
          ...prevState,
          labels,
          annotations: {
            position: 'front',
            labels: labels.map((label, index) => ({
              text: label,
              x: 100,
              y: 100 + (index * 25),
              textAnchor: 'middle',
              fontSize: '14px',
              fontWeight: 'bold',
              background: {
                color: '#fff', // Set the background color to white
                padding: 4,
                radius: 4,
              },
              style: {
                color: 'black' // Set the text color to black
              },
            })),
          },
          tooltip: {
            custom: function({ series, seriesIndex, dataPointIndex, w }) {
              const colors = [secondary, primaryMain, successDark, error];
              const label = labels[seriesIndex];
              const cuantum = cuantumuri[seriesIndex];
              return `<div style="padding: 10px; background: ${colors[seriesIndex]}; color: white;">
                <strong>${label}</strong><br>Cuantum: ${cuantum}<br>Bursieri: ${series[seriesIndex]}
                </div>`;
            }
          }
        }));
      } catch (error) {
        console.error('Failed to fetch bursas:', error);
      }
    };
    fetchData();
  }, [secondary, primaryMain, successDark, error]);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [secondary, primaryMain, successDark, error],
      xaxis: {
        labels: {
          style: {
            colors: [primary, primary, primary, primary, primary, primary, primary]
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: [primary]
          }
        }
      },
      grid: {
        borderColor: line
      },
      plotOptions: {
        radialBar: {
          track: {
            background: line
          }
        }
      },
      theme: {
        mode: mode === ThemeMode.DARK ? 'dark' : 'light'
      }
    }));
  }, [mode, primary, line, grey200, secondary, primaryMain, error, successDark]);

  return (
    <Box id="chart" sx={{ bgcolor: 'transparent' }}>
      <ReactApexChart options={options} series={series} type="radialBar" height={450} />
    </Box>
  );
};

export default ApexRadialBarChart;
