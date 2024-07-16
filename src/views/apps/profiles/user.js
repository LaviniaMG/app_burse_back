'use client';;
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';

// next
import { usePathname } from 'next/navigation';

// material-ui
import { Grid } from '@mui/material';

import ProfileTabs from '../../../sections/apps/profiles/user/ProfileTabs';
import TabPersonal from '../../../sections/apps/profiles/user/TabPersonal';
import TabPayment from '../../../sections/apps/profiles/user/TabPayment';
import { handlerActiveItem, useGetMenuMaster } from '../../../api/menu';

// ==============================|| PROFILE - USER ||============================== //

const UserProfile = ({ tab }) => {
  const inputRef = useRef(null);
  const pathname = usePathname();
  const { menuMaster } = useGetMenuMaster();

  const focusInput = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (menuMaster.openedItem !== 'user-profile') handlerActiveItem('user-profile');
    // eslint-disable-next-line
  }, [pathname]);

  return (
    <Grid container spacing={3}>
   
      <Grid item xs={12} md={3}>
        <ProfileTabs focusInput={focusInput} />
      </Grid>
      <Grid item xs={12} md={9}>
        {tab === 'personal' && <TabPersonal />}
        {tab === 'payment' && <TabPayment />}
      </Grid>
    </Grid>
  );
};

UserProfile.propTypes = {
  tab: PropTypes.string
};

export default UserProfile;
