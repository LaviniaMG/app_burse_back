'use client';

// material-ui
import {
  useMediaQuery,
  Chip,
  Divider,
  Grid,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  Stack,
  Typography
} from '@mui/material';

// third-party
import { PatternFormat } from 'react-number-format';

// project import
import MainCard from '../../../../components/MainCard';
import Avatar from '../../../../components/@extended/Avatar';
import LinearWithLabel from '../../../../components/@extended/progress/LinearWithLabel';

// assets
import { MailOutlined, PhoneOutlined } from '@ant-design/icons';

// React imports
import { useState, useEffect } from 'react';

// ==============================|| ACCOUNT PROFILE - BASIC ||============================== //

const TabProfile = () => {
  const matchDownMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const id = 1;
        const response = await fetch(`http://localhost:8080/api/studenti/${id}`);
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    return <Typography>Loading...</Typography>;
  }

  const formatFacultyName = (name) => {
    return name .split(' ')
    .filter(word => word.charAt(0) === word.charAt(0).toUpperCase())
    .map(word => word.charAt(0))
    .join('');
  };

 
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={5} md={4} xl={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MainCard>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack spacing={2.5} alignItems="center">
                    <Avatar alt="Avatar 1" size="xl" src={userData.URLPoza || "/assets/images/users/default.png"} />
                    <Stack spacing={0.5} alignItems="center">
                      <Typography variant="h5">{userData.utilizator.Nume} {userData.utilizator.Prenume}</Typography>
                      <Typography color="secondary">{"Student"}</Typography>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Stack direction="row" justifyContent="space-around" alignItems="center">
                    <Stack spacing={0.5} alignItems="center">
                      <Typography variant="h5">{userData.anFacultate}</Typography>
                      <Typography color="secondary">An</Typography>
                    </Stack>
                    <Divider orientation="vertical" flexItem />
                    <Stack spacing={0.5} alignItems="center">
                      <Typography variant="h5">{formatFacultyName(userData.facultate.facultate)}</Typography>
                      <Typography color="secondary">Facultate</Typography>
                    </Stack>
                    <Divider orientation="vertical" flexItem />
                    <Stack spacing={0.5} alignItems="center">
                      <Typography variant="h5">{userData.media}</Typography>
                      <Typography color="secondary">Medie</Typography>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <List component="nav" aria-label="main mailbox folders" sx={{ py: 0, '& .MuiListItem-root': { p: 0, py: 1 } }}>
                    <ListItem>
                      <ListItemIcon>
                        <MailOutlined />
                      </ListItemIcon>
                      <ListItemSecondaryAction>
                        <Typography align="right">{userData.utilizator.Email}</Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <PhoneOutlined />
                      </ListItemIcon>
                      <ListItemSecondaryAction>
                        <Typography align="right">{userData.utilizator.Telefon}</Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={7} md={8} xl={9}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MainCard title="Detalii">
              <List sx={{ py: 0 }}>
                <ListItem divider={!matchDownMD}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Nume</Typography>
                        <Typography>{userData.utilizator.Nume}</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Prenume</Typography>
                        <Typography>{userData.utilizator.Prenume}</Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem divider={!matchDownMD}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Telefon</Typography>
                        <Typography>
                          {userData.utilizator.Telefon && (
                            <PatternFormat value={userData.utilizator.Telefon} displayType="text" format="(###) ###-####" />
                          )}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Inițiala tatălui</Typography>
                        <Typography>{userData.utilizator.InitialaTata}</Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem divider={!matchDownMD}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Specializarea</Typography>
                        <Typography>{userData.facultate.specializare}</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Email</Typography>
                        <Typography>{userData.utilizator.Email}</Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
              </List>
            </MainCard>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default TabProfile;
