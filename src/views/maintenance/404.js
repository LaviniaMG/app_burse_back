// next
import Image from 'next/image';
import NextLink from 'next/link';

// material-ui
import { Box, Button, Grid, Stack, Typography } from '@mui/material';

// project import
import { APP_DEFAULT_PATH } from '../../config';

// assets
const error404 = '/assets/images/maintenance/Error404.png';
const TwoCone = '/assets/images/maintenance/TwoCone.png';

// ==============================|| PAGE ||============================== //

function Error404() {
  return (
    <Grid
      container
      spacing={10}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: '100vh', pt: 1.5, pb: 1, overflow: 'hidden' }}
    >
      <Grid item xs={12}>
        <Stack direction="row">
          <Grid
            item
            sx={{
              position: 'relative',
              width: { xs: 250, sm: 590 },
              height: { xs: 130, sm: 300 }
            }}
          >
            <Image src={error404}  fill sizes="100vw" />
          </Grid>
          <Grid item sx={{ position: 'relative' }}>
            <Box sx={{ position: 'absolute', top: 60, left: -40, width: { xs: 130, sm: 390 }, height: { xs: 115, sm: 330 } }}>
              <Image src={TwoCone}  fill sizes="100vw" />
            </Box>
          </Grid>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Stack spacing={2} justifyContent="center" alignItems="center">
          <Typography variant="h1">Page Not Found</Typography>
          <Typography color="textSecondary" align="center" sx={{ width: { xs: '73%', sm: '61%' } }}>
        Pagina pe care ați accesat-o nu există!
          </Typography>
          <NextLink href={APP_DEFAULT_PATH} passHref legacyBehavior>
            <Button variant="contained">Înapoi</Button>
          </NextLink>
        </Stack>
      </Grid>
    </Grid>
  );
}

export default Error404;
