'use client'
import PropTypes from 'prop-types';
import { Fragment, useMemo, useState, useEffect } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery
} from '@mui/material';

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';

// project-import
import ScrollX from '../../../components/ScrollX';
import MainCard from '../../../components/MainCard';
import Avatar from '../../../components/@extended/Avatar';
import IconButton from '../../../components/@extended/IconButton';

import {
  CSVExport,
  DebouncedInput,
  HeaderSort,
  IndeterminateCheckbox,
  RowSelection,
  SelectColumnSorting,
  TablePagination
} from '../../../components/third-party/react-table';

import EmptyReactTable from '../../../views/tables/react-table/emptyUser';
import CustomerModal from '../../../sections/apps/customer/CustomerModal';
import AlertCustomerDelete from '../../../sections/apps/customer/AlertCustomerDelete';
import ExpandingUserDetail from '../../../sections/apps/customer/ExpandingUserDetail';

// assets
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';

export const fuzzyFilter = (row, columnId, value, addMeta) => {
  // rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // store the ranking info
  addMeta(itemRank);

  // return if the item should be filtered in/out
  return itemRank.passed;
};

// ==============================|| REACT TABLE - LIST ||============================== //

function ReactTable({ data, columns, modalToggler }) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const [sorting, setSorting] = useState([
    {
      id: 'id',
      desc: true
    }
  ]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection,
      globalFilter
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getRowCanExpand: () => true,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    globalFilterFn: fuzzyFilter,
    debugTable: true
  });

  const backColor = alpha(theme.palette.primary.lighter, 0.1);
  let headers = [];
  columns.map(
    (columns) =>
      columns.accessorKey &&
      headers.push({
        label: typeof columns.header === 'string' ? columns.header : '#',
        key: columns.accessorKey
      })
  );

  return (
    <MainCard content={false}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{ padding: 2, ...(matchDownSM && { '& .MuiOutlinedInput-root, & .MuiFormControl-root': { width: '100%' } }) }}
      >
        <DebouncedInput
          value={globalFilter ?? ''}
          onFilterChange={(value) => setGlobalFilter(String(value))}
          placeholder={`Cauta in ${data.length} inregistrari...`}
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <SelectColumnSorting {...{ getState: table.getState, getAllColumns: table.getAllColumns, setSorting }} />
          <Stack direction="row" spacing={2} alignItems="center">
            <Button variant="contained" startIcon={<PlusOutlined />} onClick={modalToggler}>
              Adaugă un student
            </Button>
            <CSVExport
  {...{
    data: (table.getSelectedRowModel().flatRows.length === 0 ? data : table.getSelectedRowModel().flatRows.map((row) => row.original)).map((row) => {
      const statusText = row.utilizator.solicitari.length > 0 ? 
        (row.utilizator.solicitari[0].idStatus === 1 ? 'Acceptat' : row.utilizator.solicitari[0].idStatus === 3 ? 'În așteptare' : 'Refuzat') : 'Nicio solicitare';

      return {
        ...row,
        numeComplet: `${row.utilizator.Nume} ${row.utilizator.Prenume}`,
        status: statusText,
      };
    }),
    headers: [
      { label: '#', key: 'id' },
      { label: 'An', key: 'anFacultate' },
      { label: 'Facultate', key: 'facultate.facultate' },
      { label: 'Media', key: 'media' },
      { label: 'Status', key: 'status' },  // Adăugăm un header specific pentru status
      { label: 'Nume Complet', key: 'numeComplet' },
    ],
    filename: 'studenti-lista.csv',
  }}
/>

          </Stack>
        </Stack>
      </Stack>
      <ScrollX>
        <Stack>
          <RowSelection selected={Object.keys(rowSelection).length} />
          <TableContainer>
            <Table>
              <TableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      if (header.column.columnDef.meta !== undefined && header.column.getCanSort()) {
                        Object.assign(header.column.columnDef.meta, {
                          className: header.column.columnDef.meta.className + ' cursor-pointer prevent-select'
                        });
                      }

                      return (
                        <TableCell
                          key={header.id}
                          {...header.column.columnDef.meta}
                          onClick={header.column.getToggleSortingHandler()}
                          {...(header.column.getCanSort() &&
                            header.column.columnDef.meta === undefined && {
                              className: 'cursor-pointer prevent-select'
                            })}
                        >
                          {header.isPlaceholder ? null : (
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Box>{flexRender(header.column.columnDef.header, header.getContext())}</Box>
                              {header.column.getCanSort() && <HeaderSort column={header.column} />}
                            </Stack>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <Fragment key={row.id}>
                    <TableRow>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                    {row.getIsExpanded() && (
                      <TableRow sx={{ bgcolor: backColor, '&:hover': { bgcolor: `${backColor} !important` } }}>
                        <TableCell colSpan={row.getVisibleCells().length}>
                          <ExpandingUserDetail data={row.original} />
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <>
            <Divider />
            <Box sx={{ p: 2 }}>
              <TablePagination
                {...{
                  setPageSize: table.setPageSize,
                  setPageIndex: table.setPageIndex,
                  getState: table.getState,
                  getPageCount: table.getPageCount
                }}
              />
            </Box>
          </>
        </Stack>
      </ScrollX>
    </MainCard>
  );
}

ReactTable.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array,
  modalToggler: PropTypes.func
};

// ==============================|| CUSTOMER LIST ||============================== //

const CustomerListPage = () => {
  const theme = useTheme();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [customerModal, setCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDeleteId, setCustomerDeleteId] = useState('');

  const handleClose = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/studenti');
        const data = await response.json();
         // pentru a afisa doar cei cu cel putin o solicitare
         const filteredStudents = data.filter(student => student.utilizator?.solicitari.length > 0);
        console.log('Studenti: ', filteredStudents);
         setStudents(filteredStudents);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching students:', error);
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
        ),
        cell: ({ row }) => (
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
          />
        )
      },
      {
        header: '#',
        accessorKey: 'id',
        meta: {
          className: 'cell-center'
        }
      },
      {
        header: 'Nume Prenume',
        cell: ({ row }) => (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar alt="Avatar 1" size="sm" src={`/assets/images/users/avatar-${!row.original.avatar ? 1 : row.original.avatar}.png`} />
            <Stack spacing={0}>
              <Typography variant="subtitle1">
                {row.original.utilizator.Nume} {row.original.utilizator.Prenume}
              </Typography>
            </Stack>
          </Stack>
        )
      },
      {
        header: 'An',
        accessorKey: 'anFacultate',
        meta: {
          className: 'cell-right'
        }
      },
      {
        header: 'Facultate',
        accessorKey: 'facultate.facultate'
      },
      {
        header: 'Media',
        accessorKey: 'media',
        label: 9.2
      },
      {
        header: 'Status',
        accessorKey: 'utilizator',  
        cell: (cell) => {
          const utilizator = cell.getValue();
          const solicitari = utilizator.solicitari; 
           console.log(solicitari);
          if (solicitari && solicitari.length > 0) {
             const status = solicitari[0].idStatus;
            
            switch (status) {
              case 3:
                return <Chip color="info" label="În așteptare" size="small" variant="light" />;
              case 1:
                return <Chip color="success" label="Acceptat" size="small" variant="light" />;
              case 2:
              default:
                return <Chip color="error" label="Refuzat" size="small" variant="light" />;
            }
          } else {
            return <Chip color="default" label="Nicio solicitare" size="small" variant="outlined" />;
          }
        }
      },
      
      
      {
        header: 'Actiuni',
        className: 'cell-center',
        disableSortBy: true,
        cell: ({ row }) => {
          const collapseIcon =
            row.getCanExpand() && row.getIsExpanded() ? (
              <PlusOutlined style={{ color: theme.palette.error.main, transform: 'rotate(45deg)' }} />
            ) : (
              <EyeOutlined />
            );
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              <Tooltip title="Detalii">
                <IconButton color="secondary" onClick={row.getToggleExpandedHandler()}>
                  {collapseIcon}
                </IconButton>
              </Tooltip>
              <Tooltip title="Editare">
                <IconButton
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCustomer(row.original);
                    setCustomerModal(true);
                  }}
                >
                  <EditOutlined />
                </IconButton>
              </Tooltip>
              <Tooltip title="Ștergere">
                <IconButton
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClose();
                    setCustomerDeleteId(row.original.id);
                  }}
                >
                  <DeleteOutlined />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        }
      }
    ],
    [theme]
  );

  if (loading) return <EmptyReactTable />;

  return (
    <>
      <ReactTable
        {...{
          data: students,
          columns,
          modalToggler: () => {
            setCustomerModal(true);
            setSelectedCustomer(null);
          }
        }}
      />
      <AlertCustomerDelete id={customerDeleteId} title={customerDeleteId} open={open} handleClose={handleClose} />
      <CustomerModal open={customerModal} modalToggler={setCustomerModal} students={selectedCustomer} />
    </>
  );
};

export default CustomerListPage;
