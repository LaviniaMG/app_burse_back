'use client';

import PropTypes from 'prop-types';
import React, { useState } from 'react';

// next
import Image from 'next/legacy/image';
import NextLink from 'next/link';
import { signIn } from 'next-auth/react';

// material-ui
import {
  Box,
  useMediaQuery,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormHelperText,
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
import { preload } from 'swr';
import { Formik } from 'formik';

// project import
import FirebaseSocial from './FirebaseSocial';
import { APP_DEFAULT_PATH } from '../../../config';
import { fetcher } from '../../../utils/axios';
import IconButton from '../../../components/@extended/IconButton';
import AnimateButton from '../../../components/@extended/AnimateButton';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const Auth0 = '/assets/images/icons/auth0.svg';
const Cognito = '/assets/images/icons/aws-cognito.svg';
const Google = '/assets/images/icons/google.svg';

// ============================|| AWS CONNITO - LOGIN ||============================ //

const AuthLogin = ({ providers, csrfToken }) => {
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const [checked, setChecked] = useState(false);
  const [capsWarning, setCapsWarning] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onKeyDown = (keyEvent) => {
    if (keyEvent.getModifierState('CapsLock')) {
      setCapsWarning(true);
    } else {
      setCapsWarning(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          email: 'admin@ase.ro',
          password: '123456',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Trebuie un email valid!').max(255).required('Email-ul este obligatoriu!'),
          password: Yup.string().max(255).required('Parola este obligatorie!')
        })}
        onSubmit={(values, { setErrors, setSubmitting }) => {
          signIn('login', {
            redirect: true,
            email: 'info@codedthemes.com',
            password: '123456',
            callbackUrl: APP_DEFAULT_PATH
          }).then(
            (res) => {
              if (res?.error) {
                setErrors({ submit: res.error });
                setSubmitting(false);
              } else {
                preload('api/menu/dashboard', fetcher);
                setSubmitting(false);
              }
            },
            (res) => {
              setErrors({ submit: res.error });
              setSubmitting(false);
            }
          );
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-login"> Email</InputLabel>
                  <OutlinedInput
                    id="email-login"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Introduceti email-ul"
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
                    color={capsWarning ? 'warning' : 'primary'}
                    error={Boolean(touched.password && errors.password)}
                    id="-password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={(event) => {
                      setCapsWarning(false);
                      handleBlur(event);
                    }}
                    onKeyDown={onKeyDown}
                    onChange={handleChange}
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
                    placeholder="Introduceti parola"
                  />
                  {capsWarning && (
                    <Typography variant="caption" sx={{ color: 'warning.main' }} id="warning-helper-text-password-login">
                      Litere mari!
                    </Typography>
                  )}
                </Stack>
                {touched.password && errors.password && (
                  <FormHelperText error id="standard-weight-helper-text-password-login">
                    {errors.password}
                  </FormHelperText>
                )}
              </Grid>

              <Grid item xs={12} sx={{ mt: -1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="right" spacing={2}>

                  <NextLink href={'/forget-pass'} passHref legacyBehavior >
                    <Link variant="h6" color="text.primary">
                      Ați uitat parola?
                    </Link>
                  </NextLink>
                </Stack>
              </Grid>
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    Autentificare
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

AuthLogin.propTypes = {
  providers: PropTypes.object,
  csrfToken: PropTypes.string
};

export default AuthLogin;
