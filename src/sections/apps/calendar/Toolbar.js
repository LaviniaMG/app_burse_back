import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useMediaQuery, Button, ButtonGroup, Stack, Tooltip, Typography } from '@mui/material';

// third-party
import { format } from 'date-fns';

// project import
import IconButton from '../../../components/@extended/IconButton';

// assets
import { AppstoreOutlined, LayoutOutlined, LeftOutlined, OrderedListOutlined, PicCenterOutlined, RightOutlined } from '@ant-design/icons';

// constant
const viewOptions = [
  {
    label: 'Luna',
    value: 'dayGridMonth',
    icon: AppstoreOutlined
  },
  {
    label: 'Saptamana',
    value: 'timeGridWeek',
    icon: LayoutOutlined
  },
  {
    label: 'Zi',
    value: 'timeGridDay',
    icon: PicCenterOutlined
  },
  {
    label: 'Agenda',
    value: 'listWeek',
    icon: OrderedListOutlined
  }
];

// ==============================|| CALENDAR - TOOLBAR ||============================== //

const Toolbar = ({ date, view, onClickNext, onClickPrev, onClickToday, onChangeView }) => {
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const [viewFilter, setViewFilter] = useState(viewOptions);

  useEffect(() => {
    if (matchDownSM) {
      const filter = viewOptions.filter((item) => item.value !== 'dayGridMonth' && item.value !== 'timeGridWeek');
      setViewFilter(filter);
    } else {
      setViewFilter(viewOptions);
    }
  }, [matchDownSM]);

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={matchDownSM ? 1 : 3} sx={{ pb: 3 }}>
  
      <Stack direction="row" alignItems="center" spacing={matchDownSM ? 0.5 : 3}>
        <IconButton onClick={onClickPrev} size={matchDownSM ? 'small' : 'large'}>
          <LeftOutlined />
        </IconButton>
        <Typography variant={matchDownSM ? 'h5' : 'h3'} color="textPrimary">
          {format(date, 'MMMM yyyy')}
        </Typography>
        <IconButton onClick={onClickNext} size={matchDownSM ? 'small' : 'large'}>
          <RightOutlined />
        </IconButton>
      </Stack>
      <ButtonGroup variant="outlined" aria-label="outlined button group">
        {viewFilter.map((viewOption) => {
          const Icon = viewOption.icon;
          return (
            <Tooltip title={viewOption.label} key={viewOption.value}>
              <Button
                disableElevation
                size={matchDownSM ? 'small' : 'medium'}
                variant={viewOption.value === view ? 'contained' : 'outlined'}
                onClick={() => onChangeView(viewOption.value)}
              >
                <Icon style={{ fontSize: '1.3rem' }} />
              </Button>
            </Tooltip>
          );
        })}
      </ButtonGroup>
    </Stack>
  );
};

Toolbar.propTypes = {
  date: PropTypes.object,
  view: PropTypes.string,
  onClickNext: PropTypes.func,
  onClickPrev: PropTypes.func,
  onClickToday: PropTypes.func,
  onChangeView: PropTypes.func
};

export default Toolbar;
