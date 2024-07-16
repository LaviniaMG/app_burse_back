'use client';

import PropTypes from 'prop-types';

// next
import NextLink from 'next/link';

// material-ui
import { useTheme } from '@mui/material/styles';
import { useMediaQuery, Box, Button, Grid, Stack, Typography } from '@mui/material';

// project import
import BackLeft from './UserProfileBackLeft';
import BackRight from './UserProfileBackRight';
import MainCard from '../../../../components/MainCard';
import ProfileRadialChart from './ProfileRadialChart';

// config
import { ThemeDirection } from '../../../../config';

// ==============================|| USER PROFILE - TOP CARD ||============================== //

const ProfileCard = ({ focusInput }) => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <MainCard border={false} content={false} sx={{ bgcolor: 'primary.lighter', position: 'relative' }}>
      <Box
        sx={{
          position: 'absolute',
          bottom: '-7px',
          left: 0,
          zIndex: 1,
          ...(theme.direction === ThemeDirection.RTL && {
            transform: 'rotate(180deg)',
            top: -7,
            bottom: 'unset'
          })
        }}
      >
        <BackLeft />
      </Box>
   
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          zIndex: 1,
          ...(theme.direction === ThemeDirection.RTL && {
            transform: 'rotate(180deg)',
            top: -10,
            bottom: 'unset'
          })
        }}
      >
        <BackRight />
      </Box>
    </MainCard>
  );
};

ProfileCard.propTypes = {
  focusInput: PropTypes.func
};

export default ProfileCard;
