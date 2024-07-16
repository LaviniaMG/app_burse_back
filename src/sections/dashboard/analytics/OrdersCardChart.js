import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';

// project import
import useConfig from '../../../hooks/useConfig';
import { ThemeMode } from '../../../config';

// ==============================|| ORDERS CARD CHART ||============================== //

const OrdersCardChart = () => {
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
      type: 'area',
      toolbar: {
        show: false
      },
      offsetX: -1
    },
    plotOptions: {
      bar: {
        borderRadius: 0
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        show: false
      },
      crosshairs: {
        fill: {
          type: 'gradient',
          gradient: {
            colorFrom: '#D8E3F0',
            colorTo: '#BED1E6',
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5
          }
        }
      },
      tooltip: {
        enabled: false
      }
    },
    yaxis: {
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        show: false
      }
    },
    tooltip: {
      x: {
        show: false
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
      name: 'Cuantum Burse',
      data: []
    }
  ]);

  useEffect(() => {
    const fetchTipBursaData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/tipBursa');
        const data = await response.json();

        // Extrage cuantumul burselor și setarea pentru grafic
        const cuantumData = data.map(bursa => parseFloat(bursa?.cuantum || 0).toFixed(2));
        const categories = data.map(bursa => bursa?.denumire);

        setSeries([
          {
            name: 'Cuantum Burse',
            data: cuantumData
          }
        ]);

        setOptions((prevState) => ({
          ...prevState,
          xaxis: {
            categories
          },
          colors: [theme.palette.error.main],
          theme: {
            mode: mode === ThemeMode.DARK ? 'dark' : 'light'
          }
        }));
      } catch (error) {
        console.error('Failed to fetch tip bursa data:', error);
      }
    };

    fetchTipBursaData();
  }, [mode, theme]);

  return <ReactApexChart options={options} series={series} type="area" height={100} />;
};

export default OrdersCardChart;
