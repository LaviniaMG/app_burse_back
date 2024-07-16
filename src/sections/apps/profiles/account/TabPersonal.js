'use client';

import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, FormLabel, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';

// third-party
import { PatternFormat } from 'react-number-format';

// project import
import Avatar from '../../../../components/@extended/Avatar';
import MainCard from '../../../../components/MainCard';
import { facebookColor, linkedInColor, twitterColor, ThemeMode } from '../../../../config';

// assets
import { FacebookFilled, LinkedinFilled, TwitterSquareFilled, CameraOutlined } from '@ant-design/icons';

// styles & constant
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
    }
  }
};

// ==============================|| ACCOUNT PROFILE - PERSONAL ||============================== //

const TabPersonal = () => {
  const theme = useTheme();
  const [selectedImage, setSelectedImage] = useState(undefined);
  const [avatar, setAvatar] = useState('/assets/images/users/default.png');

  useEffect(() => {
    if (selectedImage) {
      setAvatar(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  const [experience, setExperience] = useState('0');

  const handleChange = (event) => {
    setExperience(event.target.value);
  };

  return (
    <Grid container spacing={3}>
 
      <Grid item xs={12} sm={12}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MainCard title="Metode de plată">
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Button
                    disableRipple
                    size="small"
                    startIcon={<TwitterSquareFilled style={{ color: twitterColor, fontSize: '1.15rem' }} />}
                    sx={{ color: twitterColor, '&:hover': { bgcolor: 'transparent' } }}
                  >
                    Twitter
                  </Button>
                  <Button color="error">Connect</Button>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Button
                    disableRipple
                    size="small"
                    startIcon={<FacebookFilled style={{ color: facebookColor, fontSize: '1.15rem' }} />}
                    sx={{ color: facebookColor, '&:hover': { bgcolor: 'transparent' } }}
                  >
                    Facebook
                  </Button>
                  <Typography variant="subtitle1" sx={{ color: facebookColor }}>
                    Anshan Handgun
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Button
                    disableRipple
                    size="small"
                    startIcon={<LinkedinFilled style={{ color: linkedInColor, fontSize: '1.15rem' }} />}
                    sx={{ color: linkedInColor, '&:hover': { bgcolor: 'transparent' } }}
                  >
                    LinkedIn
                  </Button>
                  <Button color="error">Connect</Button>
                </Stack>
              </Stack>
            </MainCard>
          </Grid>
         
        </Grid>
      </Grid>

    </Grid>
  );
};

export default TabPersonal;
