import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Button, Typography, Paper, IconButton, CardMedia } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'; // Iconița pentru fișiere
import DeleteIcon from '@mui/icons-material/Delete'; // Iconița pentru ștergere

const UploadCover = '/assets/images/upload/upload.svg'; // Imaginea pentru zona de drop

const DropZone = ({ onFileUpload }) => {
  const [file, setFile] = useState(null);
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: acceptedFiles => {
      setFile(acceptedFiles[0]); // Preia doar primul fișier acceptat
      onFileUpload(acceptedFiles[0]); // Trimite imediat fișierul pentru procesare ulterioară
    }
  });

  const handleRemoveFile = () => {
    setFile(null); // Șterge fișierul din starea locală
    onFileUpload(null); // Opțional, notifică componenta părinte despre ștergerea fișierului
  };

  return (
    <Box sx={{ p: 2 }}>
      <Paper
        {...getRootProps()}
        sx={{
          display: 'flex',
         justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          backgroundColor: 'background.default',
          border: '3px dashed', // Mărește grosimea liniei pentru a o face mai vizibilă
          borderColor: 'divider',
          borderRadius: 4, // Rotunjire ușor mai pronunțată
          padding: 4, // Mai mult spațiu în interior
          width: '100%',
          minHeight: '300px', // Ocupă 90% din lățimea containerului părinte
           '&:hover': {
            backgroundColor: 'action.hover',
          }
        }}
        
      >
        <input {...getInputProps()} />
        <CardMedia
          component="img"
          image={UploadCover}
          sx={{ width: 'auto', minHeight: 200, marginRight: 2 }}
        />
        <Box sx={{ textAlign: 'left' }}>
           <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Vă rugăm atașați documentele necesare ! 
          </Typography>
          <Typography variant="h6" sx={{ mb: 2 }}>
          Puteți face drag and drop sau dați click aici.
          </Typography>
        </Box>
      </Paper>
      {file && (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, justifyContent: 'center' }}>
          <InsertDriveFileIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="body1" sx={{ flexGrow: 1 }}>{file.name}</Typography>
          <IconButton onClick={handleRemoveFile} color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default DropZone;
