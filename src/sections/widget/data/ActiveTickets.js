// material-ui
import React, { useEffect, useState } from 'react';
import { Grid, Link, Typography } from '@mui/material';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
// assets
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { IconButton } from '@mui/material';
import { Divider } from '@mui/material';
import { format, parseISO } from 'date-fns';

const ActiveTickets = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/anunturi');
        const data = await response.json();
        setAnnouncements(data);
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        {announcements.map((announcement, index) => (
          <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: '16px',
                height: '300px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)'
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h5"
                  component="div"
                  sx={{
                    backgroundColor: '#d2dcfc',
                    color: '#022078',
                    borderRadius: 20,
                    p: 1,
                    display: 'inline-block',
                    my: 0.5
                  }}
                >
                  Anunț Burse
                </Typography>
                <Typography variant="body2">
                  {announcement.text}
                </Typography>
              </CardContent>
              <Divider />
              <CardActions sx={{ justifyContent: 'space-between' }}>
                <Typography variant="body2">{format(parseISO(announcement.dataAnuntStart), 'dd-MMM-yyyy')}</Typography>
                {announcement.documentURL && (
                  <Link href={`http://localhost:8080/${announcement.documentURL}`} download>
                    <IconButton aria-label="save">
                      <SaveAltIcon />
                    </IconButton>
                  </Link>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ActiveTickets;
