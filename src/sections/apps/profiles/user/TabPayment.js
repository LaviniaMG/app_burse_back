'use client';

import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { openSnackbar } from '../../../../api/snackbar';

// next
import Image from 'next/image';

// material-ui
import {
  Box,
  Button,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { PatternFormat } from 'react-number-format';

// project import
import IconButton from '../../../../components/@extended/IconButton';
import MainCard from '../../../../components/MainCard';

// assets
import { DeleteOutlined, EyeOutlined, EyeInvisibleOutlined, PlusOutlined } from '@ant-design/icons';

const masterCard = '/assets/images/icons/master-card.png';
const visaCard = '/assets/images/icons/visa-card.png';

// style & constant
const buttonStyle = { color: 'text.primary', fontWeight: 600 };

// ==============================|| PAYMENT - CARD ||============================== //

const PaymentCard = ({ card, onDelete }) => {
  const { idCont, Titular, IBAN, SWIFT, numeBanca, Moneda } = card;

  return (
    <MainCard content={false} boxShadow sx={{ cursor: 'pointer' }}>
      <Box sx={{ p: 2 }}>
        <FormControlLabel
          value={idCont}
          control={<Radio value={idCont} />}
          sx={{ display: 'flex', '& .MuiFormControlLabel-label': { flex: 1 } }}
          label={
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Stack spacing={0.5} sx={{ ml: 1 }}>
                  <Typography color="secondary">{Titular}</Typography>
                  <Typography variant="subtitle1">
                    <PatternFormat value={IBAN} displayType="text" format="#### #### #### #### ####" />
                  </Typography>
                  <Typography variant="subtitle2">
                    {numeBanca} - {Moneda}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item>
                <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={1}>
                <Image
                    src={visaCard}
                    alt="payment card"
                    width={ 30}
                    height={ 30}
                    style={{
                      maxWidth: '100%',
                      height: 'auto'
                    }}
                  />
                  <IconButton color="secondary" onClick={() => onDelete(idCont)}>
                    <DeleteOutlined />
                  </IconButton>
                </Stack>
              </Grid>
            </Grid>
          }
        />
      </Box>
    </MainCard>
  );
};

PaymentCard.propTypes = {
  card: PropTypes.object,
  onDelete: PropTypes.func
};

// ==============================|| TAB - PAYMENT ||============================== //

const TabPayment = () => {
  const [cards, setCards] = useState([]);
  const [method, setMethod] = useState('card');
  const [value, setValue] = useState('');
  const [expiry, setExpiry] = useState(new Date());
  const [showPassword, setShowPassword] = useState(false);

  const fetchCards = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/conturi');
      setCards(response.data);
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleRadioChange = (event) => {
    setValue(event.target.value);
  };

  const handleDeleteCard = async (idCont) => {
    try {
      await axios.delete(`http://localhost:8080/api/conturi/${idCont}`);
      setCards((prevCards) => prevCards.filter((card) => card.idCont !== idCont));
      openSnackbar({
        open: true,
        message: 'Cardul a fost șters cu succes.',
        variant: 'alert',
        alert: {
          color: 'success'
        }
      });
    } catch (error) {
      console.error('Error deleting card:', error);
      openSnackbar({
        open: true,
        message: 'Eroare la ștergerea cardului.',
        variant: 'alert',
        alert: {
          color: 'error'
        }
      });
    }
  };

  const handleAddCard = async (values, actions) => {
    try {
      const formattedValues = {
        ...values,
        dataExpirare: new Date(values.dataExpirare).toISOString()
      };

      console.log("Values being sent to backend:", formattedValues);

      const response = await axios.post('http://localhost:8080/api/conturi', formattedValues);

      console.log("Response from backend:", response.data);

      setCards((prevCards) => [...prevCards, response.data]);
      openSnackbar({
        open: true,
        message: 'Cardul a fost adăugat cu succes.',
        variant: 'alert',
        alert: {
          color: 'success'
        }
      });
      actions.resetForm();
      setMethod('card');
    } catch (error) {
      console.error('Error adding card:', error);

      openSnackbar({
        open: true,
        message: error.response?.data?.message || 'Eroare la adăugarea cardului.',
        variant: 'alert',
        alert: {
          color: 'error'
        }
      });
      actions.setSubmitting(false);
    }
  };
  return (
    <MainCard title="Detalii bancare">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack spacing={1.25} direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1} />
            <Button
              variant="contained"
              startIcon={<PlusOutlined />}
              onClick={() => setMethod(method !== 'add' ? 'add' : method)}
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              Adaugă o nouă plată
            </Button>
          </Stack>
        </Grid>
        {method === 'card' && (
          <>
            <Grid item xs={12}>
              <RadioGroup row aria-label="payment-card" name="payment-card" value={value} onChange={handleRadioChange}>
                <Grid item xs={12} container spacing={2.5}>
                  {cards.map((card, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <PaymentCard card={card} onDelete={handleDeleteCard} />
                    </Grid>
                  ))}
                </Grid>
              </RadioGroup>
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
                <Button variant="contained">Salvare</Button>
              </Stack>
            </Grid>
          </>
        )}
        {method === 'add' && (
          <Grid item xs={12}>
            <Formik
              initialValues={{
                Titular: '',
                numeBanca: '',
                IBAN: '',
                dataExpirare: new Date(),
                CIF: '',
                SWIFT: '',
                Moneda: '',
                submit: null
              }}
              validationSchema={Yup.object().shape({
                Titular: Yup.string().required('Numele titularului este obligatoriu'),
                numeBanca: Yup.string().required('Numele băncii este obligatoriu'),
                IBAN: Yup.string().required('IBAN-ul este obligatoriu'),
                CIF: Yup.string().required('CIF este obligatoriu'),
                SWIFT: Yup.string().required('Codul SWIFT este obligatoriu'),
                Moneda: Yup.string().required('Moneda este obligatorie').oneOf(['USD', 'EUR', 'GBP', 'RON'], 'Moneda trebuie să fie una dintre: USD, EUR, GBP, RON')
              })}
              onSubmit={handleAddCard}
            >
              {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, setFieldValue, touched, values }) => (
                <form noValidate onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="payment-card-Titular">Numele titularului</InputLabel>
                        <TextField
                          fullWidth
                          id="payment-card-Titular"
                          value={values.Titular}
                          name="Titular"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="Numele titularului"
                          error={touched.Titular && Boolean(errors.Titular)}
                          helperText={touched.Titular && errors.Titular}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="payment-card-bankName">Numele băncii</InputLabel>
                        <TextField
                          fullWidth
                          id="payment-card-bankName"
                          value={values.numeBanca}
                          name="numeBanca"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="Numele băncii"
                          error={touched.numeBanca && Boolean(errors.numeBanca)}
                          helperText={touched.numeBanca && errors.numeBanca}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="payment-card-number">IBAN</InputLabel>
                        <PatternFormat
                          id="payment-card-number"
                          value={values.IBAN}
                          name="IBAN"
                          format="####################"
                          prefix=""
                          fullWidth
                          customInput={TextField}
                          placeholder="IBAN"
                          onBlur={handleBlur}
                          onValueChange={(values) => {
                            const { value } = values;
                            setFieldValue('IBAN', value);
                          }}
                          onChange={handleChange}
                          error={touched.IBAN && Boolean(errors.IBAN)}
                          helperText={touched.IBAN && errors.IBAN}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
  <Stack spacing={1}>
    <InputLabel htmlFor="payment-card-expiry">Data de expirare</InputLabel>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        views={['month', 'year']}
        value={expiry}
        minDate={new Date()}
        onChange={(newValue) => {
          console.log('Selected date:', newValue); // Verifică valoarea lui newValue
          setExpiry(newValue);
          setFieldValue('dataExpirare', newValue);
        }}
        format="MM/yyyy"
        renderInput={(params) => <TextField {...params} fullWidth />}
      />
    </LocalizationProvider>
  </Stack>
</Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="payment-card-cif">CIF</InputLabel>
                        <PatternFormat
                          id="payment-card-cif"
                          value={values.CIF}
                          name="CIF"
                          format="#####"
                          prefix=""
                          fullWidth
                          customInput={TextField}
                          placeholder="CIF"
                          onBlur={handleBlur}
                          onValueChange={(values) => {
                            const { value } = values;
                            setFieldValue('CIF', value);
                          }}
                          onChange={handleChange}
                          error={touched.CIF && Boolean(errors.CIF)}
                          helperText={touched.CIF && errors.CIF}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="payment-card-swift">SWIFT</InputLabel>
                        <OutlinedInput
                          placeholder="Introdu codul SWIFT"
                          id="payment-card-swift"
                          type={showPassword ? 'text' : 'password'}
                          value={values.SWIFT}
                          name="SWIFT"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                                size="large"
                                color="secondary"
                              >
                                {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                              </IconButton>
                            </InputAdornment>
                          }
                          autoComplete="swift-code"
                          error={touched.SWIFT && Boolean(errors.SWIFT)}
                          helperText={touched.SWIFT && errors.SWIFT}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="payment-card-currency">Moneda</InputLabel>
                        <TextField
                          id="payment-card-currency"
                          value={values.Moneda}
                          name="Moneda"
                          placeholder="Moneda"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={touched.Moneda && Boolean(errors.Moneda)}
                          helperText={touched.Moneda && errors.Moneda}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
                        <Button variant="outlined" color="secondary" onClick={() => setMethod('card')}>
                          Renuntare
                        </Button>
                        <Button disabled={isSubmitting || Object.keys(errors).length !== 0} type="submit" variant="contained">
                          Salvare
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </form>
              )}
            </Formik>
          </Grid>
        )}
      </Grid>
    </MainCard>
  );
};

export default TabPayment;
