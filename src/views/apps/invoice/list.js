'use client';

import PropTypes from 'prop-types';
import { Fragment, useMemo, useState, useEffect } from 'react';
// next
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';

// third-party
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';

// project-imports
import ScrollX from '../../../components/ScrollX';
import MainCard from '../../../components/MainCard';
import Avatar from '../../../components/@extended/Avatar';
import IconButton from '../../../components/@extended/IconButton';
import Breadcrumbs from '../../../components/MainCard';
import InvoiceCard from '../../../components/cards/invoice/InvoiceCard';
import InvoiceChart from '../../../components/cards/invoice/InvoiceChart';
import LinearWithLabel from '../../../components/@extended/progress/LinearWithLabel';
import EmptyReactTable from '../../../views/tables/react-table/empty';
import AlertColumnDelete from '../../../sections/apps/kanban/Board/AlertColumnDelete';

import { APP_DEFAULT_PATH } from '../../../config';
import { handlerDelete, deleteInvoice, useGetInvoice, useGetInvoiceMaster } from '../../../api/invoice';
import { openSnackbar } from '../../../api/snackbar';

import {
  CSVExport,
  DebouncedInput,
  HeaderSort,
  IndeterminateCheckbox,
  RowSelection,
  SelectColumnSorting,
  TablePagination,
} from '../../../components/third-party/react-table';

// assets
import { DeleteOutlined, EditOutlined, EyeOutlined, FileDoneOutlined, InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';

export const fuzzyFilter = (row, columnId, value, addMeta) => {
  // rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // store the ranking info
  addMeta(itemRank);

  // return if the item should be filtered in/out
  return itemRank.passed;
};

// ==============================|| REACT TABLE - LIST ||============================== //

function ReactTable({ data, columns }) {
  const theme = useTheme();
 
  const [sorting, setSorting] = useState([
    {
      id: 'id',
      desc: true,
    },
  ]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const router= useRouter();
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection,
      globalFilter,
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
    globalFilterFn: fuzzyFilter,
    debugTable: true,
  });

  const backColor = alpha(theme.palette.primary.lighter, 0.1);

 

  const transformedData = data.map((row) => ({
    ...row,
    numeStudent: `${row.solicitari.utilizator.Nume} ${row.solicitari.utilizator.Prenume}`,
    dataStart: format(new Date(row.dataStart), 'dd-MMM-yyyy'),
    dataFinal: format(new Date(row.dataFinal), 'dd-MMM-yyyy'),
    statusText: row.idStatus === 1 ? 'Acceptat' : row.idStatus === 3 ? 'În așteptare' : 'Refuzat'
  }));

  const headers = [
    { label: 'Id factură', key: 'idFactura' },
    { label: 'Nume Student', key: 'numeStudent' },
    { label: 'Dată de început', key: 'dataStart' },
    { label: 'Dată de final', key: 'dataFinal' },
    { label: 'Suma', key: 'suma' },
    { label: 'Status', key: 'statusText' }
  ];

  return (
    <MainCard content={false}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{ padding: 2 }}
      >
        <DebouncedInput
          value={globalFilter ?? ''}
          onFilterChange={(value) => setGlobalFilter(String(value))}
          placeholder={`Caută  în ${data.length} înregistrări...`}
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <SelectColumnSorting {...{ getState: table.getState, getAllColumns: table.getAllColumns, setSorting }} />
          <Stack direction="row" spacing={2} alignItems="center">
            <Button variant="contained" startIcon={<PlusOutlined />} onClick={(e) => {
              e.stopPropagation();
              router.push(`/apps/factura/create`);
            }}>
              Adaugă o factură
            </Button>
            <CSVExport
              {...{
                data: table.getSelectedRowModel().flatRows.map((row) => ({
                  ...row.original,
                  numeStudent: `${row.original.solicitari.utilizator.Nume} ${row.original.solicitari.utilizator.Prenume}`,
                  dataStart: format(new Date(row.original.dataStart), 'dd-MMM-yyyy'),
                  dataFinal: format(new Date(row.original.dataFinal), 'dd-MMM-yyyy'),
                  statusText: row.original.idStatus === 1 ? 'Acceptat' : row.original.idStatus === 3 ? 'În așteptare' : 'Refuzat'
                })).length === 0
                  ? transformedData
                  : table.getSelectedRowModel().flatRows.map((row) => ({
                    ...row.original,
                    numeStudent: `${row.original.solicitari.utilizator.Nume} ${row.original.solicitari.utilizator.Prenume}`,
                    dataStart: format(new Date(row.original.dataStart), 'dd-MMM-yyyy'),
                    dataFinal: format(new Date(row.original.dataFinal), 'dd-MMM-yyyy'),
                    statusText: row.original.idStatus === 1 ? 'Acceptat' : row.original.idStatus === 3 ? 'În așteptare' : 'Refuzat'
                  })),
                headers,
                filename: 'facturi-lista.csv',
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
                          className: header.column.columnDef.meta.className + ' cursor-pointer prevent-select',
                        });
                      }

                      return (
                        <TableCell
                          key={header.id}
                          {...header.column.columnDef.meta}
                          onClick={header.column.getToggleSortingHandler()}
                          {...(header.column.getCanSort() &&
                            header.column.columnDef.meta === undefined && {
                              className: 'cursor-pointer prevent-select',
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
                  getPageCount: table.getPageCount,
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
  const router = useRouter();
  const handleClose = () => {
    setOpen(!open);
  };
  const handleDeleteFactura = async (idFactura) => {
    try {
      const response = await fetch(`http://localhost:8080/api/facturi/${idFactura}`, {
        method: 'DELETE'
      });
      openSnackbar({
        open: true,
        message: 'Factură ștearsă cu succes!',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        variant: 'alert',
        alert: {
          color: 'success',
        },
      });
      if (!response.ok) {
        throw new Error('Eroare la ștergerea facturii');
      }
      // Poți actualiza starea aici după ce factura a fost ștearsă cu succes
      console.log(`Factura cu ID-ul ${idFactura} a fost ștearsă cu succes.`);
      setStudents((prevStudents) => prevStudents.filter((factura) => factura.idFactura !== idFactura));
    } catch (error) {
      console.error('Eroare:', error);
    }
  };
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/facturi');
        const data = await response.json();
        setStudents(data);
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
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />
        ),
      },
      {
        header: 'Id factură',
        accessorKey: 'idFactura',
        meta: {
          className: 'cell-center',
        },
      },
      {
        header: 'Nume Student',
        accessorKey: 'numeStudent', // Cheia pentru coloana adăugată
        cell: ({ row }) => (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Stack spacing={0}>
              <Typography variant="subtitle1">
                {row.original.solicitari.utilizator.Nume} {row.original.solicitari.utilizator.Prenume}
              </Typography>
            </Stack>
          </Stack>
        ),
      },
      {
        header: 'Dată de început',
        accessorKey: 'dataStart',
        cell: ({ getValue }) => format(new Date(getValue()), 'dd-MMM-yyyy')
      },
      {
        header: 'Dată de final',
        accessorKey: 'dataFinal',
        cell: ({ getValue }) => format(new Date(getValue()), 'dd-MMM-yyyy')
      },
      {
        header: 'Suma',
        accessorKey: 'suma',
      },
      {
        header: 'Status',
        accessorKey: 'idStatus',
        cell: (cell) => {
            switch (cell.getValue()) {
              case 3:
                return <Chip color="info" label="În așteptare" size="small" variant="light" />;
              case 1:
                return <Chip color="success" label="Acceptat" size="small" variant="light" />;
              case 2:
              default:
                return <Chip color="error" label="Refuzat" size="small" variant="light" />;
            }
        },
      },
      {
        header: 'Acțiuni',
        meta: {
          className: 'cell-center',
        },
        disableSortBy: true,
        cell: ({ row }) => {
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
             <Tooltip title="Detalii">
                <IconButton
                  color="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    sessionStorage.setItem('invoiceData', JSON.stringify(row.original));
                    router.push(`/apps/factura/detalii/${row.original.idFactura}`);
                  }}
                >
                  <EyeOutlined />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Ștergere">
                          <IconButton
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteFactura(row.original.idFactura);
                            }}
                          >
                            <DeleteOutlined />
                          </IconButton>
                        </Tooltip>
            </Stack>
          );
        },
      },
    ],
    [theme]
  );
  const calculateStatusData = (students) => {
    const totalFacturi = students.length;
  
    const statusCounts = students.reduce(
      (acc, student) => {
        if (student.idStatus === 1) {
          acc.paid.count += 1;
          acc.paid.total += Number(student.suma);
          acc.paid.chartData.push(student.suma);
        } else if (student.idStatus === 3) {
          acc.pending.count += 1;
          acc.pending.total += Number(student.suma);
          acc.pending.chartData.push(student.suma);
        } else if (student.idStatus === 2) {
          acc.refused.count += 1;
          acc.refused.total += Number(student.suma);
          acc.refused.chartData.push(student.suma);
        }
        return acc;
      },
      {
        paid: { count: 0, total: 0, chartData: [] },
        pending: { count: 0, total: 0, chartData: [] },
        refused: { count: 0, total: 0, chartData: [] },
      }
    );
  
    const paidPercentage = totalFacturi ? (statusCounts.paid.count / totalFacturi) * 100 : 0;
    const pendingPercentage = totalFacturi ? (statusCounts.pending.count / totalFacturi) * 100 : 0;
    const refusedPercentage = totalFacturi ? (statusCounts.refused.count / totalFacturi) * 100 : 0;
  
    return {
      paid: { ...statusCounts.paid, percentage: paidPercentage },
      pending: { ...statusCounts.pending, percentage: pendingPercentage },
      refused: { ...statusCounts.refused, percentage: refusedPercentage },
    };
  };
  
  const { paid, pending, refused } = calculateStatusData(students);

  const breadcrumbLinks = [
    { title: 'Anunțuri', to: APP_DEFAULT_PATH },
    { title: 'Facturi', to: '/apps/factura/dashboard' },
    { title: 'List' },
  ];

  const widgetsData = [
    {
      title: 'Plătit',
      invoice: paid.count.toString(),
      percentage: paid.percentage.toFixed(2),
      isLoss: false,
      count: paid.total.toFixed(2),
      color: theme.palette.success,
      chartData: paid.chartData,
    },
    {
      title: 'În așteptare',
      invoice: pending.count.toString(),
      percentage: pending.percentage.toFixed(2),
      isLoss: true,
      count: pending.total.toFixed(2),
      color: theme.palette.warning,
      chartData: pending.chartData,
    },
    {
      title: 'Refuzat',
      invoice: refused.count.toString(),
      percentage: refused.percentage.toFixed(2),
      isLoss: true,
      count: refused.total.toFixed(2),
      color: theme.palette.error,
      chartData: refused.chartData,
    },
  ];

  const [invoiceId, setInvoiceId] = useState(0);
  const [getInvoiceId, setGetInvoiceId] = useState(0);

  const handleCloseDelete = (status) => {
    if (status) {
      deleteInvoice(invoiceId);
      openSnackbar({
        open: true,
        message: 'Coloană ștearsă cu succes!',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        variant: 'alert',
        alert: {
          color: 'success',
        },
      });
    }
    handlerDelete(false);
  };

  if (loading) return <EmptyReactTable />;
  const totalPlatit = students.reduce((acc, curr) => acc + Number(curr.suma), 0);

  return (
    <>
      <Breadcrumbs custom heading="Listă facturi" links={breadcrumbLinks} />
      <Grid container spacing={2}>
        <Grid item md={8}>
          <Grid container direction="row" spacing={2}>
            {widgetsData.map((widget, index) => (
              <Grid item sm={4} xs={12} key={index}>
                <MainCard>
                  <InvoiceCard
                    title={widget.title}
                    count={widget.count}
                    percentage={widget.percentage}
                    isLoss={widget.isLoss}
                    invoice={widget.invoice}
                    color={widget.color.main}
                  >
                    <InvoiceChart color={widget.color} data={widget.chartData} />
                  </InvoiceCard>
                </MainCard>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item md={4} sm={12} xs={12}>
          <Box
            sx={{
              background: `linear-gradient(to right, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
              borderRadius: 1,
              p: 1.75,
            }}
          >
            <Stack direction="row" alignItems="flex-end" justifyContent="space-between" spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar alt="Natacha" variant="rounded" type="filled">
                  <FileDoneOutlined style={{ fontSize: '20px' }} />
                </Avatar>
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body1" color="white">
                      Total plătit
                    </Typography>
                    <InfoCircleOutlined style={{ color: theme.palette.background.paper }} />
                  </Stack>
                </Box>
              </Stack>
            </Stack>
            <Typography variant="h4" color="white" sx={{ pt: 2, pb: 1, zIndex: 1 }}>
            {totalPlatit.toFixed(2)} lei
            </Typography>
            <Box sx={{ maxWidth: '100%', '& .MuiTypography-root': { color: 'white' } }}>
              <LinearWithLabel value={90} color="warning" />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <ReactTable {...{ data: students, columns }} />
          <AlertColumnDelete title={getInvoiceId.toString()} open={false} handleClose={handleCloseDelete} />
        </Grid>
      </Grid>
    </>
  );
};

export default CustomerListPage;
