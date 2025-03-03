'use client';;
import { useEffect, useState } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import { Box, CardMedia, FormControlLabel, Radio, RadioGroup, Slide, Stack } from '@mui/material';

// project import
import MainCard from '../components/MainCard';
import IconButton from '../components/@extended/IconButton';
import useConfig from '../hooks/useConfig';
import Hero from '../sections/landing/Header';
import NumberBlock from '../sections/landing/NumberBlock';
import BrowserBlock from '../sections/landing/BrowserBlock';
import CallToAction from '../sections/landing/CallToAction';
import FeatureBlock from '../sections/landing/FeatureBlock';
import DemoBlock from '../sections/landing/DemoBlock';
import TestimonialBlock from '../sections/landing/TestimonialBlock';
import ElementBlock from '../sections/landing/ElementBlock';
import PartnerBlock from '../sections/landing/PartnerBlock';

// config
import { ThemeDirection, ThemeMode } from '../config';

// assets
import { CheckOutlined } from '@ant-design/icons';

// ==============================|| LANDING PAGE ||============================== //

const Landing = () => {
  const theme = useTheme();
  const { mode, presetColor, onChangePresetColor } = useConfig();

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const listenToScroll = () => {
      let heightToHideFrom = 250;
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;

      if (winScroll > heightToHideFrom) {
        setVisible(true);
      } else {
        visible && setVisible(false);
      }
    };

    window.addEventListener('scroll', listenToScroll);
    return () => window.removeEventListener('scroll', listenToScroll);
  }, [visible]);


  const handlePresetColorChange = (event) => {
    onChangePresetColor(event.target.value);
  };

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          bgcolor: theme.palette.mode === ThemeMode.DARK ? 'grey.0' : 'grey.800',
          overflow: 'hidden',
          minHeight: '100vh',
          '&>*': {
            position: 'relative',
            zIndex: 5
          },
          '&:before': {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            zIndex: 2,
            background:
              theme.direction === ThemeDirection.RTL
                ? {
                    xs: 'linear-gradient(-360.36deg, rgb(0, 0, 0) 14.79%, rgba(67, 67, 67, 0.28) 64.86%)',
                    md: 'linear-gradient(-329.36deg, rgb(0, 0, 0) 1.79%, rgba(67, 67, 67, 0.28) 64.86%)',
                    xl: 'linear-gradient(-329.36deg, rgb(0, 0, 0) 1.79%, rgba(67, 67, 67, 0.28) 64.86%)'
                  }
                : 'linear-gradient(329.36deg, rgb(0, 0, 0) 14.79%, rgba(67, 67, 67, 0.28) 64.86%)'
          }
        }}
      >
        <CardMedia
          component="img"
          image={`/assets/images/landing/bg-mockup-${presetColor}.png`}
          sx={{
            position: 'absolute',
            width: { md: '78%', lg: '70%', xl: '65%' },
            right: { md: '-14%', lg: '-4%', xl: '-2%' },
            top: { md: '16%', lg: '12%', xl: '8%' },
            zIndex: 1,
            display: { xs: 'none', md: 'block' }
          }}
        />
        <Hero />
      </Box>
      <FeatureBlock />
      <DemoBlock />
      <CallToAction />
      <NumberBlock />
      <BrowserBlock />
      <ElementBlock />
      <PartnerBlock />
      <TestimonialBlock />
      <Slide direction={theme.direction === ThemeDirection.RTL ? 'right' : 'left'} in={visible} mountOnEnter unmountOnExit>
        <MainCard
          sx={{
            width: { xs: '100%', sm: 'auto' },
            position: 'fixed',
            zIndex: 9,
            right: { xs: 0, sm: 16 },
            bottom: { xs: 0, sm: '25%' },
            borderRadius: { xs: 0, sm: 1 }
          }}
          content={false}
          shadow={theme.customShadows.z1}
          boxShadow
          border={false}
        >
          <RadioGroup
            sx={{ alignItems: { xs: 'center', sm: 'flex-end' }, p: 1.25 }}
            aria-label="payment-card"
            name="payment-card"
            value={presetColor}
            onChange={handlePresetColorChange}
          >
            <Stack direction={{ xs: 'row', sm: 'column' }} spacing={1} alignItems="center">
             
                <FormControlLabel
                  key={index}
                  control={<Radio value={color.id} sx={{ opacity: 0, position: 'absolute', zIndex: 9 }} />}
                  sx={{
                    mr: 0,
                    ml: 0,
                    zIndex: 1,
                    '&:hover': {
                      position: 'relative',
                      '& .MuiIconButton-root:after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        background: '#fff',
                        opacity: 0.3,
                        boxShadow: `0 0 6px 6px ${alpha(color.primary, 0.9)}`
                      }
                    }
                  }}
                  label={
                    <IconButton
                      shape="rounded"
                      variant="contained"
                      sx={{
                        bgcolor: color.primary,
                        width: presetColor === color.id ? 28 : 20,
                        height: presetColor === color.id ? 28 : 20
                      }}
                    >
                      {presetColor === color.id && <CheckOutlined />}
                    </IconButton>
                  }
                />
          
            </Stack>
          </RadioGroup>
        </MainCard>
      </Slide>
    </>
  );
};

export default Landing;
