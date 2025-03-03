import PropTypes from 'prop-types';

// material-ui
import { Box, Chip, Stack, Typography } from '@mui/material';

// project import
import MainCard from '../../../components/MainCard';

// assets
import { RiseOutlined, FallOutlined } from '@ant-design/icons';

// ==============================|| STATISTICS - ECOMMERCE CARD ||============================== //

const AnalyticsDataCard = ({ color = 'primary', title, count, percentage, isLoss, children }) => (
  <MainCard content={false}>
    <Box sx={{ p: 2.25 }}>
      <Stack spacing={0.5}>
        <Typography variant="h6" color="textSecondary">
          {title}
        </Typography>
        <Stack direction="row" alignItems="center">
          <Typography variant="h4" color="inherit">
            {count}
          </Typography>
          {percentage && (
            <Chip
              variant="combined"
              color={color}
              icon={
                <>
                  {!isLoss && <RiseOutlined style={{ fontSize: '0.75rem', color: 'inherit' }} />}
                  {isLoss && <FallOutlined style={{ fontSize: '0.75rem', color: 'inherit' }} />}
                </>
              }
              label={`${percentage}%`}
              sx={{ ml: 1.25, pl: 1 }}
              size="small"
            />
          )}
        </Stack>
      </Stack>
    </Box>
    {children}
  </MainCard>
);

AnalyticsDataCard.propTypes = {
  title: PropTypes.string,
  count: PropTypes.string,
  percentage: PropTypes.number,
  isLoss: PropTypes.bool,
  color: PropTypes.string,
  children: PropTypes.node
};

export default AnalyticsDataCard;
