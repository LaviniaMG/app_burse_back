// material-ui
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

// third-party
import { ReactCompareSlider, ReactCompareSliderImage, ReactCompareSliderHandle } from 'react-compare-slider';

// project import
import useConfig from '../../hooks/useConfig';

// ==============================|| LANDING - BROWSER  PAGE ||============================== //

const BrowserBlockPage = () => {
  const theme = useTheme();
  const { presetColor } = useConfig();

  return (
    <Box sx={{ position: 'relative', '& .ReactCompareSlider': { direction: theme.direction } }}>
      <ReactCompareSlider
        handle={
          <ReactCompareSliderHandle
            buttonStyle={{
              backdropFilter: undefined,
              background: 'white',
              border: 0,
              color: '#333'
            }}
          />
        }
        itemOne={<ReactCompareSliderImage src={`/assets/images/landing/${presetColor}-dark.jpg`} />}
        itemTwo={<ReactCompareSliderImage src={`/assets/images/landing/${presetColor}-light.jpg`} />}
      />
    </Box>
  );
};

export default BrowserBlockPage;
