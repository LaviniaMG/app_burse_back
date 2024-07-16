'use client';

import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';

// next
import { useRouter } from 'next/navigation';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Grid,
  IconButton,
  Chip,
  FormControl,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Divider,
  Skeleton
} from '@mui/material';

// third-party
import ReactToPrint from 'react-to-print';
import { PDFDownloadLink } from '@react-pdf/renderer';

// project import
import MainCard from '../../../components/MainCard';
import LogoSection from '../../../components/logo';
import Breadcrumbs from '../../../components/@extended/Breadcrumbs';
import LoadingButton from '../../../components/@extended/LoadingButton';

import { APP_DEFAULT_PATH } from '../../../config';
import { handlerActiveItem, useGetMenuMaster } from '../../../api/menu';
import { useGetInvoiceMaster } from '../../../api/invoice';
import ExportPDFView from '../../../sections/apps/invoice/export-pdf';

// assets
import { DownloadOutlined, EditOutlined, PrinterFilled } from '@ant-design/icons';

const PDFIconButton = ({ list }) => {
  const theme = useTheme();
  return (
    <PDFDownloadLink document={<ExportPDFView list={list} />} fileName={`${list.idFactura}-${list.solicitari.utilizator.Nume}.pdf`}>
      <IconButton>
        <DownloadOutlined style={{ color: theme.palette.grey[900] }} />
      </IconButton>
    </PDFDownloadLink>
  );
};

PDFIconButton.propTypes = {
  list: PropTypes.object
};

// ==============================|| INVOICE - DETAILS ||============================== //

const Details = () => {
  const theme = useTheme();
  const router = useRouter();
  const [list, setList] = useState(null);

  useEffect(() => {
    const data = sessionStorage.getItem('invoiceData');
    if (data) {
      setList(JSON.parse(data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const today = new Date(`${list?.dataStart}`).toLocaleDateString('en-GB', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  });

  const due_dates = new Date(`${list?.dataFinal}`).toLocaleDateString('en-GB', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  });

  const total = list?.suma;
  const componentRef = useRef(null);

  const isLoader = !list;

  let breadcrumbLinks = [
    { title: 'Anunțuri', to: APP_DEFAULT_PATH },
    { title: 'Facturi', to: '/apps/factura/dashboard' },
    { title: 'Detalii' }
  ];

  return (
    <>
      <Breadcrumbs custom heading="Sumarizare facturi" links={breadcrumbLinks} />
      <MainCard content={false}>
        <Stack spacing={2.5}>
          <Box sx={{ p: 2.5, pb: 0 }}>
            <MainCard content={false} sx={{ p: 1.25, bgcolor: 'primary.lighter', borderColor: theme.palette.primary[100] }}>
              <Stack direction="row" justifyContent="flex-end" spacing={1}>
              
                {isLoader ? <LoadingButton loading>X</LoadingButton> : <PDFIconButton {...{ list }} />}
                <ReactToPrint
                  trigger={() => (
                    <IconButton>
                      <PrinterFilled style={{ color: theme.palette.grey[900] }} />
                    </IconButton>
                  )}
                  content={() => componentRef.current}
                />
              </Stack>
            </MainCard>
          </Box>
          <Box sx={{ p: 2.5 }} id="print" ref={componentRef}>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between">
                  <Box>
                    <Stack direction="row" spacing={2}>
                      <LogoSection />
                      <Chip label="Plătit" variant="outlined" color="success" size="small" />
                    </Stack>
                    <Typography color="secondary">{isLoader ? <Skeleton /> : list?.idFactura}</Typography>
                  </Box>
                  <Box>
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Typography variant="subtitle1">Data</Typography>
                      <Typography color="secondary">{today}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Typography sx={{ overflow: 'hidden' }} variant="subtitle1">
                        Data de final
                      </Typography>
                      <Typography color="secondary">{due_dates}</Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <MainCard>
                  <Stack spacing={1}>
                    <Typography variant="h5">De la:</Typography>
                    {isLoader ? (
                      <Stack spacing={0.5}>
                        <Skeleton />
                        <Skeleton width={60} />
                        <Skeleton />
                      </Stack>
                    ) : (
                      <FormControl sx={{ width: '100%' }}>
                        <Typography color="secondary">{"Academia de Studii Economice din București"}</Typography>
                        <Typography color="secondary">{"Piata Romană nr. 6, Sector 1, Bucuresti, 010374"}</Typography>
                        <Typography color="secondary">{"Telefon: +40 21.319.19.01"}</Typography>
                        <Typography color="secondary">{"Fax: +40 21.319.18.99"}</Typography>
                        <Typography color="secondary">{"E-mail: rectorat@ase.ro"}</Typography>
                        <Typography color="secondary">{"Website: www.ase.ro"}</Typography>
                      </FormControl>
                    )}
                  </Stack>
                </MainCard>
              </Grid>
              <Grid item xs={12} sm={6}>
                <MainCard>
                  <Stack spacing={1}>
                    <Typography variant="h5">Pentru:</Typography>
                    {isLoader ? (
                      <Stack spacing={0.5}>
                        <Skeleton />
                        <Skeleton width={60} />
                        <Skeleton />
                      </Stack>
                    ) : (
                      <FormControl sx={{ width: '100%' }}>
                        <Typography color="secondary">{list?.solicitari?.utilizator?.Nume} {list?.solicitari?.utilizator?.Prenume}</Typography>
                        <Typography color="secondary">{list?.solicitari?.utilizator?.Email}</Typography>
                        <Typography color="secondary">{"Telefon: "}{list?.solicitari?.utilizator?.Telefon}</Typography>
                        <Typography color="secondary">{"CNP: "}{list?.solicitari?.utilizator?.CNP}</Typography>
                      
                      
                      </FormControl>
                    )}
                  </Stack>
                </MainCard>
              </Grid>
              <Grid item xs={12}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell align="right">CUANTUM</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {isLoader ? (
                        [1, 2, 3].map((row) => (
                          <TableRow key={row} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell><Skeleton /></TableCell>
                            <TableCell><Skeleton /></TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell></TableCell>
                          <TableCell align="right">{Number(list?.suma).toFixed(2)}</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ borderWidth: 1 }} />
              </Grid>
              <Grid item xs={12} mt={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2} p={2}>
                  <Typography variant="subtitle1">Total de plată :</Typography>
                  <Typography variant="subtitle1">
                    {isLoader ? <Skeleton width={100} /> : Number(list?.suma).toFixed(2)}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Box>
          <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ p: 2.5, a: { textDecoration: 'none', color: 'inherit' } }}>
            <PDFDownloadLink document={<ExportPDFView list={list} />} fileName={`${list?.idFactura}-${list?.solicitari?.utilizator?.Nume}.pdf`}>
              <LoadingButton
                loading={isLoader}
                color="primary"
                variant="contained"
                loadingPosition="center"
                sx={{ color: 'secondary.lighter' }}
              >
                Descărcare
              </LoadingButton>
            </PDFDownloadLink>
          </Stack>
        </Stack>
      </MainCard>
    </>
  );
};

Details.propTypes = {
  id: PropTypes.string
};

export default Details;
