import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// next
import NextLink from 'next/link';

// material-ui
import { Box, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

// project import
import Dot from '../../../components/@extended/Dot';

// ==============================|| ORDER TABLE - STATUS ||============================== //

const OrderStatus = ({ status }) => {
  let color;
  let title;

  switch (status) {
    case 3:
      color = 'warning';
      title = 'În așteptare';
      break;
    case 1:
      color = 'success';
      title = 'Acceptat';
      break;
    case 2:
      color = 'error';
      title = 'Refuzat';
      break;
    default:
      color = 'primary';
      title = 'Invalid';
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
};

OrderStatus.propTypes = {
  status: PropTypes.number
};

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //

const headCells = [
  {
    id: 'id',
    align: 'left',
    disablePadding: false,
    label: 'Id'
  },
  {
    id: 'name',
    align: 'left',
    disablePadding: true,
    label: 'Nume Prenume'
  },
  {
    id: 'faculty',
    align: 'right',
    disablePadding: false,
    label: 'Facultate'
  },
  {
    id: 'scholarship',
    align: 'right',
    disablePadding: false,
    label: 'Bursă'
  },
  {
    id: 'status',
    align: 'left',
    disablePadding: false,
    label: 'Status'
  }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

const OrderTableHead = ({ order, orderBy }) => (
  <TableHead>
    <TableRow>
      {headCells.map((headCell) => (
        <TableCell
          key={headCell.id}
          align={headCell.align}
          padding={headCell.disablePadding ? 'none' : 'normal'}
          sortDirection={orderBy === headCell.id ? order : false}
        >
          {headCell.label}
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
);

OrderTableHead.propTypes = {
  order: PropTypes.any,
  orderBy: PropTypes.string
};

// ==============================|| ORDER TABLE ||============================== //

export default function OrdersList() {
  const [order] = useState('asc');
  const [orderBy] = useState('createdAt');
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/studenti');
        const data = await response.json();
     
        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sortează crescător
        setStudents(sortedData.slice(0, 5)); // Ia primii 5
      } catch (error) {
        console.error('Failed to fetch students:', error);
      }
    };

    fetchStudents();
  }, []);

 
  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table aria-labelledby="tableTitle">
          <OrderTableHead order={order} orderBy={orderBy} />
          <TableBody>
            {students.map((student, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;
              const utilizator = student.utilizator;
              const solicitare = utilizator?.solicitari?.[0] || {};
              const facultateNameInitials = student?.facultate?.facultate
              .split(' ')
              .filter(word => word.charAt(0) === word.charAt(0).toUpperCase())
              .map(word => word.charAt(0))
              .join('');
              return (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  tabIndex={-1}
                  key={student.id}
                >
                  <TableCell component="th" id={labelId} scope="row" align="left">
                    <NextLink href="/" passHref legacyBehavior>
                      <Link color="secondary">{utilizator ? utilizator.CNP : 'N/A'}</Link>
                    </NextLink>
                  </TableCell>
                  <TableCell align="left">{utilizator ? `${utilizator.Nume} ${utilizator.Prenume}` : 'N/A'}</TableCell>
                  <TableCell align="right">{facultateNameInitials}</TableCell>
                  <TableCell align="right">{solicitare.denumireBursa || 'N/A'}</TableCell>
                  <TableCell align="left"><OrderStatus status={solicitare.idStatus} /></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
