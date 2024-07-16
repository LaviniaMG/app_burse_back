'use client';

import PropTypes from 'prop-types';
import Image from 'next/legacy/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third party
import * as yup from 'yup';
import { v4 as UIDV4 } from 'uuid';
import { format } from 'date-fns';
import { FieldArray, Form } from 'formik';
import { Formik } from 'formik';

// project import
import MainCard from '../../../components/MainCard';
import CircularLoader from '../../../components/CircularLoader';
import Breadcrumbs from '../../../components/@extended/Breadcrumbs';
import InvoiceItem from '../../../sections/apps/invoice/InvoiceItem';
import AddressModal from '../../../sections/apps/invoice/AddressModal';
import InvoiceModal from '../../../sections/apps/invoice/InvoiceModal';

import { APP_DEFAULT_PATH } from '../../../config';
import incrementer from '../../../utils/incrementer';
import { openSnackbar } from '../../../api/snackbar';
import {
  handlerCustomerTo,
  handlerCustomerFrom,
  handlerPreview,
  insertInvoice,
  selectCountry,
  useGetInvoice,
  useGetInvoiceMaster
} from '../../../api/invoice';

// assets
import { EditOutlined, PlusOutlined } from '@ant-design/icons';

const validationSchema = yup.object({
  date: yup.date().required('Data facturii este obligatorie'),
  due_date: yup
    .date()
    .when('date', (date, schema) => date && schema.min(date, "Data de final nu poate fii inainte de data de început"))
    .nullable()
    .required('Data de final este obligatorie'),
  customerInfo: yup
    .object({
      name: yup.string().required('Trebuie să selectați o bursă')
    })
    .required('Trebuie să selectați o bursă'),
  status: yup.string().required('Trebuie să selectați un status'),
 
});

// ==============================|| INVOICE CREATE - FORM ||============================== //

const CreateForm = ({ lists, invoiceMaster }) => {
  const theme = useTheme();
  const router = useRouter();
  const notesLimit = 500;
  const [selectedBursa, setSelectedBursa] = useState({ id: null, denumire: null, cuantum:null });
  const [startDate,setStartDate]=useState(new Date);
  const [dueDate,setDueDate]=useState(new Date);
  const [statusRez,setStatus]=useState({});
  
  const [loading, setLoading] = useState(false);
  const [isBursaModalOpen, setBursaModalOpen] = useState(false);

  const handleSelectBursa = (bursa) => {
    setSelectedBursa({ id: bursa.idBursa, denumire: bursa.denumire, cuantum:bursa.cuantum });
    console.log('Bursa selectată:', selectedBursa);
  };

  const handlerCreate = (values) => {
    const newList = {
      id: Number(incrementer(lists.length)),
      invoice_id: Number(values.invoice_id),
      customer_name: values.customerInfo?.name,
      email: values.cashierInfo?.email,
      avatar: Number(Math.round(Math.random() * 10)),
      discount: Number(values.discount),
      tax: Number(values.tax),
      date: format(new Date(values.date), 'MM/dd/yyyy'),
      due_date: format(new Date(values.due_date), 'MM/dd/yyyy'),
      quantity: Number(
        values.invoice_detail?.reduce((sum, i) => {
          return sum + i.price;
        }, 0)
      ),
      status: values.status,
      cashierInfo: values.cashierInfo,
      customerInfo: values.customerInfo,
      invoice_detail: values.invoice_detail,
      notes: values.notes
    };

    insertInvoice(newList);
    openSnackbar({
      open: true,
      message: 'Factură adăugată cu succes!',
      anchorOrigin: { vertical: 'top', horizontal: 'right' },
      variant: 'alert',
      alert: {
        color: 'success'
      }
    });
    router.push('/apps/factura/list');
  };

  const handleSubmitData =() => {
    const formData={
      idContDestinatie:2,
      tipBursaId:selectedBursa.id,
      dataStart:startDate,
      dataFinal:dueDate,
      idStatus:parseInt(statusRez.status, 10)
    }
    console.log("FormData:",formData);
    fetch('http://localhost:8080/api/facturi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
    });
    router.push('/apps/factura/list');
  }

  return (
    <Formik
      initialValues={{
        id: 120,
        invoice_id: Date.now(),
        status: '',
        date: new Date(),
        due_date: null,
        cashierInfo: {
          name: 'Academia de Studii Economice',
          address: 'București, Str. Dorobanților',
          phone: '305-829-7809',
          email: 'ase@gmail.com'
        },
        customerInfo: {
          name: ''
        },
        invoice_detail: [
          {
            id: UIDV4(),
            name: '',
            description: '',
            qty: 1,
            price: '1.00'
          }
        ],
        discount: 0,
        tax: 0,
        notes: ''
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        handlerCreate(values);
      }}
    >
      {({ handleBlur, errors, handleChange, handleSubmit, values, isValid, setFieldValue, touched }) => {
        const subtotal = values?.invoice_detail.reduce((prev, curr) => {
         return prev + Number(curr.price );
         
        }, 0);
        const taxRate = (values.tax * subtotal) / 100;
        const discountRate = (values.discount * subtotal) / 100;
        const total = subtotal;
        return (
          <Form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Stack spacing={1}>
                  <InputLabel>Id Factură</InputLabel>
                  <FormControl sx={{ width: '100%' }}>
                    <TextField
                      required
                      disabled
                      type="number"
                      name="invoice_id"
                      id="invoice_id"
                      value={values.invoice_id}
                      onChange={handleChange}
                    />
                  </FormControl>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Stack spacing={1}>
                  <InputLabel>Status</InputLabel>
                  <FormControl sx={{ width: '100%' }}>
                    <Select
                      value={values.status}
                      displayEmpty
                      name="status"
                      renderValue={(selected) => {
                        if (selected.length === 0) {
                          return <Box sx={{ color: 'secondary.400' }}>Selectați statusul</Box>;
                        }
                        return selected;
                        // return selected.join(', ');
                      }}
                      onChange={(e) => {
                        handleChange(e);
                        setStatus({ status: e.target.value });
                      }}
                      error={Boolean(errors.status && touched.status)}
                    >
                      <MenuItem disabled value="">
                        Selectați statusul
                      </MenuItem>
                      <MenuItem value="1">Plătit</MenuItem>
                      <MenuItem value="3">În aștepare</MenuItem>
                      <MenuItem value="2">Refuzat</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
                {touched.status && errors.status && <FormHelperText error={true}>{errors.status}</FormHelperText>}
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Stack spacing={1}>
                  <InputLabel>Data</InputLabel>
                  <FormControl sx={{ width: '100%' }} error={Boolean(touched.date && errors.date)}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker format="dd/MM/yyyy" value={startDate} onChange={(newValue) => setStartDate(newValue)} />
                    </LocalizationProvider>
                  </FormControl>
                </Stack>
                {touched.date && errors.date && <FormHelperText error={true}>{errors.date}</FormHelperText>}
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Stack spacing={1}>
                  <InputLabel>Data de final</InputLabel>
                  <FormControl sx={{ width: '100%' }} error={Boolean(touched.due_date && errors.due_date)}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        format="dd/MM/yyyy"
                        value={dueDate}
                        onChange={(newValue) => setDueDate(newValue)}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </Stack>
                {touched.due_date && errors.due_date && <FormHelperText error={true}>{errors.due_date}</FormHelperText>}
              </Grid>

              <Grid item xs={12} sm={6}>
                <MainCard sx={{ minHeight: 168 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={8}>
                      <Stack spacing={2}>
                        <Typography variant="h5">De la:</Typography>
                        <Stack sx={{ width: '100%' }}>
                          <Typography variant="subtitle1">{values?.cashierInfo?.name}</Typography>
                          <Typography color="secondary">{values?.cashierInfo?.address}</Typography>
                          <Typography color="secondary">{values?.cashierInfo?.phone}</Typography>
                          <Typography color="secondary">{values?.cashierInfo?.email}</Typography>
                        </Stack>
                      </Stack>
                    </Grid>
                  </Grid>
                </MainCard>
              </Grid>
              <Grid item xs={12} sm={6}>
                <MainCard sx={{ minHeight: 168 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={8}>
                      <Stack spacing={2}>
                        <Typography variant="h5">Pentru:</Typography>
                        <Stack sx={{ width: '100%' }}>
                        <Typography> {selectedBursa.denumire}</Typography></Stack>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box textAlign="right" color="grey.200">
                        <Button
                          size="small"
                          startIcon={<PlusOutlined />}
                          color="secondary"
                          variant="outlined"
                          onClick={() => setBursaModalOpen(true)}
                        >
                          Adăugați
                        </Button>
                        <AddressModal
                           open={isBursaModalOpen}
                           setOpen={setBursaModalOpen}
                           handlerAddress={handleSelectBursa}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </MainCard>
                {touched.customerInfo && errors.customerInfo && <FormHelperText error={true}>{errors?.customerInfo?.name}</FormHelperText>}
              </Grid>

               <Grid item xs={12} spacing={2}>
                <Typography variant="h5">Detalii</Typography>
              </Grid> 
              <Grid item xs={12} spacing={2}>
                <FieldArray
                  name="invoice_detail"
                  render={({ remove, push }) => {
                    return (
                      <>
                        <TableContainer >
                          <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                              <TableRow>
                                <TableCell></TableCell>
                               
                                <TableCell align="right">Cuantum</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                               
                                     <TableCell></TableCell>
                                    <TableCell align='right'>{selectedBursa.cuantum}</TableCell>
                            
                            </TableBody>
                          </Table>
                        </TableContainer>
                        <Divider />
                        {touched.invoice_detail && errors.invoice_detail && !Array.isArray(errors?.invoice_detail) && (
                          <Stack direction="row" justifyContent="center" sx={{ p: 1.5 }}>
                            <FormHelperText error={true}>{errors.invoice_detail}</FormHelperText>
                          </Stack>
                        )}
                      
                            <Grid subitem xs={12} spacing={2}>
                              <Stack direction="flex" justifyContent="space-between" alignItems="center" mb={2} mt={2}>
                                <Typography variant="subtitle1">Total de plată :</Typography>
                                <Typography variant="subtitle1">{selectedBursa.cuantum}</Typography>
                               </Stack>
                            </Grid>
                       
                      </>
                    );
                  }}
                />
              </Grid>

              <Grid subitem xs={12} >
                <Stack direction="row" justifyContent="flex-end" alignItems="flex-end" spacing={2} sx={{ height: '100%' }} mb={2}>
                 
                  <Button color="primary" variant="contained" onClick={handleSubmitData}>
                    Creare & Trimitere                  </Button>
                  <InvoiceModal
                    isOpen={invoiceMaster.isOpen}
                    setIsOpen={(value) => handlerPreview(value)}
                    key={values.invoice_id}
                    invoiceInfo={{
                      ...values,
                      subtotal,
                      taxRate,
                      discountRate,
                      total
                    }}
                    items={values?.invoice_detail}
                    onAddNextInvoice={() => handlerPreview(false)}
                  />
                </Stack>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

CreateForm.propTypes = {
  lists: PropTypes.array,
  invoiceMaster: PropTypes.object
};

// ==============================|| INVOICE - CREATE ||============================== //

export default function Create() {
  const { invoice } = useGetInvoice();
  const { invoiceMasterLoading, invoiceMaster } = useGetInvoiceMaster();

  const isLoader = invoiceMasterLoading || invoiceMaster === undefined;
  const loader = (
    <Box sx={{ height: 'calc(100vh - 310px)' }}>
      <CircularLoader />
    </Box>
  );

  let breadcrumbLinks = [
    { title: 'Anunțuri', to: APP_DEFAULT_PATH },
    { title: 'Facturi', to: '/apps/factura/dashboard' },
    { title: 'Creare factură' }
  ];

  return (
    <>
      <Breadcrumbs custom heading="Factură nouă" links={breadcrumbLinks} />
      <MainCard>{isLoader ? loader : <CreateForm {...{ lists: invoice, invoiceMaster }} />}</MainCard>
    </>
  );
}
