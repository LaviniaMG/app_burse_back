import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { Box, Modal, Stack } from '@mui/material';
import FormStudentAdd from './FormStudentAdd'; 
import MainCard from '../../../components/MainCard';
import SimpleBar from '../../../components/third-party/SimpleBar';
import CircularWithPath from '../../../components/@extended/progress/CircularWithPath';
import { useGetCustomer } from '../../../api/customer';

const CustomerModal = ({ open, modalToggler, students }) => {
  const { customersLoading: loading } = useGetCustomer();

  const closeModal = () => modalToggler(false);

  const studentForm = useMemo(
    () => !loading && <FormStudentAdd students={students || null} closeModal={closeModal} />,
    [students, loading]
  );

  return (
    <>
      {open && (
        <Modal
          open={open}
          onClose={closeModal}
          aria-labelledby="modal-student-add-label"
          aria-describedby="modal-student-add-description"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '& .MuiPaper-root:focus': {
              outline: 'none'
            }
          }}
        >
          <MainCard
            sx={{ 
              width: 'calc(100% - 48px)', 
              minWidth: 340, 
              maxWidth: 880, 
              height: 'auto', 
              maxHeight: 'calc(100vh - 48px)',
              overflow: 'auto',
              p: 2
            }}
            modal
            content={false}
          >
            <SimpleBar
              sx={{
                maxHeight: 'calc(100vh - 48px)',
                '& .simplebar-content': {
                  display: 'flex',
                  flexDirection: 'column'
                }
              }}
            >
              {loading ? (
                <Box sx={{ p: 5 }}>
                  <Stack direction="row" justifyContent="center">
                    <CircularWithPath />
                  </Stack>
                </Box>
              ) : (
                studentForm
              )}
            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
};

CustomerModal.propTypes = {
  open: PropTypes.bool,
  modalToggler: PropTypes.func,
  student: PropTypes.object
};

export default CustomerModal;
