// material-ui
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

// project import
import Navigation from './Navigation';
import SimpleBar from '../../../../components/third-party/SimpleBar';
import { useGetMenuMaster } from '../../../../api/menu';

// ==============================|| DRAWER CONTENT ||============================== //

const DrawerContent = () => {
  const theme = useTheme();
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));
//nu mai o folosesc, asta imi punea help ul si userul 

  return (
    <>
      <SimpleBar
        sx={{
          '& .simplebar-content': {
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        <Navigation />
     
      </SimpleBar>
      
    </>
  );
};

export default DrawerContent;
