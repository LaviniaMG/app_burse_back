import PropTypes from 'prop-types';

// material-ui
import { Button, Dialog, DialogContent, Stack, Typography } from '@mui/material';

// project import
import Avatar from '../../../components/@extended/Avatar';
import { PopupTransition } from '../../../components/@extended/Transitions';

import { openSnackbar } from '../../../api/snackbar';

// assets
import { DeleteFilled } from '@ant-design/icons';

// ==============================|| CUSTOMER - DELETE ||============================== //

async function deleteStudent(id) {
  const response = await fetch(`http://localhost:8080/api/studenti/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete student');
  }

  return response.json();
}

export default function AlertCustomerDelete({ id, title, open, handleClose }) {
  const deletehandler = async () => {
    try {
      await deleteStudent(id);
      openSnackbar({
        open: true,
        message: 'Student șters cu succes',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        variant: 'alert',
        alert: {
          color: 'success'
        }
      });
      handleClose();
    } catch (error) {
      console.error('Failed to delete student:', error);
      openSnackbar({
        open: true,
        message: 'Eroare la ștergerea studentului',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        variant: 'alert',
        alert: {
          color: 'error'
        }
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      keepMounted
      TransitionComponent={PopupTransition}
      maxWidth="xs"
      aria-labelledby="column-delete-title"
      aria-describedby="column-delete-description"
    >
      <DialogContent sx={{ mt: 2, my: 1 }}>
        <Stack alignItems="center" spacing={3.5}>
          <Avatar color="error" sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
            <DeleteFilled />
          </Avatar>
          <Stack spacing={2}>
            <Typography variant="h4" align="center">
              Sunteți sigur că vreți să ștergeți?
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ width: 1 }}>
            <Button fullWidth onClick={handleClose} color="secondary" variant="outlined">
              Nu
            </Button>
            <Button fullWidth color="error" variant="contained" onClick={deletehandler} autoFocus>
              Da
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

AlertCustomerDelete.propTypes = {
  id: PropTypes.any,
  title: PropTypes.any,
  open: PropTypes.bool,
  handleClose: PropTypes.func
};
