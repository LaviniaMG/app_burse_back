import { useMemo } from 'react';

// material-ui
import { Box, useMediaQuery } from '@mui/material';

// project import
import Profile from './Profile';

import Customization from './Customization';


import useConfig from '../../../../hooks/useConfig';
import DrawerHeader from '../../../../layout/DashboardLayout/Drawer/DrawerHeader';

import { MenuOrientation } from '../../../../config';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const { i18n, menuOrientation } = useConfig();
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  // eslint-disable-next-line react-hooks/exhaustive-deps
 

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        {/* Left aligned part */}
        {menuOrientation === MenuOrientation.HORIZONTAL && !downLG && <DrawerHeader open={true} />}
      </Box>
      {/* Right aligned part */}
      <Box sx={{ display: 'flex', alignItems: 'right' }}>
        <Customization />
        <Profile />
      </Box>
    </Box>
  );
};

export default HeaderContent;
