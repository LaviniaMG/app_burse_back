'use client';

import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Grid } from '@mui/material';

// project import
import MainCard from '../../../components/MainCard';
import Breadcrumbs from '../../../components/@extended/Breadcrumbs';
import ApexBarChart from '../../../sections/charts/apexchart/ApexBarChart';

import { APP_DEFAULT_PATH } from '../../../config';
import InvoiceWidgetCard from '../../../sections/apps/invoice/InvoiceWidgetCard';
import InvoiceIncomeAreaChart from '../../../sections/apps/invoice/InvoiceIncomeAreaChart';
import InvoicePieChart from '../../../sections/apps/invoice/InvoicePieChart';

// ==============================|| INVOICE - DASHBOARD ||============================== //

const Dashboard = () => {
  const theme = useTheme();
  const [activeChart, setActiveChart] = useState(0);
  const [widgetData, setWidgetData] = useState([]);
  const [facturi, setFacturi] = useState([]);
  const [series, setSeries] = useState([
    {
      name: 'Bursieri fonduri proprii',
      type: 'column',
      data: []
    },
    {
      name: 'Bursieri fonduri stat',
      type: 'line',
      data: []
    }
  ]);

  const fetchData = async () => {
    try {
      const [facturiResponse, tipBursaResponse] = await Promise.all([
        fetch('http://localhost:8080/api/facturi'),
        fetch('http://localhost:8080/api/tipBursa')
      ]);

      const [facturi, tipBursa] = await Promise.all([
        facturiResponse.json(),
        tipBursaResponse.json()
      ]);

      console.log('Facturi:', facturi); 
      console.log('Tipuri Bursa:', tipBursa); 

      setFacturi(facturi);
      updateWidgetData(facturi);
      updateSeriesData(facturi);

    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateWidgetData = (facturi) => {
    const total = facturi.reduce((acc, factura) => acc + Number(factura.suma), 0);
    const platit = facturi.filter(factura => factura.idStatus === 1).reduce((acc, factura) => acc + Number(factura.suma), 0);
    const inCurs = facturi.filter(factura => factura.idStatus === 3).reduce((acc, factura) => acc + Number(factura.suma), 0);
    const neplatit = facturi.filter(factura => factura.idStatus === 2).reduce((acc, factura) => acc + Number(factura.suma), 0);

    const calculatePercentage = (value, total) => (total === 0 ? 0 : (value / total) * 100).toFixed(2);

    setWidgetData([
      {
        title: 'Total',
        count: `LEI ${total.toFixed(2)}`,
        percentage: calculatePercentage(total, total),
        isLoss: false,
        invoice: facturi.length.toString(),
        color: theme.palette.warning
      },
      {
        title: 'Plătit',
        count: `LEI ${platit.toFixed(2)}`,
        percentage: calculatePercentage(platit, total),
        isLoss: false,
        invoice: facturi.filter(factura => factura.idStatus === 1).length.toString(),
        color: theme.palette.success
      },
      {
        title: 'În așteptare',
        count: `LEI ${inCurs.toFixed(2)}`,
        percentage: calculatePercentage(inCurs, total),
        isLoss: false,
        invoice: facturi.filter(factura => factura.idStatus === 3).length.toString(),
        color: theme.palette.info
      },
      {
        title: 'Neplătit',
        count: `LEI ${neplatit.toFixed(2)}`,
        percentage: calculatePercentage(neplatit, total),
        isLoss: true,
        invoice: facturi.filter(factura => factura.idStatus === 2).length.toString(),
        color: theme.palette.error
      }
    ]);
  };

  const updateSeriesData = (facturi) => {
    const months = Array(12).fill(0).map((_, i) => ({ fonduriProprii: 0, fonduriStat: 0 }));
    
    facturi.forEach(factura => {
      const month = new Date(factura.createdAt).getMonth();
      if (factura.solicitari.idBursa <= 8) {
        months[month].fonduriStat += Number(factura.suma);
      } else {
        months[month].fonduriProprii += Number(factura.suma);
      }
    });

    console.log('Months:', months);

    setSeries([
      {
        name: 'Bursieri fonduri proprii',
        type: 'column',
        data: months.map(month => month.fonduriProprii.toFixed(2))
      },
      {
        name: 'Bursieri fonduri stat',
        type: 'line',
        data: months.map(month => month.fonduriStat.toFixed(2))
      }
    ]);
  };

  const handleSeries = (index) => {
    setActiveChart(index);
    let updatedSeries = [];
    switch (index) {
      case 1:
        updatedSeries = getUpdatedSeries(facturi, 1);
        break;
      case 2: 
        updatedSeries = getUpdatedSeries(facturi, 3);
        break;
      case 3: 
        updatedSeries = getUpdatedSeries(facturi, 2);
        break;
      case 0:
      default:
        updateSeriesData(facturi);
        return;
    }
    setSeries(updatedSeries);
  };

  const getUpdatedSeries = (facturi, statusId) => {
    const months = Array(12).fill(0).map((_, i) => ({ fonduriProprii: 0, fonduriStat: 0 }));
    
    facturi.filter(factura => factura.idStatus === statusId).forEach(factura => {
      const month = new Date(factura.createdAt).getMonth();
      if (factura.solicitari.idBursa <= 8) {
        months[month].fonduriStat += Number(factura.suma);
      } else {
        months[month].fonduriProprii += Number(factura.suma);
      }
    });

    console.log(`Updated series for status ${statusId}:`, months); // Debug

    return [
      {
        name: 'Bursieri fonduri proprii',
        type: 'column',
        data: months.map(month => month.fonduriProprii)
      },
      {
        name: 'Bursieri fonduri stat',
        type: 'line',
        data: months.map(month => month.fonduriStat)
      }
    ];
  };

  let breadcrumbLinks = [{ title: 'Anunțuri', to: APP_DEFAULT_PATH }, { title: 'Sumarizare facturi' }];

  return (
    <>
      <Breadcrumbs custom heading="Statistici" links={breadcrumbLinks} />
      <Grid container spacing={2.5}>
        <Grid item xs={12} >
          <MainCard>
            <Grid container spacing={2}>
              {widgetData.map((data, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Box onClick={() => handleSeries(index)} sx={{ cursor: 'pointer' }}>
                    <InvoiceWidgetCard
                      title={data.title}
                      count={data.count}
                      percentage={data.percentage}
                      isLoss={data.isLoss}
                      invoice={data.invoice}
                      color={data.color.main}
                      isActive={index === activeChart}
                    />
                  </Box>
                </Grid>
              ))}
              <Grid item xs={12}>
                <InvoiceIncomeAreaChart series={series} />
              </Grid>
            </Grid>
          </MainCard>
        </Grid>

        <Grid item sm={6} md={6} xs={12} lg= {4}>
          <InvoicePieChart />
        </Grid>
        <Grid item sm={6} md={6} xs={12} lg={8}>
          <ApexBarChart></ApexBarChart>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
