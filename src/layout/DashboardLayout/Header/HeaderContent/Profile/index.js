import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

// next
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, ButtonBase, CardContent, ClickAwayListener, Grid, Paper, Popper, Stack, Tab, Tabs, Tooltip, Typography } from '@mui/material';

// project import
import ProfileTab from './ProfileTab';
import Avatar from '../../../../../components/@extended/Avatar';
import MainCard from '../../../../../components/MainCard';
import Transitions from '../../../../../components/@extended/Transitions';
import IconButton from '../../../../../components/@extended/IconButton';

import useUser from '../../../../../hooks/useUser';
import { ThemeMode } from '../../../../../config';

// assets
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';

// tab panel wrapper
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`profile-tabpanel-${index}`} aria-labelledby={`profile-tab-${index}`} {...other}>
      {value === index && children}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`
  };
}

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

const Profile = () => {
  const theme = useTheme();
  const user = useUser();
  const router = useRouter();
  const { data: session } = useSession();
  const provider = session?.provider;

  const handleLogout = () => {
    switch (provider) {
      case 'auth0':
        signOut({ callbackUrl: `${process.env.NEXTAUTH_URL}/api/auth/logout/auth0` });
        break;
      case 'cognito':
        signOut({ callbackUrl: `${process.env.NEXTAUTH_URL}/api/auth/logout/cognito` });
        break;
      default:
        signOut({ redirect: false });
    }

    router.push('/login');
  };

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const iconBackColorOpen = theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'grey.100';

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <ButtonBase
        sx={{
          p: 0.25,
          bgcolor: open ? iconBackColorOpen : 'transparent',
          borderRadius: 1,
          '&:hover': { bgcolor: theme.palette.mode === ThemeMode.DARK ? 'secondary.light' : 'secondary.lighter' },
          '&:focus-visible': {
            outline: `2px solid ${theme.palette.secondary.dark}`,
            outlineOffset: 2
          }
        }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        {user && (
          <Stack direction="row" spacing={1.25} alignItems="center" sx={{ p: 0.5 }}>
            <Avatar alt={user.name} src={user.avatar} size="sm" />
            <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
              {/* {user.name && user.name} */}Graure Ionelia
            </Typography>
          </Stack>
        )}
      </ButtonBase>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 9]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" in={open} {...TransitionProps}>
            <Paper
              sx={{
                boxShadow: theme.customShadows.z1,
                width: 290,
                minWidth: 240,
                maxWidth: 290,
                [theme.breakpoints.down('md')]: {
                  maxWidth: 250
                }
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard elevation={0} border={false} content={false}>
                  <CardContent sx={{ px: 2.5, pt: 3 }}>
                    <Grid container justifyContent="space-between" alignItems="center">
                      <Grid item>
                        {user && (
                          <Stack direction="row" spacing={1.25} alignItems="center">
                            <Avatar alt='Graure Ionelia' src={user.avatar} />
                            <Stack>
                              <Typography variant="h6">Graure Ionelia</Typography>
                              <Typography variant="body2" color="textSecondary">
                              Personal adiministrativ
                              </Typography>
                            </Stack>
                          </Stack>
                        )}
                      </Grid>
                      <Grid item>
                        <Tooltip title="Logout">
                          <IconButton size="large" sx={{ color: 'text.primary' }} onClick={handleLogout}>
                            <LogoutOutlined />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </CardContent>
                  {open && (
                    <>
                      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs variant="fullWidth" value={value} onChange={handleChange} aria-label="profile tabs">
                          <Tab
                            sx={{
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                              textTransform: 'capitalize'
                            }}
                            icon={<UserOutlined style={{ marginBottom: 0, marginRight: '10px' }} />}
                            label="Profil"
                            {...a11yProps(0)}
                          />
                         
                        </Tabs>
                      </Box>
                      <TabPanel value={value} index={0} dir={theme.direction}>
                        <ProfileTab handleLogout={handleLogout} />
                      </TabPanel>
                  
                    </>
                  )}
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default Profile;
