import PropTypes from 'prop-types';

// material-ui
import { CameraOutlined } from '@ant-design/icons';
import { Typography, Stack, CardMedia } from '@mui/material';

const UploadCover = '/assets/images/upload/upload.svg';

// ==============================|| UPLOAD - PLACEHOLDER ||============================== //

export default function PlaceholderContent({ type }) {
  return (
    <>
      {type !== 'STANDARD' && (
        <Stack
          spacing={2}
          alignItems="center"
          justifyContent="center"
          direction={{ xs: 'column', md: 'row' }}
          sx={{ width: 1, textAlign: { xs: 'center', md: 'left' } }}
        >
          <CardMedia component="img" image={UploadCover} sx={{ width: 150 }} />
          <Stack sx={{ p: 3 }} spacing={1}>
            <Typography variant="h5">Copiati si mutati fisierele aici.</Typography>

            <Typography color="secondary">
              Sau dati click&nbsp;
              <Typography component="span" color="primary" sx={{ textDecoration: 'underline' }}>
                aici
              </Typography>
              &nbsp;pentru a incarca documentele. DE PUS DOCUMENTELE PENTRU FIECARE BURSA. DE FACUT CA SA SE SALVEZE UNDEVA ANUME
            </Typography>
          </Stack>
        </Stack>
      )}
      {type === 'STANDARD' && (
        <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
          <CameraOutlined style={{ fontSize: '32px' }} />
        </Stack>
      )}
    </>
  );
}

PlaceholderContent.propTypes = {
  type: PropTypes.string
};
