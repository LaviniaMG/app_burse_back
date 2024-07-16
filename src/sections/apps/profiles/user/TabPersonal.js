'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/legacy/image';
import {
  Autocomplete,
  Box,
  CardHeader,
  Divider,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Button,
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import MainCard from '../../../../components/MainCard';
import { openSnackbar } from '../../../../api/snackbar';
import countries from '../../../../data/countries';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
    }
  }
};

const TabPersonal = () => {
  const [initialValues, setInitialValues] = useState(null);
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);
  const inputRef = useRef();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/studenti/1');
        const data = await response.json();
        setInitialValues({
          Nume: data.utilizator.Nume || '',
          Prenume: data.utilizator.Prenume || '',
          Email: data.utilizator.Email || '',
          dob: data.utilizator.DataNastere ? new Date(data.utilizator.DataNastere) : maxDate,
          Telefon: data.utilizator.Telefon || '',
          InitialaTata: data.utilizator.InitialaTata || '',
          facultate: data.facultate.facultate || '',
          specializare: data.facultate.specializare || '',
          anFacultate: data.anFacultate.toString() || '',
          Media: data.media.toString() || '',
          note: data.utilizator.Note || '',
          submit: null
        });
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchStudentData();
  }, []);

  const handleChangeDay = (event, date, setFieldValue) => {
    setFieldValue('dob', new Date(date.setDate(parseInt(event.target.value, 10))));
  };

  const handleChangeMonth = (event, date, setFieldValue) => {
    setFieldValue('dob', new Date(date.setMonth(parseInt(event.target.value, 10))));
  };

  if (!initialValues) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <MainCard content={false} title="Informații" sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}>
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          Nume: Yup.string().max(255).required('Numele este obligatoriu.'),
          Prenume: Yup.string().max(255).required('Prenumele este obligatoriu.'),
          Email: Yup.string().email('Email invalid.').max(255).required('Email-ul este obligatoriu.'),
          dob: Yup.date().max(maxDate, 'Age should be 18+ years.').required('Data de nastere este obligatorie.'),
          Telefon: Yup.string().required('Telefonul este obligatoiu'),
          facultate: Yup.string().required('Facultatea este obligatorie.'),
          specializare: Yup.string().required('Specializarea este obligatorie.'),
          anFacultate: Yup.string().required('Anul de facultate este obligatoriu.'),
          Media: Yup.string().required('Media este obligatorie.'),
          note: Yup.string().min(150, 'Not shoulde be more then 150 char.')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            const id=1;
            const response = await fetch(`http://localhost:8080/api/studenti/${id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(values)
            });

            if (!response.ok) {
              throw new Error('Error updating student data');
            }

            openSnackbar({
              open: true,
              message: 'Informatiile personale au fost incarcate cu succes.',
              variant: 'alert',
              alert: {
                color: 'success'
              }
            });

            setStatus({ success: true });
            setSubmitting(false);
          } catch (err) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, setFieldValue, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Box sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="personal-first-name">Nume</InputLabel>
                    <TextField
                      fullWidth
                      id="personal-first-name"
                      value={values.Nume}
                      name="Nume"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Nume"
                      autoFocus
                      inputRef={inputRef}
                    />
                  </Stack>
                  {touched.Nume && errors.Nume && (
                    <FormHelperText error id="personal-first-name-helper">
                      {errors.Nume}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="personal-last-name">Prenume</InputLabel>
                    <TextField
                      fullWidth
                      id="personal-last-name"
                      value={values.Prenume}
                      name="Prenume"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Prenume"
                    />
                  </Stack>
                  {touched.Prenume && errors.Prenume && (
                    <FormHelperText error id="personal-last-name-helper">
                      {errors.Prenume}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="personal-Email">Inițiala tatălui</InputLabel>
                    <TextField
                      type="InitialaTata"
                      fullWidth
                      value={values.InitialaTata}
                      name="InitialaTata"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      id="personal-InitialaTata"
                      placeholder="Inițiala tatălui"
                    />
                  </Stack>
                  {touched.InitialaTata && errors.InitialaTata && (
                    <FormHelperText error id="personal-InitialaTata-helper">
                      {errors.InitialaTata}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="personal-Email">Email</InputLabel>
                    <TextField
                      type="Email"
                      fullWidth
                      value={values.Email}
                      name="Email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      id="personal-Email"
                      placeholder="Email"
                    />
                  </Stack>
                  {touched.Email && errors.Email && (
                    <FormHelperText error id="personal-Email-helper">
                      {errors.Email}
                    </FormHelperText>
                  )}
                </Grid>
              
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="personal-phone">Telefon</InputLabel>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                      <TextField
                        fullWidth
                        id="personal-Telefon"
                        value={values.Telefon}
                        name="Telefon"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Telefon"
                      />
                    </Stack>
                  </Stack>
                  {touched.Telefon && errors.Telefon && (
                    <FormHelperText error id="personal-Telefon-helper">
                      {errors.Telefon}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>
            </Box>
            <CardHeader title="Detalii" />
            <Divider />
            <Box sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="personal-anFacultate">Facultatea</InputLabel>
                    <TextField
                      fullWidth
                      id="personal-anFacultate"
                      value={values.facultate}
                      name="facultate"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Facultatea"
                    />
                  </Stack>
                  {touched.facultate && errors.facultate && (
                    <FormHelperText error id="personal-anFacultate-helper">
                      {errors.facultate}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="personal-anFacultate">Specializarea</InputLabel>
                    <TextField
                      fullWidth
                      id="personal-anFacultate"
                      value={values.specializare}
                      name="specializare"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Specializarea"
                    />
                  </Stack>
                  {touched.specializare && errors.specializare && (
                    <FormHelperText error id="personal-anFacultate-helper">
                      {errors.specializare}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="personal-date">Anul de facultate</InputLabel>
                    <TextField
                      fullWidth
                      id="personal-anFacultate"
                      value={values.anFacultate}
                      name="anFacultate"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Anul de facultate"
                    />
                  </Stack>
                  {touched.anFacultate && errors.anFacultate && (
                    <FormHelperText error id="personal-anFacultate-helper">
                      {errors.anFacultate}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="personal-Media">Media</InputLabel>
                    <TextField
                      fullWidth
                      id="personal-Media"
                      value={values.Media}
                      name="Media"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Media"
                    />
                  </Stack>
                  {touched.Media && errors.Media && (
                    <FormHelperText error id="personal-Media-helper">
                      {errors.Media}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ p: 2.5 }}>
              <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
                <Button disabled={isSubmitting} type="submit" variant="contained">
                  Salvare
                </Button>
              </Stack>
            </Box>
          </form>
        )}
      </Formik>
    </MainCard>
  );
};

export default TabPersonal;
