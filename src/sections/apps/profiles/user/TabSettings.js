'use client';

import { useState } from 'react';

// material-ui
import { Button, List, ListItem, ListItemIcon, ListItemText, Stack, Switch, Typography } from '@mui/material';

// project import
import MainCard from '../../../../components/MainCard';

// assets
import { FileDoneOutlined, MailOutlined, TranslationOutlined } from '@ant-design/icons';

// ==============================|| TAB - SETTINGS ||============================== //

const TabSettings = () => {
  const [checked, setChecked] = useState(['oc', 'usn', 'lc']);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <MainCard title="Setari">
      <List sx={{ '& .MuiListItem-root': { p: 2 } }}>
      
        <ListItem divider>
          <ListItemIcon sx={{ color: 'primary.main', mr: 2, display: { xs: 'none', sm: 'block' } }}>
            <MailOutlined style={{ fontSize: '1.5rem' }} />
          </ListItemIcon>
          <ListItemText
            id="switch-list-label-sen"
            primary={<Typography variant="h5">Confirmarea burselor</Typography>}
            secondary="Vei primi un email de confirmare cand bursele vor fi acordate."
          />
          <Switch
            edge="end"
            onChange={handleToggle('sen')}
            checked={checked.indexOf('sen') !== -1}
            inputProps={{
              'aria-labelledby': 'switch-list-label-sen'
            }}
          />
        </ListItem>
    
     
      </List>
      <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
        <Button variant="outlined" color="secondary">
          Renuntare
        </Button>
        <Button variant="contained">Salvare</Button>
      </Stack>
    </MainCard>
  );
};

export default TabSettings;
