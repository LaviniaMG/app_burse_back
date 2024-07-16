// material-ui
import { useTheme } from '@mui/material/styles';


const logoDark = 'assets/images/Logo-ASE-ENG.png';
const logo = 'assets/images/Logo-ASE-ENG.png';
import { ThemeMode } from '../../config';


// ==============================|| LOGO ICON SVG ||============================== //

const LogoIcon = () => {
  const theme = useTheme();
//ase logo
  return (
    <>
    <img src={theme.palette.mode === ThemeMode.DARK ? logoDark : logo} alt="ASE" width={100} height={50} />
    </>

  );
};

export default LogoIcon;
