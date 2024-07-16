'use client';

import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Box, Tab, Tabs } from '@mui/material';
import MainCard from '../../../components/MainCard';
import Breadcrumbs from '../../../components/@extended/Breadcrumbs';
import TabProfile from '../../../sections/apps/profiles/account/TabProfile';
import TabPersonal from '../../../sections/apps/profiles/account/TabPersonal';
import { APP_DEFAULT_PATH } from '../../../config';
import { handlerActiveItem, useGetMenuMaster } from '../../../api/menu';
import { FileTextOutlined, UserOutlined, CreditCardOutlined } from '@ant-design/icons';
import TabPayment from '../../../sections/apps/profiles/user/TabPayment';

const AccountProfile = ({ tab }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { menuMaster } = useGetMenuMaster();

  let breadcrumbTitle = '';
  let breadcrumbHeading = '';

  switch (tab) {
    case 'payment':
      breadcrumbTitle = 'Detalii bancare';
      breadcrumbHeading = 'Profilul meu';
      break;
    case 'basic':
    default:
      breadcrumbTitle = 'Informații personale';
      breadcrumbHeading = 'Profilul meu';
  }

  const [value, setValue] = useState(tab);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    router.replace(`/apps/profiles/account/${newValue}`);
  };

  let breadcrumbLinks = [
    { title: 'Anunțuri', to: APP_DEFAULT_PATH },
    { title: 'Profilul meu', to: `/apps/profiles/account/${tab}` },
    { title: breadcrumbTitle }
  ];

  useEffect(() => {
    if (menuMaster.openedItem !== 'account-profile') handlerActiveItem('account-profile');
    // eslint-disable-next-line
  }, [pathname]);

  return (
    <>
      <Breadcrumbs custom heading={breadcrumbHeading} links={breadcrumbLinks} />
      <MainCard border={false} boxShadow>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
          <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto" aria-label="account profile tab">
            <Tab label="Informații personale" icon={<UserOutlined />} value="basic" iconPosition="start" />
            <Tab label="Detalii bancare" icon={<CreditCardOutlined />} value="payment" iconPosition="start" />
          </Tabs>
        </Box>
        <Box sx={{ mt: 2.5 }}>
          {tab === 'basic' && <TabProfile />}
          {tab === 'payment' && <TabPayment></TabPayment>}
        </Box>
      </MainCard>
    </>
  );
};

AccountProfile.propTypes = {
  tab: PropTypes.string
};

export default AccountProfile;
