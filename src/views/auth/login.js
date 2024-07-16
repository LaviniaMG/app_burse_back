// next
import NextLink from 'next/link';
import { getProviders, getCsrfToken } from 'next-auth/react';

// material-ui
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project import
import AuthWrapper from '../../sections/auth/AuthWrapper';
import AuthLogin from'../../sections/auth/auth-forms/AuthLogin';
import { Box } from '../../../node_modules/@mui/material/index';
export default async function SignIn() {
  const csrfToken = await getCsrfToken();
  const providers = await getProviders();

  return (
  
      <Box
        sx={{
          background: `url(../../../public/assets/Cladirea-Ion-N-Angelescu.jpg) no-repeat center center`,
          backgroundSize: 'cover',
          width: '100vw',
          height: '100vh'
        }}
      >
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">Autentificare</Typography>
            <NextLink href="/register" passHref legacyBehavior>
              <Link variant="body1" color="primary">
                Nu ai deja un cont?
              </Link>
            </NextLink>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <AuthLogin providers={providers} csrfToken={csrfToken} />
        </Grid>
      </Grid>
    </AuthWrapper>
  </Box>
  );
}




