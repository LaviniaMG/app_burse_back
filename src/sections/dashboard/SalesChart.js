'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, Stack, Typography, useMediaQuery } from '@mui/material';
import ReactApexChart from 'react-apexcharts';
import MainCard from '../../components/MainCard';
import useConfig from '../../hooks/useConfig';
import { ThemeMode } from '../../config';

// chart options
const columnChartOptions = {
  chart: {
    type: 'bar',
    height: 430,
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    bar: {
      columnWidth: '30%',
      borderRadius: 4
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    show: true,
    width: 8,
    colors: ['transparent']
  },
  xaxis: {
    categories: ['2019', '2020', '2021', '2022', '2023', '2024']
  },
  yaxis: {
    title: {
      text: 'studenți'
    }
  },
  fill: {
    opacity: 1
  },
  tooltip: {
    y: {
      formatter(val) {
        return `${val} studenți`;
      }
    }
  },
  legend: {
    show: false
  },
  responsive: [
    {
      breakpoint: 600,
      options: {
        yaxis: {
          show: false
        }
      }
    }
  ]
};

const SalesChart = () => {
  const theme = useTheme();
  const xsDown = useMediaQuery(theme.breakpoints.down('sm'));

  const { mode } = useConfig();

  const [legend, setLegend] = useState({
    eligible: true,
    nonEligible: true
  });

  const { eligible, nonEligible } = legend;

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const warning = theme.palette.warning.main;
  const primaryMain = theme.palette.primary.main;
  const successDark = theme.palette.success.dark;

  const [initialSeries, setInitialSeries] = useState([
    {
      name: 'Studenți eligibili',
      data: []
    },
    {
      name: 'Studenți neeligibili',
      data: []
    }
  ]);

  const [series, setSeries] = useState(initialSeries);
  const [options, setOptions] = useState(columnChartOptions);

  const handleLegendChange = (event) => {
    const { name, checked } = event.target;
    setLegend((prevLegend) => ({
      ...prevLegend,
      [name]: checked
    }));
  };

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/studenti');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('Invalid data format');
        }

        const years = ['2019', '2020', '2021', '2022', '2023', '2024'];
        const eligibleCounts = Array(years.length).fill(0);
        const nonEligibleCounts = Array(years.length).fill(0);

        data.forEach((student) => {
          if (student && student.createdAt) {
            const year = new Date(student.createdAt).getFullYear().toString();
            const yearIndex = years.indexOf(year);
            if (yearIndex !== -1) {
              if (!student.restanta) {
                eligibleCounts[yearIndex]++;
              } else {
                nonEligibleCounts[yearIndex]++;
              }
            }
          }
        });

        const newSeries = [
          {
            name: 'Studenți eligibili',
            data: eligibleCounts
          },
          {
            name: 'Studenți neeligibili',
            data: nonEligibleCounts
          }
        ];

        setInitialSeries(newSeries);
        setSeries(newSeries);
      } catch (error) {
        console.error('Failed to fetch student data:', error);
      }
    };

    fetchStudentData();
  }, []);

  useEffect(() => {
    const updatedSeries = [];
    if (eligible && initialSeries[0]) {
      updatedSeries.push(initialSeries[0]);
    }
    if (nonEligible && initialSeries[1]) {
      updatedSeries.push(initialSeries[1]);
    }
    setSeries(updatedSeries);
  }, [eligible, nonEligible, initialSeries]);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: !(eligible && nonEligible) && nonEligible ? [primaryMain] : [warning, primaryMain],
      xaxis: {
        labels: {
          style: {
            colors: [secondary, secondary, secondary, secondary, secondary, secondary]
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: [secondary]
          }
        }
      },
      grid: {
        borderColor: line
      },
      theme: {
        mode: mode === ThemeMode.DARK ? 'dark' : 'light'
      },
      plotOptions: {
        bar: {
          columnWidth: xsDown ? '60%' : '30%'
        }
      }
    }));
  }, [mode, primary, secondary, line, warning, primaryMain, successDark, eligible, nonEligible, xsDown]);

  return (
    <MainCard sx={{ mt: 1 }} content={false}>
      <Box sx={{ p: 2.5, pb: 0 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack spacing={1.5}>
            <Typography variant="h6" color="secondary">
              Eligibilitate
            </Typography>
          </Stack>
          <FormControl component="fieldset">
            <FormGroup row>
              <FormControlLabel
                control={<Checkbox color="warning" checked={eligible} onChange={handleLegendChange} name="eligible" />}
                label="Studenți eligibili"
              />
              <FormControlLabel control={<Checkbox checked={nonEligible} onChange={handleLegendChange} name="nonEligible" />} label="Studenți neeligibili" />
            </FormGroup>
          </FormControl>
        </Stack>
        <Box id="chart" sx={{ bgcolor: 'transparent' }}>
          <ReactApexChart options={options} series={series} type="bar" height={360} />
        </Box>
      </Box>
    </MainCard>
  );
};

export default SalesChart;
