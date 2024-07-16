import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Box, Button, Stack } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import RejectionFiles from './RejectionFiles';
import PlaceholderContent from './PlaceholderContent';
import FilesPreview from './FilesPreview';

const DropzoneWrapper = styled('div')(({ theme }) => ({
  outline: 'none',
  padding: theme.spacing(5, 1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  border: `1px dashed ${theme.palette.secondary.main}`,
  '&:hover': { opacity: 0.72, cursor: 'pointer' }
}));

const MultiFileUpload = ({ error, files, setFieldValue, sx, onUpload }) => {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple: false,
    onDrop: (acceptedFiles) => {
      // Since only one file is allowed, always pick the first one
      const file = acceptedFiles[0];
      if (file) {
        setFieldValue('file', {
          ...file,
          preview: URL.createObjectURL(file)
        });
      }
    }
  });

  const onRemoveFile = () => {
    setFieldValue('file', null);
  };

  return (
    <>
      <Box sx={{ width: '100%', ...sx }}>
        <DropzoneWrapper {...getRootProps()} sx={{
            ...(isDragActive && { opacity: 0.72 }),
            ...((isDragReject || error) && {
              color: 'error.main',
              borderColor: 'error.light',
              bgcolor: 'error.lighter'
            })
          }}>
          <input {...getInputProps()} />
          {files ? (
            <FilesPreview file={files} onRemove={onRemoveFile} />
          ) : (
            <PlaceholderContent />
          )}
        </DropzoneWrapper>
        {fileRejections.length > 0 && <RejectionFiles fileRejections={fileRejections} />}
      </Box>
      <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ mt: 1.5 }}>
        <Button color="inherit" size="small" onClick={onRemoveFile}>
          Remove
        </Button>
        <Button size="small" variant="contained" onClick={onUpload}>
          Upload File
        </Button>
      </Stack>
    </>
  );
};

MultiFileUpload.propTypes = {
  error: PropTypes.bool,
  files: PropTypes.object,
  setFieldValue: PropTypes.func,
  onUpload: PropTypes.func,
  sx: PropTypes.object
};

export default MultiFileUpload;
