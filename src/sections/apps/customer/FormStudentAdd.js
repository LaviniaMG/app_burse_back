import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { CloudUploadOutlined } from '@ant-design/icons';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
  InputAdornment,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import AlertStudentDelete from './AlertCustomerDelete'; // Actualizați calea conform structurii dvs.
import Avatar from '../../../components/@extended/Avatar';
import CircularWithPath from '../../../components/@extended/progress/CircularWithPath';
import { openSnackbar } from '../../../api/snackbar';
import { ThemeMode } from '../../../config';
import { CameraOutlined, DeleteFilled } from '@ant-design/icons';

const FormStudentAdd = ({ students, closeModal }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [faculties, setFaculties] = useState([]);
  const [userTypes, setUserTypes] = useState([]);
  const [bursas, setBursas] = useState([]);
  const [selectedImage, setSelectedImage] = useState(undefined);
  const [selectedStatusId, setSelectedStatusId] = useState('');
  const [fileName, setFileName] = useState('');

  const [avatar, setAvatar] = useState(
    `/assets/images/users/avatar-${students && students !== null && students?.URLPoza ? students.URLPoza : 1}.png`
  );

  const fetchFaculties = async () => {
    const response = await fetch('http://localhost:8080/api/facultate');
    if (!response.ok) {
      throw new Error('Failed to fetch faculties');
    }
    return response.json();
  };

  const fetchUserTypes = async () => {
    const response = await fetch('http://localhost:8080/api/tipuriUtilizatori');
    if (!response.ok) {
      throw new Error('Failed to fetch user types');
    }
    return response.json();
  };

  const fetchBursas = async () => {
    const response = await fetch('http://localhost:8080/api/tipBursa');
    if (!response.ok) {
      throw new Error('Failed to fetch bursas');
    }
    return response.json();
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [facultiesData, userTypesData, bursasData] = await Promise.all([fetchFaculties(), fetchUserTypes(), fetchBursas()]);
        setFaculties(facultiesData);
        setUserTypes(userTypesData);
        setBursas(bursasData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const [initialValues, setInitialValues] = useState({
    CNP: '',
    Nume: '',
    Prenume: '',
    InitialaTata: '',
    Telefon: '',
    Email: '',
    Parola: '',
    idTipUtilizator: '',
    idFacultate: '',
    anFacultate: '',
    media: '',
    restanta: '',
    idBursa: '',
    status:' ',
    document: null
  });

  useEffect(() => {
    if (selectedImage) {
      setAvatar(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  useEffect(() => {
    if (students) {
      const getStatusId = () => {
        // Verifică dacă există 'solicitari' și dacă are elemente
        if (students.utilizator.solicitari && students.utilizator.solicitari.length > 0) {
          return students.utilizator.solicitari[0].idStatus; // Returnează primul idStatus dacă există
        }
        return ''; // Dacă nu există solicitări, întoarce un default, de exemplu 1
      };
      
      setInitialValues({
        CNP: students.utilizator.CNP || '',
        Nume: students.utilizator.Nume || '',
        Prenume: students.utilizator.Prenume || '',
        InitialaTata: students.utilizator.InitialaTata || '',
        Telefon: students.utilizator.Telefon || '',
        Email: students.utilizator.Email || '',
        Parola: students.utilizator.Parola || '',
        idTipUtilizator: students.utilizator.idTipUtilizator || '',
        idFacultate: students.idFacultate || '',
        anFacultate: students.anFacultate || '',
        media: students.media || '',
        status: getStatusId(), // Folosește funcția pentru a obține idStatus în mod sigur
        restanta: students.restanta ? 1 : 0,
        idBursa: '',
        document: null
      });
    }      
  }, [students]);

  const validationSchema = Yup.object().shape({
    CNP: Yup.string().matches(/^[0-9]{13}$/, 'CNP trebuie să aibă 13 cifre').required('CNP este obligatoriu'),
    Nume: Yup.string().max(255).required('Numele este obligatoriu'),
    Prenume: Yup.string().max(255).required('Prenumele este obligatoriu'),
    Email: Yup.string().email('Trebuie să fie un email valid').max(255).required('Emailul este obligatoriu'),
    anFacultate: Yup.number().min(1).max(4).required('Anul facultății este obligatoriu'),
    media: Yup.number().min(0).max(10).required('Media este obligatorie'),
    idTipUtilizator: Yup.number().required('Tipul utilizatorului este obligatoriu'),
    idFacultate: Yup.string().max(255).required('Facultatea este obligatorie'),
    InitialaTata: Yup.string(),
    Telefon: Yup.string().required('Telefon is required'),
    Parola: Yup.string().required('Parola is required'),
    restanta: Yup.string().required('Restanta is required'),
    ...(students ? {} : {
      idBursa: Yup.number().required('Tipul bursei este obligatoriu'),
      document: Yup.mixed().required('Documentul este obligatoriu')
    })
  });

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    closeModal();
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      console.log('Submitting form:', values);
      try {
        if (students) {
          const updatedStudent = await updateStudentData(students.id, values);
          handleSuccess(updatedStudent);
        } else {
          const insertedStudent = await insertStudentData(values);
          
          const selectedBursa = bursas.find(bursa => bursa.idBursa === values.idBursa);
          const denumireBursa = selectedBursa ? selectedBursa.denumire : '';
          console.log(selectedBursa);
          console.log(bursas.idBursa);
          console.log(values.idBursa);
          console.log(bursas);
          console.log(denumireBursa);
          let solicitariFormData = new FormData();
          solicitariFormData.append('idUtilizator', insertedStudent.newUser.idUtilizator);
          solicitariFormData.append('idBursa', values.idBursa);
          solicitariFormData.append('denumireBursa', denumireBursa);
          solicitariFormData.append('file', values.document);
          
          await fetch('http://localhost:8080/api/solicitari', {
            method: 'POST',
            body: solicitariFormData,
          });
          handleSuccess(insertedStudent);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setSubmitting(false);
        closeModal();
      }
    }
});

  const updateStudentData = async (studentId, studentData) => {
    console.log('Updating student with id:', studentId, 'and data:', studentData);
    try {
      const response = await fetch(`http://localhost:8080/api/studenti/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        throw new Error('Failed to update student');
      }

      const updatedStudent = await response.json();
      return updatedStudent;
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  };

  const insertStudentData = async (studentData) => {
    console.log('Inserting new student with data:', studentData);
    try {
      const response = await fetch('http://localhost:8080/api/studenti', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        throw new Error('Failed to insert student');
      }

      const insertedStudent = await response.json();
      return insertedStudent;
    } catch (error) {
      console.error('Error inserting student:', error);
      throw error;
    }
  };
  const statusuri = [
    { id: 1, denumire: 'Acceptat' },
    { id: 2, denumire: 'Refuzat' },
    { id: 3, denumire: 'În așteptare' }
  ];
  
  const handleSuccess = (studentData) => {
    const successMessage = students ? 'Student actualizat cu succes!' : 'Student adăugat cu succes!';
    openSnackbar({
      open: true,
      message: successMessage,
      variant: 'alert',
      alert: {
        color: 'success',
      },
    });
  };

  const { errors, touched, handleSubmit: formikHandleSubmit, isSubmitting, getFieldProps, setFieldValue, values } = formik;

  if (loading)
    return (
      <Box sx={{ p: 5 }}>
        <Stack direction="row" justifyContent="center">
          <CircularWithPath />
        </Stack>
      </Box>
    );

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form autoComplete="off" noValidate onSubmit={formikHandleSubmit} >
            <DialogTitle>{students ? 'Editare student' : 'Student nou'}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
                    <FormLabel
                      htmlFor="change-avtar"
                      sx={{
                        position: 'relative',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        '&:hover .MuiBox-root': { opacity: 1 },
                        cursor: 'pointer',
                      }}
                    >
                      <Avatar alt="Avatar 1" src={avatar} sx={{ width: 72, height: 72, border: '1px dashed' }} />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          backgroundColor:
                            theme.palette.mode === ThemeMode.DARK ? 'rgba(255, 255, 255, .75)' : 'rgba(0,0,0,.65)',
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Stack spacing={0.5} alignItems="center">
                          <CameraOutlined style={{ color: theme.palette.secondary.lighter, fontSize: '2rem' }} />
                          <Typography sx={{ color: 'secondary.lighter' }}>Încărcați</Typography>
                        </Stack>
                      </Box>
                    </FormLabel>
                    <TextField
                      type="file"
                      id="change-avtar"
                      variant="outlined"
                      sx={{ display: 'none' }}
                      onChange={(e) => setSelectedImage(e.target.files?.[0])}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="CNP"
                        {...getFieldProps('CNP')}
                        error={Boolean(touched.CNP && errors.CNP)}
                        helperText={touched.CNP && errors.CNP}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Nume"
                        {...getFieldProps('Nume')}
                        error={Boolean(touched.Nume && errors.Nume)}
                        helperText={touched.Nume && errors.Nume}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Prenume"
                        {...getFieldProps('Prenume')}
                        error={Boolean(touched.Prenume && errors.Prenume)}
                        helperText={touched.Prenume && errors.Prenume}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Initiala Tata"
                        {...getFieldProps('InitialaTata')}
                        error={Boolean(touched.InitialaTata && errors.InitialaTata)}
                        helperText={touched.InitialaTata && errors.InitialaTata}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Telefon"
                        {...getFieldProps('Telefon')}
                        error={Boolean(touched.Telefon && errors.Telefon)}
                        helperText={touched.Telefon && errors.Telefon}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        {...getFieldProps('Email')}
                        error={Boolean(touched.Email && errors.Email)}
                        helperText={touched.Email && errors.Email}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Parola"
                        type="password"
                        {...getFieldProps('Parola')}
                        error={Boolean(touched.Parola && errors.Parola)}
                        helperText={touched.Parola && errors.Parola}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel id="select-idTipUtilizator">Tip Utilizator</InputLabel>
                        <Select
                          labelId="select-idTipUtilizator"
                          {...getFieldProps('idTipUtilizator')}
                          error={Boolean(touched.idTipUtilizator && errors.idTipUtilizator)}
                          input={<OutlinedInput label="Tip Utilizator" />}
                        >
                          <MenuItem value="">
                            <ListItemText primary="Alegeți tipul de utilizator" />
                          </MenuItem>
                          {userTypes.map((type) => (
                            <MenuItem key={type.idUtilizator} value={type.idUtilizator}>
                              <ListItemText primary={type.denumire} />
                            </MenuItem>
                          ))}
                        </Select>
                        {touched.idTipUtilizator && errors.idTipUtilizator && (
                          <FormHelperText error>{errors.idTipUtilizator}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel id="select-idFacultate">Facultate</InputLabel>
                        <Select
                          labelId="select-idFacultate"
                          {...getFieldProps('idFacultate')}
                          error={Boolean(touched.idFacultate && errors.idFacultate)}
                          input={<OutlinedInput label="Facultate" />}
                        >
                          <MenuItem value="">
                            <ListItemText primary="Alegeți facultatea" />
                          </MenuItem>
                          {faculties.map((facultate) => (
                            <MenuItem key={facultate.id} value={facultate.id}>
                              <ListItemText primary={facultate.facultate} />
                            </MenuItem>
                          ))}
                        </Select>
                        {touched.idFacultate && errors.idFacultate && (
                          <FormHelperText error>{errors.idFacultate}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="An Facultate"
                        type="number"
                        {...getFieldProps('anFacultate')}
                        error={Boolean(touched.anFacultate && errors.anFacultate)}
                        helperText={touched.anFacultate && errors.anFacultate}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Media"
                        type="number"
                        {...getFieldProps('media')}
                        error={Boolean(touched.media && errors.media)}
                        helperText={touched.media && errors.media}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel id="select-restanta">Restanta</InputLabel>
                        <Select
                          labelId="select-restanta"
                          {...getFieldProps('restanta')}
                          error={Boolean(touched.restanta && errors.restanta)}
                          input={<OutlinedInput label="Restanta" />}
                        >
                          <MenuItem value={1}>
                            <ListItemText primary="Are restanta" />
                          </MenuItem>
                          <MenuItem value={0}>
                            <ListItemText primary="Nu are restanta" />
                          </MenuItem>
                        </Select>
                        {touched.restanta && errors.restanta && (
                          <FormHelperText error>{errors.restanta}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    {!students && (
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel id="select-idStatus">Status</InputLabel>
                          <Select
                            labelId="select-idStatus"
                            {...getFieldProps('idStatus')}
                            error={Boolean(touched.idStatus && errors.idStatus)}
                            input={<OutlinedInput label="Status" />}
                          >
                            <MenuItem value="">
                              <ListItemText primary="Alegeți statusul" />
                            </MenuItem>
                            {statusuri.map((status) => (
                              <MenuItem key={status.id} value={status.id}>
                                <ListItemText primary={status.denumire} />
                              </MenuItem>
                            ))}
                          </Select>
                          {touched.idStatus && errors.idStatus && (
                            <FormHelperText error>{errors.idStatus}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                    )}
                    {!students && (
                      <>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth>
                            <InputLabel id="select-idBursa">Tipul bursei</InputLabel>
                            <Select
                              labelId="select-idBursa"
                              {...getFieldProps('idBursa')}
                              error={Boolean(touched.idBursa && errors.idBursa)}
                              input={<OutlinedInput label="Tipul bursei" />}
                            >
                              <MenuItem value="">
                                <ListItemText primary="Alegeți tipul bursei" />
                              </MenuItem>
                              {bursas.map((bursa) => (
                                <MenuItem key={bursa.idBursa} value={bursa.idBursa}>
                                  <ListItemText primary={bursa.denumire} />
                                </MenuItem>
                              ))}
                            </Select>
                            {touched.idBursa && errors.idBursa && (
                              <FormHelperText error>{errors.idBursa}</FormHelperText>
                            )}
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12}>
                          <FormControl fullWidth>
                            <InputLabel id="document-label">Document</InputLabel>
                            <OutlinedInput
                              type="file"
                              id="document"
                              inputProps={{ accept: '.pdf,.doc,.docx' }}
                              onChange={(event) => {
                                setFieldValue('document', event.currentTarget.files[0]);
                                setFileName(event.currentTarget.files[0]?.name || ''); // Setează numele fișierului încărcat
                              }}
                              error={Boolean(touched.document && errors.document)}
                              sx={{ display: 'none' }} // Ascunde câmpul de fișier
                            />
                            <Button
                              variant="contained"
                              component="label"
                              htmlFor="document"
                              startIcon={<CloudUploadOutlined />}
                              sx={{
                                width: '100%',
                                height: '100px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#f5f5f5',
                                color: '#333',
                                '&:hover': {
                                  backgroundColor: '#e0e0e0',
                                },
                              }}
                            >
                              <Typography variant="h6">Încărcați un document</Typography>
                              <Typography variant="body2" sx={{ mt: 1 }}>Fișiere acceptate: .pdf, .doc, .docx</Typography>
                            </Button>
                            {touched.document && errors.document && (
                              <FormHelperText error>{errors.document}</FormHelperText>
                            )}
                            {fileName && (
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                Fișier încărcat: {fileName}
                              </Typography>
                            )}
                          </FormControl>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <Divider />
            <DialogActions>
              <Button color="error" onClick={handleAlertClose} startIcon={<DeleteFilled />}>
                {students ? 'Șterge' : 'Anulează'}
              </Button>
              <Button variant="contained" type="submit" disabled={isSubmitting}>
                {students ? 'Salvează modificările' : 'Adaugă student'}
              </Button>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
      {openAlert && <AlertStudentDelete open={openAlert} onClose={handleAlertClose} studentId={students?.id} />}
    </>
  );
};

FormStudentAdd.propTypes = {
  students: PropTypes.object,
  closeModal: PropTypes.func,
};

export default FormStudentAdd;
