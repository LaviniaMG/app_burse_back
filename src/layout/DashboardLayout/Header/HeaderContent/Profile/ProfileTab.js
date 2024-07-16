import PropTypes from 'prop-types';
import { useState } from 'react';
import Link from 'next/link';
import { List, ListItemButton, ListItemIcon, ListItemText, useTheme } from '@mui/material';
import { EditOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';

const ProfileTab = ({ handleLogout }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const theme = useTheme(); // Hook-ul pentru a accesa tema curentă

  const handleListItemClick = (index) => {
    setSelectedIndex(index);
  };

  // Stilizare condiționată în funcție de tema curentă
  const linkStyle = {
    textDecoration: 'none', // elimină sublinierea
    color: theme.palette.mode === 'dark' ? 'white' : 'black' // alege culoarea textului în funcție de modul temei
  };

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      <Link href="/apps/profiles/user/personal" passHref>
        <ListItemButton component="a" selected={selectedIndex === 0} onClick={() => handleListItemClick(0)} sx={linkStyle}>
          <ListItemIcon>
            <EditOutlined />
          </ListItemIcon>
          <ListItemText primary="Editare Profil" />
        </ListItemButton>
      </Link>
      <Link href="/apps/profiles/account/basic" passHref>
        <ListItemButton component="a" selected={selectedIndex === 1} onClick={() => handleListItemClick(1)} sx={linkStyle}>
          <ListItemIcon>
            <UserOutlined />
          </ListItemIcon>
          <ListItemText primary="Vizualizare Profil" />
        </ListItemButton>
      </Link>
      <ListItemButton selected={selectedIndex === 2} onClick={handleLogout} sx={linkStyle}>
        <ListItemIcon>
          <LogoutOutlined />
        </ListItemIcon>
        <ListItemText primary="Deconectare" />
      </ListItemButton>
    </List>
  );
};

ProfileTab.propTypes = {
  handleLogout: PropTypes.func.isRequired
};

export default ProfileTab;
