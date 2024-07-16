import PropTypes from 'prop-types';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { openSnackbar } from '../../../api/snackbar';
import {
  useMediaQuery,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { useState, useEffect } from 'react';
import { PatternFormat } from 'react-number-format';
import MainCard from '../../../components/MainCard';
import Avatar from '../../../components/@extended/Avatar';
import { MailOutlined, PhoneOutlined, EditOutlined } from '@ant-design/icons';

const ExpandingUserDetail = ({ data }) => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));
  const userIBAN = data.utilizator.conturi && data.utilizator.conturi[0] && data.utilizator.conturi[0].IBAN 
    ? data.utilizator.conturi[0].IBAN 
    : 'IBAN indisponibil';

  const facultateNameInitials = data.facultate.facultate
  .split(' ')
  .filter(word => word.charAt(0) === word.charAt(0).toUpperCase())
  .map(word => word.charAt(0))
  .join('');

  const handleDownload = async (studentId, requestId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/solicitari/${studentId}/requests/${requestId}/download`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'document.pdf'); // Specificăm numele fișierului
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  const renderStatusChip = (idStatus) => {
    switch (idStatus) {
      case 1:
        return <Chip color="success" label="Acceptat" size="small" variant="light" />;
      case 2:
        return <Chip color="error" label="Refuzat" size="small" variant="light" />;
      case 3:
      default:
        return <Chip color="info" label="În așteptare" size="small" variant="light" />;
    }
  };

  const [open, setOpen] = useState(false);
  const [currentRequestIndex, setCurrentRequestIndex] = useState(null);
  const [bursaOptions, setBursaOptions] = useState([]);
  const [statusOptions] = useState([
    { value: 1, label: 'Acceptat' },
    { value: 2, label: 'Refuzat' },
    { value: 3, label: 'În așteptare' }
  ]);
  const [currentRequestData, setCurrentRequestData] = useState({
    denumireBursa: '',
    idStatus: '',
    document: null
  });

  const handleEdit = async (index) => {
    setCurrentRequestIndex(index);
    const request = data.utilizator.solicitari[index];
    setCurrentRequestData({
      denumireBursa: request.denumireBursa,
      idStatus: request.idStatus,
      idBursa: request.idBursa,
      document: null
    });
    setOpen(true);

    try {
      const response = await fetch('http://localhost:8080/api/tipBursa');
      const data = await response.json();
      setBursaOptions(data);
    } catch (error) {
      console.error('Failed to fetch bursas:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentRequestIndex(null);
  };

  const handleSave = async () => {
    if (currentRequestIndex === null) return;
    const currentRequest = data.utilizator.solicitari[currentRequestIndex];

    try {
      const formData = new FormData();
      formData.append('denumireBursa', currentRequestData.denumireBursa);
      formData.append('idStatus', currentRequestData.idStatus);
      if (currentRequestData.document) {
        formData.append('document', currentRequestData.document);
      }

      const response = await axios.put(`http://localhost:8080/api/solicitari/${currentRequest.idSolicitare}`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });


      if (response.status === 200) {
        openSnackbar({
          open: true,
          message: 'Solicitare editată cu succes',
          variant: 'alert',
          alert: {
            color: 'success'
          }
        });
        setOpen(false);
        setCurrentRequestIndex(null);
      }
    } catch (error) {
      openSnackbar({
        open: true,
        message: 'Eroare la editarea solicitării',
        variant: 'alert',
        alert: {
          color: 'error'
        }
      });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'denumireBursa') {
      const selectedBursa = bursaOptions.find(bursa => bursa.denumire === value);
      setCurrentRequestData((prevState) => ({
        ...prevState,
        [name]: value,
        idBursa: selectedBursa.idBursa
      }));
    } else {
      setCurrentRequestData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setCurrentRequestData((prevState) => ({ ...prevState, document: file }));
  };

  const canDownload = (idBursa) => [4, 6, 7, 8,9,10,11].includes(idBursa);
  
  const canEdit = (idBursa) => [4, 6, 7, 8,9,10,11].includes(idBursa);

  return (
    <>
      <Grid container spacing={2.5} sx={{ pl: { xs: 0, sm: 5, md: 6, lg: 10, xl: 12 } }}>
        <Grid item xs={12} sm={5} md={4} xl={3.5}>
          <MainCard>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={2.5} alignItems="center">
                  <Avatar alt="Avatar" size="xl" src={data.utilizator.URLPoza || `/assets/images/users/avatar-${data.avatar}.png`} />
                  <Stack spacing={0.5} alignItems="center">
                    <Typography variant="h5">
                      {data.utilizator.Nume} {data.utilizator.Prenume}
                    </Typography>
                    <Typography color="secondary">student</Typography>
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" justifyContent="space-around" alignItems="center">
                  <Stack spacing={0.5} alignItems="center">
                    <Typography variant="h5">{data.anFacultate}</Typography>
                    <Typography color="secondary">An</Typography>
                  </Stack>
                  <Divider orientation="vertical" flexItem />
                  <Stack spacing={0.5} alignItems="center">
                    <Typography variant="h5">{facultateNameInitials}</Typography>
                    <Typography color="secondary">Facultate</Typography>
                  </Stack>
                  <Divider orientation="vertical" flexItem />
                  <Stack spacing={0.5} alignItems="center">
                    <Typography variant="h5">{data.media}</Typography>
                    <Typography color="secondary">Medie</Typography>
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <List component="nav" aria-label="main mailbox folders" sx={{ py: 0, '& .MuiListItem-root': { p: 0 } }}>
                  <ListItem>
                    <ListItemIcon>
                      <MailOutlined />
                    </ListItemIcon>
                    <ListItemText primary={<Typography color="secondary">Email</Typography>} />
                    <ListItemSecondaryAction>
                      <Typography align="right">{data.utilizator.Email}</Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PhoneOutlined />
                    </ListItemIcon>
                    <ListItemText primary={<Typography color="secondary">Telefon</Typography>} />
                    <ListItemSecondaryAction>
                      <Typography align="right">
                        {data.utilizator.Telefon ? (
                          <PatternFormat displayType="text" format=" (###) ###-####" mask="_" defaultValue={data.utilizator.Telefon} />
                        ) : 'N/A'}
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
        <Grid item xs={12} sm={7} md={8} xl={8.5}>
          <Stack spacing={2.5}>
            <MainCard title="Detalii">
              <List sx={{ py: 0 }}>
                <ListItem divider={!matchDownMD}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Nume Prenume</Typography>
                        <Typography>
                          {data.utilizator.Nume} {data.utilizator.Prenume}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Inițiala tatălui</Typography>
                        <Typography>{data.utilizator.InitialaTata}</Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem divider={!matchDownMD}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">IBAN</Typography>
                        <Typography>
                          {userIBAN}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Specializare</Typography>
                        <Typography>
                          {data.facultate?.specializare}
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem divider={!matchDownMD}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={12}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Burse la care a aplicat</Typography>
                        {data.utilizator.solicitari && data.utilizator.solicitari.length > 0 
                          ? (
                            <TableContainer component={Paper}>
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Denumire Bursă</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Download</TableCell>
                                    <TableCell>Editare</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {data.utilizator.solicitari.map((solicitare, index) => (
                                    <TableRow key={index}>
                                      <TableCell>{solicitare.denumireBursa || 'N/A'}</TableCell>
                                      <TableCell>{renderStatusChip(solicitare.idStatus)}</TableCell>
                                      <TableCell>
                                        {canDownload(solicitare.idBursa) && (
                                          <Button variant="outlined" onClick={() => handleDownload(data.id, solicitare.idSolicitare)}>
                                            Descărcare
                                          </Button>
                                          
                                        )}
                                      </TableCell>
                                      <TableCell>
                                       
                                          <Button startIcon={<EditOutlined />} onClick={() => handleEdit(index)}>
                                          
                                          </Button>
                                        
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          )
                          : <Typography>Nicio solicitare</Typography>}
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
              </List>
            </MainCard>
          </Stack>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Editează Solicitarea</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="denumire-bursa-label">Denumire Bursa</InputLabel>
                <Select
                  labelId="denumire-bursa-label"
                  name="denumireBursa"
                  value={currentRequestData.denumireBursa}
                  onChange={handleChange}
                  label="Denumire Bursa"
                
                >
                  {bursaOptions.map((bursa) => (
                    <MenuItem key={bursa.id} value={bursa.denumire}>
                      {bursa.denumire}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  name="idStatus"
                  value={currentRequestData.idStatus}
                  onChange={handleChange}
                  label="Status"
                 
                >
                  {statusOptions.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {canEdit(currentRequestData.idBursa) && (
              <Grid item xs={12}>
                <Button variant="contained" component="label">
                  Încarcă document
                  <input type="file" hidden onChange={handleFileChange} />
                </Button>
                {currentRequestData.document && <Typography>{currentRequestData.document.name}</Typography>}
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Anulează
          </Button>
          <Button onClick={handleSave} color="primary">
            Salvează
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

ExpandingUserDetail.propTypes = {
  data: PropTypes.object.isRequired
};

export default ExpandingUserDetail;
