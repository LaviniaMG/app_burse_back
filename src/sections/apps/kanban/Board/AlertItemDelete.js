import PropTypes from 'prop-types';

// material-ui
import { Button, Dialog, DialogContent, Stack, Typography } from '@mui/material';

// project import
import Avatar from '../../../../components/@extended/Avatar';
import { PopupTransition } from '../../../../components/@extended/Transitions';

// assets
import { DeleteFilled } from '@ant-design/icons';

// ==============================|| KANBAN BOARD - ITEM DELETE ||============================== //

export default function AlertItemDelete({ title, open, handleClose }) {
  return (
    <Dialog
      open={open}
      onClose={() => handleClose(false)}
      TransitionComponent={PopupTransition}
      keepMounted
      maxWidth="xs"
      aria-labelledby="item-delete-title"
      aria-describedby="item-delete-description"
    >
      <DialogContent sx={{ mt: 2, my: 1 }}>
        <Stack alignItems="center" spacing={3.5}>
          <Avatar color="error" sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
            <DeleteFilled />
          </Avatar>
          <Stack spacing={2}>
            <Typography variant="h4" align="center">
            Sunteți sigur că vreți să ștergeți?     </Typography>
           
          </Stack>

          <Stack direction="row" spacing={2} sx={{ width: 1 }}>
            <Button fullWidth onClick={() => handleClose(false)} color="secondary" variant="outlined">
              Nu
            </Button>
            <Button fullWidth color="error" variant="contained" onClick={() => handleClose(true)} autoFocus>
              Da
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

AlertItemDelete.propTypes = {
  title: PropTypes.string,
  open: PropTypes.bool,
  handleClose: PropTypes.func
};
