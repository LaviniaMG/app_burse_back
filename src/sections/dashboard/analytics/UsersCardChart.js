'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';
import useConfig from '../../../hooks/useConfig';
import { ThemeMode } from '../../../config';

const UsersCardChart = () => {
  const theme = useTheme();
  const { mode } = useConfig();

  // chart options
  const areaChartOptions = {
    chart: {
      id: 'new-stack-chart',
      sparkline: {
        enabled: true
      },
      height: 100,
      type: 'bar',
      toolbar: {
        show: false
      },
      offsetX: -4
    },
    dataLabels: {
      enabled: false
    },
    plotOptions: {
      bar: {
        columnWidth: '80%'
      }
    },
    tooltip: {
      x: {
        show: false
      },
      y: {
        formatter(val) {
          return `${val}`;
        }
      }
    },
    xaxis: {
      categories: []
    }
  };

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);
  const [series, setSeries] = useState([
    {
      name: 'Studenți',
      data: []
    }
  ]);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/studenti');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Verifică dacă datele sunt un array
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format');
        }

        // Procesare date pentru a obține numărul de bursieri pentru fiecare tip de bursă
        const bursieriCount = {};
        data.forEach(student => {
          student.utilizator?.solicitari.forEach(solicitare => {
            if (solicitare?.denumireBursa) {
              if (bursieriCount[solicitare?.denumireBursa]) {
                bursieriCount[solicitare?.denumireBursa]++;
              } else {
                bursieriCount[solicitare?.denumireBursa] = 1;
              }
            }
          });
        });

        console.log('Bursieri Count:', bursieriCount); // Verificare date

        const categories = Object.keys(bursieriCount);
        const seriesData = categories.map(key => bursieriCount[key]);

        console.log('Categories:', categories); // Verificare date
        console.log('Series Data:', seriesData); // Verificare date

        setOptions((prevState) => ({
          ...prevState,
          xaxis: {
            categories
          },
          colors: [theme.palette.primary.main, theme.palette.primary[700]],
          theme: {
            mode: mode === ThemeMode.DARK ? 'dark' : 'light'
          }
        }));

        setSeries([
          {
            name: 'Studenți',
            data: seriesData
          }
        ]);

      } catch (error) {
        console.error('Failed to fetch students:', error);
      }
    };

    fetchStudentData();
  }, [mode, primary, secondary, line, theme]);

  useEffect(() => {
    console.log('Options:', options); // Verificare opțiuni
    console.log('Series:', series); // Verificare serii
  }, [options, series]);

  return <ReactApexChart options={options} series={series} type="bar" height={100} />;
};

export default UsersCardChart;
