import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { ThemeMode } from '../../config';
const logoDark = '/assets/images/Logo-ASE-ENG.png'; // Asigură-te că calea este corectă
const logo = '/assets/images/Logo-ASE-ENG.png';

const LogoMain = ({ reverse }) => {
  const theme = useTheme();
  return (
      <img src={theme.palette.mode === ThemeMode.DARK ? logoDark : logo} alt="ASE" width={100} height={50} />
  );
};

LogoMain.propTypes = {
  reverse: PropTypes.any
};

export default LogoMain;
