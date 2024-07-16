'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

// project import
import MainCard from '../../components/MainCard';
import AnalyticsDataCard from '../../components/cards/statistics/AnalyticsDataCard';
import UsersCardChart from '../../sections/dashboard/analytics/UsersCardChart';
import OrdersCardChart from '../../sections/dashboard/analytics/OrdersCardChart';
import SalesCardChart from '../../sections/dashboard/analytics/SalesCardChart';
import MarketingCardChart from '../../sections/dashboard/analytics/MarketingCardChart';
import SalesChart from '../../sections/dashboard/SalesChart';
import ApexRedialBarChart from '../../sections/charts/apexchart/ApexRadialChart';
import OrdersList from '../../sections/dashboard/analytics/OrdersList';

// ==============================|| DASHBOARD - ANALYTICS ||============================== //

const DashboardAnalytics = () => {
  const theme = useTheme();
  const [tipBursaData, setTipBursaData] = useState([]);
  const [totalBursieri, setTotalBursieri] = useState(0);
  const [totalBurse, setTotalBurse] = useState(0);
  const [totalFacturiSum, setTotalFacturiSum] = useState(0);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const fetchTipBursaData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/tipBursa');
        const data = await response.json();
        setTipBursaData(data);

        // Calculați numărul total de bursieri
        const totalBursieri = data.reduce((acc, bursa) => acc + (bursa?.nrBursieri || 0), 0);
        setTotalBursieri(totalBursieri);

    

        // Calculați numărul total de burse
        setTotalBurse(data.length);

      } catch (error) {
        console.error('Failed to fetch tip bursa data:', error);
      }
    };

    const fetchFacturiData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/facturi');
        const data = await response.json();

        // Calculați suma totală a facturilor
        const totalFacturiSum = data.reduce((acc, factura) => acc + parseFloat(factura?.suma || 0), 0);
        setTotalFacturiSum(totalFacturiSum);

        // Calculați procentajul
        const percentage = totalBursieri > 0 ? ((totalFacturiSum / totalBursieri) * 100).toFixed(2) : 0;
        setPercentage(percentage);

      } catch (error) {
        console.error('Failed to fetch facturi data:', error);
      }
    };

    fetchTipBursaData();
    fetchFacturiData();
  }, []);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={3}>
      {/* row 1 */}
      <Grid item xs={12} sm={6} md={4} lg={4}>
        <AnalyticsDataCard title="Nr total de bursieri" count={totalBursieri} >
          <UsersCardChart />
        </AnalyticsDataCard>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={4}>
        <AnalyticsDataCard title="Nr total de burse" count={totalBurse} >
          <OrdersCardChart />
        </AnalyticsDataCard>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={4}>
        <AnalyticsDataCard title="Totalul facturilor" count={`LEI ${totalFacturiSum.toFixed(2)}`} >
          <SalesCardChart />
        </AnalyticsDataCard>
      </Grid>
    

      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

      {/* row 2 */}
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Raportare studenți</Typography>
          </Grid>
        </Grid>
        <SalesChart />
      </Grid>
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Cele mai populare tipuri de burse</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <ApexRedialBarChart />
      </Grid>

      {/* row 3 */}
      <Grid item xs={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Ultimii studenți</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <OrdersList />
        </MainCard>
      </Grid>

      {/* row 4 */}
      <Grid item xs={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Detalii Burse</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Denumire</TableCell>
                  <TableCell>Buget Bursă</TableCell>
                  <TableCell>Buget Total</TableCell>
                  <TableCell>Cuantum</TableCell>
                  <TableCell>Număr Bursieri</TableCell>
                  <TableCell>Data Start</TableCell>
                  <TableCell>Data Final</TableCell>
                 
                
                </TableRow>
              </TableHead>
              <TableBody>
                {tipBursaData.map((bursa) => (
                  <TableRow key={bursa?.id}>
                    <TableCell>{bursa.denumire}</TableCell>
                    <TableCell>{parseFloat(bursa?.bugetBursa).toFixed(2)}</TableCell>
                    <TableCell>{parseFloat(bursa.bugetTotal).toFixed(2)}</TableCell>
                    <TableCell>{parseFloat(bursa?.cuantum).toFixed(2)}</TableCell>
                    <TableCell>{bursa?.nrBursieri}</TableCell>
                    <TableCell>{format(new Date(bursa?.dataStart), 'dd-MMM-yyyy')}</TableCell>
<TableCell>{format(new Date(bursa?.dataFinal), 'dd-MMM-yyyy')}</TableCell>
                   
                   
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default DashboardAnalytics;
