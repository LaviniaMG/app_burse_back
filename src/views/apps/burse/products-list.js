'use client';
import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Grid, Typography, Button } from '@mui/material';
import moment from 'moment';
import LoadingButton from '../../../components/@extended/LoadingButton';
import { SendOutlined } from '@mui/icons-material';
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;
import ReactQuillDemo from '../../../sections/forms/plugins/ReactQuill';
import DropzonePage from '../../../views/forms/plugins/dropzone';
import { openSnackbar } from '../../../api/snackbar';

const SemestruPage = () => {
  const [loading, setLoading] = useState({ submit: false });
  const [dates, setDates] = useState([]);
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementDates, setAnnouncementDates] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [studentEmails, setStudentEmails] = useState([]);

  const fetchStudentEmails = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/studenti');
      const data = await response.json();
      if (response.ok) {
        const emails = data.map(student => student.utilizator.Email);
        setStudentEmails(emails);
      } else {
        throw new Error('Failed to fetch student emails');
      }
    } catch (error) {
      console.error('Error fetching student emails:', error);
    }
  };

  useEffect(() => {
    fetchStudentEmails();
  }, []);

  const sendEmails = async () => {
    setLoading({ submit: true });
    try {
      const response = await fetch('http://localhost:8080/api/send-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subject: 'Publicarea burselor',
          body: 'Vă rugăm verificați site-ul pentru acordarea burselor, iar în secțiune de anunțuri veți găsi listele cu studenții ce au obținut bursa!',
          recipients: studentEmails.join(',')
        })
      });

      if (response.ok) {
        openSnackbar({
          open: true,
          message: 'Emailuri trimise cu succes!',
          variant: 'alert',
          alert: {
            color: 'success',
            variant: 'filled'
          }
        });
      } else {
        throw new Error('Failed to send emails');
      }
    } catch (error) {
      openSnackbar({
        open: true,
        message: `Eroare la trimiterea emailurilor: ${error.message}`,
        variant: 'alert',
        alert: {
          color: 'error',
          variant: 'filled'
        }
      });
    } finally {
      setLoading({ submit: false });
    }
  };

  const publishSemester = async () => {
    setLoading({ submit: true });
    try {
      const formattedStartDate = dates[0] ? moment(dates[0]).format('YYYY-MM-DD') : '';
      const formattedEndDate = dates[1] ? moment(dates[1]).format('YYYY-MM-DD') : '';

      if (!formattedStartDate || !formattedEndDate) {
        openSnackbar({
          open: true,
          message: 'Te rugăm să selectezi ambele date pentru semestru.',
          variant: 'alert',
          alert: {
            color: 'warning'
          }
        });
        setLoading({ submit: false });
        return;
      }

      const response = await fetch('http://localhost:8080/api/semestru', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataStart: formattedStartDate,
          dataFinal: formattedEndDate
        })
      });

      const data = await response.json();
      if (response.ok) {
        openSnackbar({
          open: true,
          message: 'Datele pentru începerea și terminarea semestrului au fost actualizate!',
          variant: 'alert',
          alert: {
            color: 'success',
            variant: 'filled'
          }
        });
      } else {
        throw new Error(data.message || 'Eroare la actualizarea semestrului!');
      }
    } catch (error) {
      openSnackbar({
        open: true,
        message: error.message,
        variant: 'alert',
        alert: {
          color: 'error'
        }
      });
    } finally {
      setLoading({ submit: false });
    }
  };

  const publishAnnouncement = async () => {
    try {
      const formData = new FormData();
      formData.append('text', announcementText.replace(/<[^>]*>?/gm, ''));
      if (uploadedFile) {
        formData.append('file', uploadedFile);
      }
      formData.append('dataAnuntStart', announcementDates[0] ? moment(announcementDates[0]).format('YYYY-MM-DD') : '');
      formData.append('dataAnuntFinal', announcementDates[1] ? moment(announcementDates[1]).format('YYYY-MM-DD') : '');
      formData.append('idUtilizator', 3);

      const response = await fetch('http://localhost:8080/api/anunturi/create', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        openSnackbar({
          open: true,
          message: 'Anunțul a fost publicat cu succes!',
          variant: 'alert',
          alert: {
            color: 'success'
          }
        });
      } else {
        throw new Error('Selectați textul și data valabilității anunțului!');
      }
    } catch (error) {
      openSnackbar({
        open: true,
        message: error.message,
        variant: 'alert',
        alert: {
          color: 'error'
        }
      });
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Card sx={{ flexGrow: 3 }}>
        <CardContent>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} md={12}>
              <Typography variant="h3" gutterBottom>
                Selectează Data:
              </Typography>
              <div style={{ marginBottom: 20, marginLeft: 195 }}>
                <RangePicker
                  format="DD-MMM-YYYY"
                  placeholder={['Data de început', 'Data de sfârșit']}
                  onChange={(values) => {
                    if (values && values.length === 2) {
                      setDates([values[0].format('DD-MMM-YYYY'), values[1].format('DD-MMM-YYYY')]);
                    } else {
                      setDates([]);
                    }
                  }}
                />
              </div>
              <Grid item xs={12} style={{ textAlign: 'right' }}>
                <Button variant="contained" color="primary" onClick={publishSemester}>
                  Publică
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h3" gutterBottom>
                Trimiteți email către studenți:
              </Typography>
              <div style={{ marginBottom: 20, marginLeft: 90 }}>
                <LoadingButton
                  loading={loading.submit}
                  color="warning"
                  variant="dashed"
                  shape="rounded"
                  onClick={sendEmails}
                >
                  <SendOutlined />
                </LoadingButton>
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="left" justify="center">
            <Grid item xs={12}>
              <Typography variant="h3">Publică anunțuri:</Typography>
            </Grid>
            <Grid item xs={12} style={{ padding: '20px' }}>
              <ReactQuillDemo theme="snow" value={announcementText} onChange={setAnnouncementText} />
            </Grid>
            <Grid item xs={12} style={{ padding: '20px' }}>
              <RangePicker
                format="DD-MMM-YYYY"
                onChange={(values) => {
                  if (values && values.length === 2) {
                    setAnnouncementDates([values[0].format('DD-MMM-YYYY'), values[1].format('DD-MMM-YYYY')]);
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} style={{ padding: '20px' }}>
              <DropzonePage onFileUpload={setUploadedFile} />
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'right' }}>
              <Button variant="contained" color="primary" onClick={publishAnnouncement}>
                Publică
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SemestruPage;
