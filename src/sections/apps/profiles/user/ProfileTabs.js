'use client';

import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

// next
import NextLink from 'next/link';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Divider, FormLabel, Grid, TextField, Menu, MenuItem, Stack, Typography } from '@mui/material';

// project import
import MainCard from '../../../../components/MainCard';
import Avatar from '../../../../components/@extended/Avatar';
import IconButton from '../../../../components/@extended/IconButton';
import ProfileTab from './ProfileTab';
import { facebookColor, linkedInColor, twitterColor, ThemeMode } from '../../../../config';

// assets
import { FacebookFilled, LinkedinFilled, MoreOutlined, TwitterSquareFilled, CameraOutlined } from '@ant-design/icons';

const getFacultyInitials = (facultyName) => {
  if (!facultyName) return '';
  return facultyName
    .split(' ')
    .filter(word => word.charAt(0) === word.charAt(0).toUpperCase())
    .map(word => word.charAt(0))
    .join('');
};
// ==============================|| USER PROFILE - TAB CONTENT ||============================== //

const ProfileTabs = ({ focusInput }) => {
  const theme = useTheme();

  const [userData, setUserData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(undefined);
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/studenti/1');
        const data = await response.json();
        setUserData(data);
        setAvatar(data.utilizator.URLPoza || '');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (selectedImage) {
      setAvatar(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event?.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (!userData) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <MainCard>
      <Grid container spacing={6}>
        <Grid item xs={12}>
        
          <Stack spacing={2.5} alignItems="center">
            <FormLabel
              htmlFor="change-avtar"
              sx={{
                position: 'relative',
                borderRadius: '50%',
                overflow: 'hidden',
                '&:hover .MuiBox-root': { opacity: 1 },
                cursor: 'pointer'
              }}
            >
              <Avatar  src={avatar} sx={{ width: 124, height: 124, border: '1px dashed' }} />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  backgroundColor: theme.palette.mode === ThemeMode.DARK ? 'rgba(255, 255, 255, .75)' : 'rgba(0,0,0,.65)',
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Stack spacing={0.5} alignItems="center">
                  <CameraOutlined style={{ color: theme.palette.secondary.lighter, fontSize: '2rem' }} />
                  <Typography sx={{ color: 'secondary.lighter' }}>Încarcare</Typography>
                </Stack>
              </Box>
            </FormLabel>
            <TextField
              type="file"
              id="change-avtar"
              placeholder="Outlined"
              variant="outlined"
              sx={{ display: 'none' }}
              onChange={(e) => setSelectedImage(e.target.files?.[0])}
            />
            <Stack spacing={0.5} alignItems="center">
              <Typography variant="h5">{userData.utilizator.Nume} {userData.utilizator.Prenume}</Typography>
              <Typography color="secondary">{ "Personal administrativ"}</Typography>
            </Stack>
          </Stack>
        </Grid>
        <Grid item sm={3} sx={{ display: { sm: 'block', md: 'none' } }} />
        <Grid item xs={12} sm={6} md={12}>
          <Stack direction="row" justifyContent="space-around" alignItems="center">
            <Stack spacing={0.5} alignItems="center">
              <Typography variant="h5">{userData.anFacultate}</Typography>
              <Typography color="secondary">An</Typography>
            </Stack>
            <Divider orientation="vertical" flexItem />
            <Stack spacing={0.5} alignItems="center">
              <Typography variant="h5">{getFacultyInitials(userData.facultate.facultate)}</Typography>
              <Typography color="secondary">Facultatea</Typography>
            </Stack>
            <Divider orientation="vertical" flexItem />
            <Stack spacing={0.5} alignItems="center">
              <Typography variant="h5">{userData.media}</Typography>
              <Typography color="secondary">Media</Typography>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <ProfileTab />
        </Grid>
      </Grid>
    </MainCard>
  );
};

ProfileTabs.propTypes = {
  focusInput: PropTypes.func
};

export default ProfileTabs;
