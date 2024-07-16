'use client';

import React from 'react';
import { Tabs, Tab, Typography, Box } from '@mui/material';

import BursaDetail from './BursaRezultateDeob';
import BursaCercetare from './BursaCercetare';
import BursaStudiu from './BursaStudiu';
import BursaRezultateDeob from './BursaRezultateDeob';
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};
const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
};
function VerticalTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ flexGrow: 3, bgcolor: 'background.paper', display: 'flex', height: 700 }}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider' }}
      >
        <Tab label="Rezultate deosebite la învățătură" {...a11yProps(0)} />
        <Tab label="De studiu" {...a11yProps(1)} />
        <Tab label="Cercetare științifică" {...a11yProps(2)} />
      </Tabs>
      <TabPanel value={value} index={0}>
      
        <BursaRezultateDeob></BursaRezultateDeob>
      </TabPanel>
      <TabPanel value={value} index={1}>
          <BursaStudiu></BursaStudiu>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <BursaCercetare></BursaCercetare>
      </TabPanel>
    </Box>
  );
}

export default VerticalTabs;
