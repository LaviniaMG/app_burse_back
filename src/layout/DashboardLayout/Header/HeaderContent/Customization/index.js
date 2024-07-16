import { useMemo, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
// project import
import ThemeLayout from './ThemeLayout';
import DefaultThemeMode from './ThemeMode';
import ColorScheme from './ColorScheme';
import ThemeWidth from './ThemeWidth';
import ThemeFont from './ThemeFont';
import ThemeMenuLayout from './ThemeMenuLayout';
import useConfig from '../../../../../hooks/useConfig';
import { ThemeMode } from '../../../../../config';

import { FormControlLabel } from '../../../../../../node_modules/@mui/material/index';
import Switch from '@mui/material/Switch';
// ==============================|| HEADER CONTENT - CUSTOMIZATION ||============================== //

const Customization = () => {
  const theme = useTheme();
  const { container, fontFamily, mode, presetColor, miniDrawer, themeDirection, menuOrientation } = useConfig();

  // eslint-disable-next-line
  const themeLayout = useMemo(() => <ThemeLayout />, [miniDrawer, themeDirection]);
  // eslint-disable-next-line
  const themeMenuLayout = useMemo(() => <ThemeMenuLayout />, [menuOrientation]);
  // eslint-disable-next-line
  const themeMode = useMemo(() => <DefaultThemeMode />, [mode]);
  // eslint-disable-next-line
  const themeColor = useMemo(() => <ColorScheme />, [presetColor]);
  // eslint-disable-next-line
  const themeWidth = useMemo(() => <ThemeWidth />, [container]);
  // eslint-disable-next-line
  const themeFont = useMemo(() => <ThemeFont />, [fontFamily]);

  const [open, setOpen] = useState(false);
  const { mode2, onChangeMode } = useConfig();
  const handleToggle = () => {
    setOpen(!open);
  };
  const [isChecked, setIsChecked] = useState(true); // defaultChecked este setat la true
  const handleSwitchChange = (event) => {
    const newMode = event.target.checked ? 'light' : 'dark';
    onChangeMode(newMode);
  };

  const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
      margin: 1,
      padding: 0,
      transform: 'translateX(6px)',
      '&.Mui-checked': {
        color: '#fff',
        transform: 'translateX(22px)',
        '& .MuiSwitch-thumb:before': {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
            '#fff',
          )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
        },
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        },
      },
    },
    '& .MuiSwitch-thumb': {
      backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
      width: 32,
      height: 32,
      '&::before': {
        content: "''",
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
      },
    },
    '& .MuiSwitch-track': {
      opacity: 1,
      backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      borderRadius: 20 / 2,
    },
  }));
  

  const iconBackColorOpen = theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'grey.100';

  return (
    <>
      <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <FormControlLabel
        control={<MaterialUISwitch checked={mode === 'light'} 
        onChange={handleSwitchChange} />}
      
      />
    
      </Box>
     </>
  );
};

export default Customization;
