'use client';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
// project import
import { ThemeDirection } from '../../config';

// ==============================|| AUTH BLUR BACK SVG ||============================== //
//poza login
const AuthBackground = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        position: 'absolute',
        filter: 'blur(18px)',
        zIndex: -1,
        bottom: 0,
        transform: theme.direction === ThemeDirection.RTL ? 'rotate(180deg)' : 'inherit'
      }}
    >

    </Box>
  );
};

export default AuthBackground;
