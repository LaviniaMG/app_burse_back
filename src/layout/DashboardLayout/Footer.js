// material-ui
import { Link, Stack, Typography } from '@mui/material';

const Footer = () => (
  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: '24px 16px 0px', mt: 'auto' }}>
    <Typography variant="caption">&copy; Toate drepturile rezervate</Typography>
    <Stack spacing={1.5} direction="row" justifyContent="space-between" alignItems="center">
      <Typography>Graure Marinela-Lavinia</Typography>
    </Stack>
  </Stack>
);

export default Footer;
