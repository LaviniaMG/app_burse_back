'use client';

// next
import Image from 'next/legacy/image';
import NextLink from 'next/link';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, Grid, Stack, Typography, useMediaQuery } from '@mui/material';

// project import
import { APP_DEFAULT_PATH } from '../../config';

// assets
const error500 = '/assets/images/maintenance/Error500.png';

// ==============================|| ERROR 500 - MAIN ||============================== //

function Error500() {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grid container direction="column" alignItems="center" justifyContent="center" sx={{ minHeight: '100vh' }}>
      <Grid item xs={12}>
        <Box sx={{ width: { xs: 350, sm: 396 } }}>
          <Image src={error500}  layout="fixed" width={matchDownSM ? 350 : 396} height={matchDownSM ? 325 : 370} />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Stack justifyContent="center" alignItems="center">
          <Typography align="center" variant={matchDownSM ? 'h2' : 'h1'}>
            Internal Server Error
          </Typography>
          <Typography color="textSecondary" variant="body2" align="center" sx={{ width: { xs: '73%', sm: '70%' }, mt: 1 }}>
            Server error 500. we fixing the problem. please try again at a later stage.
          </Typography>
          <NextLink href={APP_DEFAULT_PATH} passHref legacyBehavior>
            <Button variant="contained" sx={{ textTransform: 'none', mt: 4 }}>
              Back To Home
            </Button>
          </NextLink>
        </Stack>
      </Grid>
    </Grid>
  );
}

export default Error500;
