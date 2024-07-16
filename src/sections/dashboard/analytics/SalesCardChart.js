import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';

// project import
import useConfig from '../../../hooks/useConfig';
import { ThemeMode } from '../../../config';

// ==============================|| SALES CARD CHART ||============================== //

const SalesCardChart = () => {
  const theme = useTheme();
  const { mode } = useConfig();

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
    plotOptions: {
      bar: {
        borderRadius: 0
      }
    },
    dataLabels: {
      enabled: false,
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ['#304758']
      }
    },
    tooltip: {
      x: {
        show: false
      },
      y: {
        formatter(val) {
          return ` ${val}`;
        }
      }
    },
    grid: {
      show: false
    }
  };

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);
  const [series, setSeries] = useState([
    {
      name: 'Facturi',
      data: []
    }
  ]);

  useEffect(() => {
    const fetchFacturiData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/facturi');
        const data = await response.json();

        const facturiData = data.slice(0, 27).map(factura => parseFloat(factura?.suma || 0));

        setSeries([
          {
            name: 'Facturi',
            data: facturiData
          }
        ]);
      } catch (error) {
        console.error('Failed to fetch facturi:', error);
      }
    };

    fetchFacturiData();
  }, []);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [theme.palette.warning.main],
      theme: {
        mode: mode === ThemeMode.DARK ? 'dark' : 'light'
      }
    }));
  }, [mode, primary, secondary, line, theme]);

  return <ReactApexChart options={options} series={series} type="bar" height={100} />;
};

export default SalesCardChart;
