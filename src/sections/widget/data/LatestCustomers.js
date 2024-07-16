import NextLink from 'next/link';

// material-ui
import { CardMedia, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

// project imports
import MainCard from '../../../components/MainCard';
import SimpleBar from '../../../components/third-party/SimpleBar';

// assets
const Flag1 = '/assets/images/widget/AUSTRALIA.jpg';
const Flag2 = '/assets/images/widget/BRAZIL.jpg';
const Flag3 = '/assets/images/widget/GERMANY.jpg';
const Flag4 = '/assets/images/widget/UK.jpg';
const Flag5 = '/assets/images/widget/USA.jpg';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { IconButton } from '../../../../node_modules/@mui/material/index';
// table data
function createData(image, subject, dept, date) {
  return { image, subject, dept, date };
}

const rows = [
  createData(Flag1, 'Germany', 'Angelina Jolly', 'Cerere pentru bursa sociala'),
  createData(Flag2, 'USA', 'John Deo', 'Adeverinta'),
  createData(Flag3, 'Australia', 'Jenifer Vintage', 'Cerere'),
  createData(Flag4, 'United Kingdom', 'Lori Moore', 'Cerere bursa'),
  createData(Flag5, 'Brazil', 'Allianz Dacron', '3.56%'),
  createData(Flag1, 'Australia', 'Jenifer Vintage', '12.45%'),
  createData(Flag3, 'USA', 'John Deo', '25.23%'),
  createData(Flag5, 'Australia', 'Jenifer Vintage', '12.45%'),
  createData(Flag2, 'United Kingdom', 'Lori Moore', '8.65%')
];

// =========================|| DATA WIDGET - LATEST CUSTOMERS ||========================= //
const LatestCustomers = () => (
  <MainCard title="Documente utile" content={false}>
    <SimpleBar sx={{ height: 290 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ pl: 3 }}>#</TableCell>
              <TableCell align="right" sx={{ pr: 3 }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow hover key={index}>
                <TableCell sx={{ pl: 3 }}>
                  <Link href='/assets/third-party/test.pdf' download>
                    <IconButton>
                      <SaveAltIcon />
                    </IconButton>
                  </Link>
                </TableCell>
                <TableCell align="left" sx={{ pr: 3 }}>
                 
                    {row.date}
                  
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </SimpleBar>
  </MainCard>
);
export default LatestCustomers;
