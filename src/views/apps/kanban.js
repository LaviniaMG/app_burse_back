'use client';

import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// next
import { useRouter, usePathname } from 'next/navigation';

// material-ui
import { Box, Grid, Tab, Tabs } from '@mui/material';

// project import
import Breadcrumbs from '../../components/@extended/Breadcrumbs';
import { APP_DEFAULT_PATH } from '../../config';
import { handlerActiveItem, useGetMenuMaster } from '../../api/menu';

import Board from '../../sections/apps/kanban/Board';
import Backlogs from '../../sections/apps/kanban/Backlogs';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

// ==============================|| APPLICATION - KANBAN ||============================== //

export default function KanbanPage({ tab }) {
  const router = useRouter();
  const pathname = usePathname();
  const { menuMaster } = useGetMenuMaster();

  const [value, setValue] = useState(tab);
  const handleChange = (event, newValue) => {
    setValue(newValue);
    router.replace(`/apps/kanban/${newValue}`);
  };

  let breadcrumbTitle = '';
  let breadcrumbHeading = '';

  switch (tab) {
    case 'backlogs':
      breadcrumbTitle = 'Lista secundară';
      breadcrumbHeading = 'Lista secundară';
      break;
    case 'board':
    default:
      breadcrumbTitle = 'Lista principală';
      breadcrumbHeading = 'Sarcini de îndeplinit';
  }

  let breadcrumbLinks = [
    { title: 'Anunțuri', to: APP_DEFAULT_PATH },
    { title: 'Sarcini', to: '/apps/kanban/board' },
    { title: breadcrumbTitle }
  ];
  if (tab === 'board') {
    breadcrumbLinks = [{ title: 'Anunțuri', to: APP_DEFAULT_PATH }, { title: 'Sarcini' }];
  }

  useEffect(() => {
    if (menuMaster.openedItem !== 'kanban') handlerActiveItem('kanban');
    // eslint-disable-next-line
  }, [pathname]);

  return (
    <>
      <Breadcrumbs custom heading={breadcrumbHeading} links={breadcrumbLinks} />
      <Box sx={{ display: 'flex' }}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Tabs value={value} variant="scrollable" onChange={handleChange}>
              <Tab value="board" label={value === 'board' ? 'Lista principală' : 'Detalii listă principală'} {...a11yProps('board')} />
              <Tab value="backlogs" label={value === 'backlogs' ? 'Lista secundară' : 'Detalii listă secundară'} {...a11yProps('backlogs')} />
            </Tabs>
          </Grid>
          <Grid item xs={12}>
            {tab === 'board' && <Board />}
            {tab === 'backlogs' && <Backlogs />}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

KanbanPage.propTypes = {
  tab: PropTypes.string
};
