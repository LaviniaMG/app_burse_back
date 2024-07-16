'use client';

import { useState } from 'react';

// material-ui
import { CardContent, Checkbox, FormControlLabel, Grid, Tooltip } from '@mui/material';

// project imports
import MainCard from '../../../components/MainCard';

// assets
import { PlusCircleOutlined } from '@ant-design/icons';
import IconButton from '../../../components/@extended/IconButton';

// ===========================|| DATA WIDGET - TODO LIST ||=========================== //

const ToDoList = () => {
  const [state, setState] = useState({
    checkedA: true,
    checkedB: true,
    checkedC: true,
    checkedD: false,
    checkedE: false,
    checkedF: false,
    checkedG: false
  });

  const handleChangeState = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  return (
    <MainCard
      title="Listă de sarcini"
      content={false}
      secondary={
        <Tooltip title="Adăugați o sarcină">
          <IconButton>
            <PlusCircleOutlined />
          </IconButton>
        </Tooltip>
      }
      sx={{ '& .MuiCardHeader-root': { p: 1.75 } }}
    >
      <CardContent>
        <Grid container spacing={0} sx={{ '& .Mui-checked + span': { textDecoration: 'line-through' } }}>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox checked={state.checkedA} onChange={handleChangeState} name="checkedA" color="primary" />}
              label="Verificați-vă email-ul!"
            />
          </Grid>
      
      
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox checked={state.checkedE} onChange={handleChangeState} name="checkedE" color="primary" />}
              label="Modificați sarcina"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox checked={state.checkedF} onChange={handleChangeState} name="checkedF" color="primary" />}
              label="Problemă cu sarcina"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox checked={state.checkedG} onChange={handleChangeState} name="checkedG" color="primary" />}
              label="Deploy"
            />
          </Grid>
        </Grid>
      </CardContent>
    </MainCard>
  );
};

export default ToDoList;
