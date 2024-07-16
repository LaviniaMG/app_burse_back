'use client';

import PropTypes from 'prop-types';
import React from 'react';

// next
import Image from 'next/legacy/image';
import NextLink from 'next/link';
import { signIn } from 'next-auth/react';

// material-ui
import {
  Box,
  useMediaQuery,
  Button,
  Divider,
  FormHelperText,
  FormControl,
  Grid,
  Link,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import FirebaseSocial from './FirebaseSocial';
import { APP_DEFAULT_PATH } from '../../../config';
import IconButton from '../../../components/@extended/IconButton';
import AnimateButton from '../../../components/@extended/AnimateButton';
import { strengthColor, strengthIndicator } from '../../../utils/password-strength';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const Auth0 = '/assets/images/icons/auth0.svg';
const Cognito = '/assets/images/icons/aws-cognito.svg';
const Google = '/assets/images/icons/google.svg';

// ============================|| AWS CONNITO - LOGIN ||============================ //

const AuthRegister = ({ providers, csrfToken }) => {
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const [level, setLevel] = React.useState();
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  React.useEffect(() => {
    changePassword('');
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          name: '',
          email: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().max(255).required('Numele este oblogatoriu'),
          email: Yup.string().email('Email-ul trebuie sa fie valid').max(255).required('Email-ul este obligatoriu'),
          password: Yup.string().max(255).required('Parola este obligatorie')
        })}
        onSubmit={(values, { setErrors, setSubmitting }) => {
          signIn('register', {
            redirect: false,
            name: values.name,
            email: values.email,
            password: values.password,
            callbackUrl: APP_DEFAULT_PATH
          }).then((res) => {
            if (res?.error) {
              setErrors({ submit: res.error });
              setSubmitting(false);
            }
          });
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="name-login">Nume</InputLabel>
                  <OutlinedInput
                    id="name-login"
                    type="text"
                    value={values.name}
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Introduceți numele"
                    fullWidth
                    error={Boolean(touched.name && errors.name)}
                  />
                </Stack>
                {touched.name && errors.name && (
                  <FormHelperText error id="standard-weight-helper-text-name-login">
                    {errors.name}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-login">Email</InputLabel>
                  <OutlinedInput
                    id="email-login"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Introduceți email-ul"
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                  />
                </Stack>
                {touched.email && errors.email && (
                  <FormHelperText error id="standard-weight-helper-text-email-login">
                    {errors.email}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-login">Parola</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="-password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      changePassword(e.target.value);
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Introduceți parola"
                  />
                </Stack>
                {touched.password && errors.password && (
                  <FormHelperText error id="standard-weight-helper-text-password-login">
                    {errors.password}
                  </FormHelperText>
                )}
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1" fontSize="0.75rem">
                        {level?.label}
                      </Typography>
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>

          
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    Creare cont
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
  
      {providers && (
        <Stack
          direction="row"
          spacing={matchDownSM ? 1 : 2}
          justifyContent={matchDownSM ? 'space-around' : 'space-between'}
          sx={{ mt: 3, '& .MuiButton-startIcon': { mr: matchDownSM ? 0 : 1, ml: matchDownSM ? 0 : -0.5 } }}
        >
          {Object.values(providers).map((provider) => {
            if (provider.id === 'login' || provider.id === 'register') {
              return;
            }
            return (
              <Box key={provider.name} sx={{ width: '100%' }}>
                {provider.id === 'google' && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth={!matchDownSM}
                    startIcon={<Image src={Google} alt="Twitter" width={16} height={16} />}
                    onClick={() => signIn(provider.id, { callbackUrl: APP_DEFAULT_PATH })}
                  >
                    {!matchDownSM && 'Google'}
                  </Button>
                )}
                {provider.id === 'auth0' && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth={!matchDownSM}
                    startIcon={<Image src={Auth0} alt="Twitter" width={16} height={16} />}
                    onClick={() => signIn(provider.id, { callbackUrl: APP_DEFAULT_PATH })}
                  >
                    {!matchDownSM && 'Auth0'}
                  </Button>
                )}
                {provider.id === 'cognito' && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth={!matchDownSM}
                    startIcon={<Image src={Cognito} alt="Twitter" width={16} height={16} />}
                    onClick={() => signIn(provider.id, { callbackUrl: APP_DEFAULT_PATH })}
                  >
                    {!matchDownSM && 'Cognito'}
                  </Button>
                )}
              </Box>
            );
          })}
        </Stack>
      )}
      {!providers && (
        <Box sx={{ mt: 3 }}>
          <FirebaseSocial />
        </Box>
      )}
    </>
  );
};

AuthRegister.propTypes = {
  providers: PropTypes.object,
  csrfToken: PropTypes.string
};

export default AuthRegister;
