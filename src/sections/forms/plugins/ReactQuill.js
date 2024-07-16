import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from '@mui/material/styles';

// third party
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false
});

const ReactQuillDemo = ({ value, onChange }) => {
  const theme = useTheme();

  const toolbarOptions = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ align: [] }],
    ['bold', 'italic', 'underline'],
    ['link'],
    [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
    ['clean']
  ];

  const modules = {
    toolbar: toolbarOptions
  };

  useEffect(() => {
    const applyTheme = () => {
      const editor = document.querySelector('.ql-editor');
      if (editor) {
        editor.style.color = theme.palette.mode === 'dark' ? 'white' : 'black';
        editor.style.backgroundColor = theme.palette.mode === 'dark' ? '#333' : 'white';
      }
    };

    applyTheme();
    return () => applyTheme(); // Apply theme on component update
  }, [theme.palette.mode]);

  return <ReactQuill value={value} modules={modules} onChange={onChange} placeholder="Introduceți un anunț..." />;
};

export default ReactQuillDemo;
