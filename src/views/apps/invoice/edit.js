'use client';;
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// next
import { useRouter } from 'next/navigation';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { format } from 'date-fns';
import { FieldArray, Form, Formik } from 'formik';
import * as yup from 'yup';

// project import
import MainCard from '../../../components/MainCard';
import CircularLoader from '../../../components/CircularLoader';
import Breadcrumbs from '../../../components/@extended/Breadcrumbs';
import InvoiceItem from '../../../sections/apps/invoice/InvoiceItem';
import InvoiceModal from '../../../sections/apps/invoice/InvoiceModal';
import AddressModal from '../../../sections/apps/invoice/AddressModal';

import { APP_DEFAULT_PATH } from '../.././../config';
import {
  handlerCustomerTo,
  handlerPreview,
  updateInvoice,
  useGetInvoice,
  useGetInvoiceMaster,
} from '../../../api/invoice';
import { openSnackbar } from '../../../api/snackbar';
import { handlerActiveItem, useGetMenuMaster } from '../../../api/menu';

//asset
import { PlusOutlined } from '@ant-design/icons';

const validationSchema = yup.object({
  date: yup.date().required('Data este obligatorie'),
  due_date: yup
    .date()
    .when('date', (date, schema) => date && schema.min(date, "Data de final trebuie sa fie după data de început"))
    .nullable()
    .required('Data de final este obligatorie'),
  customerInfo: yup
    .object({
      name: yup.string().required('Trebuie selectată o bursă')
    })
    .required('Trebuie selectată o bursă'),
  status: yup.string().required('Status-ul trebuie selectat')
});

const invoiceSingleList = {
  name: '',
  address: '',
  phone: '',
  email: ''
};

// ==============================|| INVOICE EDIT - FORM ||============================== //

const EditForm = ({ list, invoiceMaster }) => {
  const theme = useTheme();
  const router = useRouter();

  const notesLimit = 500;
  const handlerEdit = (values) => {
    const newList = {
      id: Number(list.id),
      invoice_id: Number(values.invoice_id),
      customer_name: values.cashierInfo?.name,
      email: values.cashierInfo?.email,
      avatar: Number(list.avatar),
      discount: Number(values.discount),
      tax: Number(values.tax),
      date: format(new Date(values.date), 'MM/dd/yyyy'),
      due_date: format(new Date(values.due_date), 'MM/dd/yyyy'),
      quantity: Number(
        values.invoice_detail?.reduce((sum, i) => {
          return sum + i.qty;
        }, 0)
      ),
      status: values.status,
      cashierInfo: values.cashierInfo,
      customerInfo: values.customerInfo,
      invoice_detail: values.invoice_detail,
      notes: values.notes
    };

    updateInvoice(newList.id, newList);
    openSnackbar({
      open: true,
      message: 'Factura a fost editată cu succes',
      anchorOrigin: { vertical: 'top', horizontal: 'right' },
      variant: 'alert',
      alert: {
        color: 'success'
      },
      close: true
    });
    router.push('/apps/factura/list');
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        id: list.id || '',
        invoice_id: list.invoice_id || '',
        status: list.status || '',
        date: new Date(list.date) || null,
        due_date: new Date(list.due_date) || null,
        cashierInfo: list.cashierInfo || invoiceSingleList,
        customerInfo: list.customerInfo || invoiceSingleList,
        invoice_detail: list.invoice_detail || [],
        discount: list.discount || 0,
        tax: list.tax || 0,
        notes: list.notes || ''
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        handlerEdit(values);
      }}
    >
      {({ handleBlur, errors, handleChange, handleSubmit, values, isValid, setFieldValue, touched }) => {
        const subtotal =
          values?.invoice_detail?.reduce((prev, curr) => {
        return prev + Number(curr.price );
        
          }, 0) || 0;
        const taxRate = (values?.tax * subtotal) / 100;
        const discountRate = (values.discount * subtotal) / 100;
        const total = subtotal;

        return (
          <Form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Stack spacing={1}>
                  <InputLabel>Id factură</InputLabel>
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
                          return <Box sx={{ color: 'secondary.400' }}>Selectare status</Box>;
                        }
                        return selected;
                      }}
                      onChange={handleChange}
                      error={Boolean(errors.status && touched.status)}
                    >
                      <MenuItem disabled value="">
                        Selectare status
                      </MenuItem>
                      <MenuItem value="Plătit">Plătit</MenuItem>
                      <MenuItem value="În aștepare">În aștepare</MenuItem>
                      <MenuItem value="Refuzat">Refuzat</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
                {touched.status && errors.status && <FormHelperText error={true}>{errors.status}</FormHelperText>}
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Stack spacing={1}>
                  <InputLabel>Data de început</InputLabel>
                  <FormControl sx={{ width: '100%' }} error={Boolean(touched.date && errors.date)}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker format="dd/MM/yyyy" value={values.date} onChange={(newValue) => setFieldValue('date', newValue)} />
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
                        value={values.due_date}
                        onChange={(newValue) => setFieldValue('due_date', newValue)}
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
                          <Typography variant="subtitle1">{values?.customerInfo?.name}</Typography>
                           </Stack>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box textAlign="right" color="grey.200">
                        <Button
                          size="small"
                          startIcon={<PlusOutlined />}
                          color="secondary"
                          variant="outlined"
                          onClick={() => handlerCustomerTo(true)}
                        >
                          Adăugați
                        </Button>
                        <AddressModal
                          open={invoiceMaster.isCustomerOpen}
                          setOpen={(value) => handlerCustomerTo(value)}
                          handlerAddress={(value) => setFieldValue('customerInfo', value)}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </MainCard>
                {touched.customerInfo && errors.customerInfo && <FormHelperText error={true}>{errors?.customerInfo?.name}</FormHelperText>}
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h5">Detalii</Typography>
              </Grid>
              <Grid item xs={12}>
                <FieldArray
                  name="invoice_detail"
                  render={({ remove, push }) => {
                    return (
                      <>
                        <TableContainer>
                          <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                              <TableRow>
                                <TableCell>#</TableCell>
                               
                                <TableCell align="center">Valoare</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody >
                              {values?.invoice_detail?.map((item, index) => (
                                <TableRow key={item.id}>
                                  <TableCell >{values?.invoice_detail.indexOf(item) + 1}</TableCell>
                                  <InvoiceItem
                                    key={item.id}
                                    id={item.id}
                                    index={index}
                                    name={item.name}
                                    description={item.description}
                                    qty={item.qty}
                                    price={item.price}
                                    onDeleteItem={(index) => remove(index)}
                                    onEditItem={handleChange}
                                    Blur={handleBlur}
                                    errors={errors}
                                    touched={touched} 
                                  />
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                        <Divider />
                        {touched.invoice_detail && errors.invoice_detail && !Array.isArray(errors?.invoice_detail) && (
                          <Stack direction="row" justifyContent="center" sx={{ p: 1.5 }}>
                            <FormHelperText error={true}>{errors.invoice_detail}</FormHelperText>
                          </Stack>
                        )}
                 
                      </>
                    );
                  }}
                />
              </Grid>
              <Grid item xs={12}>
               
                <Stack direction="row" justifyContent="space-between">
                                  <Typography variant="subtitle1">Total de plată:</Typography>
                                  <Typography variant="subtitle1">
                                    {' '}
                                    {total % 1 === 0
                                      ? 'LEI ' + total
                                      : 'LEI ' + total.toFixed(2)}
                                  </Typography>
                                </Stack>
             
              </Grid>
             
              <Grid item xs={12} >
                <Stack direction="row" justifyContent="flex-end" alignItems="flex-end" spacing={2} sx={{ height: '100%' }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    disabled={!isValid}
                    sx={{ color: 'secondary.dark' }}
                    onClick={() => handlerPreview(true)}
                  >
                    Previzualizare
                  </Button>
                  <Button color="primary" variant="contained" type="submit">
                    Editare & Trimitere
                  </Button>
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

EditForm.propTypes = {
  list: PropTypes.object,
  invoiceMaster: PropTypes.object
};

// ==============================|| INVOICE - EDIT ||============================== //

const EditInvoice = ({ id }) => {
  const { menuMaster } = useGetMenuMaster();
  const { invoiceLoading, invoice } = useGetInvoice();
  const { invoiceMasterLoading, invoiceMaster } = useGetInvoiceMaster();
  const [list, seList] = useState(null);

  useEffect(() => {
    if (menuMaster.openedItem !== 'invoice-edit') handlerActiveItem('invoice-edit');
    if (id && !invoiceLoading) {
      seList(invoice.filter((item) => item.id.toString() === id)[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, invoiceLoading]);

  const loader = (
    <Box sx={{ height: 'calc(100vh - 310px)' }}>
      <CircularLoader />
    </Box>
  );

  let breadcrumbLinks = [{ title: 'Anunțuri', to: APP_DEFAULT_PATH }, { title: 'Facturi', to: '/apps/factura/dashboard' }, { title: 'Editare' }];

  const isLoader = invoiceLoading || invoiceMasterLoading || invoiceMaster === undefined || list === null;

  return (
    <>
      <Breadcrumbs custom heading="Factură nouă" links={breadcrumbLinks} />
      <MainCard>{isLoader ? loader : <EditForm {...{ list: list, invoiceMaster }} />}</MainCard>
    </>
  );
};

EditInvoice.propTypes = {
  id: PropTypes.string
};

export default EditInvoice;
