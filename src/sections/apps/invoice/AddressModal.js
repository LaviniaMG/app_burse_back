import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Button, Stack } from '@mui/material';

const AddressModal = ({ open, setOpen, handlerAddress }) => {
  const [bursaList, setBursaList] = useState([]);
  const [selectedBursa, setSelectedBursa] = useState(null);
  const [loading, setLoading] = useState(false);
  console.log("Handler address",handlerAddress)
  useEffect(() => {
    if (open) {
      setLoading(true);
      fetch('http://localhost:8080/api/tipBursa')
        .then(response => response.json())
        .then(data => {
          setBursaList(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Failed to fetch bursa types', error);
          setLoading(false);
        });
    }
  }, [open]);

  const closeAddressModal = () => {
    if (selectedBursa) {
      handlerAddress(selectedBursa);  // Trimiterea bursei selectate la componenta părinte
      console.log('Bursa selectată este: ', selectedBursa);
    } else {
      console.log('Nicio bursă selectată.');
    }
    setOpen(false);
    setSelectedBursa(null);  // Resetarea bursei selectate la închiderea ferestrei
  };
  
  const onSelectBursa = (bursa) => {
    setSelectedBursa(bursa);  // Stocarea temporară a bursei selectate
    console.log('Bursa a fost selectată: ', bursa);
  };
  

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="lg">
      <DialogTitle>Selectați o bursă</DialogTitle>
      <DialogContent>
        {loading ? <CircularProgress /> : (
          <Stack spacing={1}>
            {bursaList.map((bursa, index) => (
              <Button
                key={bursa.id || index}
                onClick={() => onSelectBursa(bursa)}
                sx={{ justifyContent: 'flex-start' }}
              >
                {bursa.denumire}
              </Button>
            ))}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={() => setOpen(false)}>Refuzați</Button>
        <Button onClick={closeAddressModal} color="primary" variant="contained">Adăugați</Button>
      </DialogActions>
    </Dialog>
  );
};

AddressModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  handlerAddress: PropTypes.func.isRequired
};

export default AddressModal;
