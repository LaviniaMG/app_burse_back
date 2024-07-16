'use client';

import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';

// material-ui
import { Paper, Table, TableBody, TableContainer, TableCell, TableFooter, TableHead, TableRow, Stack } from '@mui/material';

// third-party
import {
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  flexRender,
  useReactTable
} from '@tanstack/react-table';

// project import
import makeData from '../../../data/react-table';
import MainCard from '../../../components/MainCard';
import ScrollX from '../../../components/ScrollX';
import { CSVExport, DebouncedInput, EmptyTable } from '../../../components/third-party/react-table';
import Filter from '../../../components/third-party/react-table/Filter';
// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data }) {
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      globalFilter
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter
  });

  return (
    <MainCard content={false}>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ padding: 2 }}>
        <DebouncedInput
          value={globalFilter ?? ''}
          onFilterChange={(value) => setGlobalFilter(String(value))}
          placeholder={`Caută ${data.length} ...`}
        />
        <CSVExport data={data} filename={'empty-table.csv'} />
      </Stack>

      <ScrollX>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell key={header.id} {...header.column.columnDef.meta}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell key={header.id} {...header.column.columnDef.meta}>
                      {header.column.getCanFilter() && <Filter column={header.column} table={table} />}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={table.getAllColumns().length}>
                    <EmptyTable msg="Nu există date" />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              {table.getFooterGroups().map((footerGroup) => (
                <TableRow key={footerGroup.id}>
                  {footerGroup.headers.map((footer) => (
                    <TableCell key={footer.id} {...footer.column.columnDef.meta}>
                      {footer.isPlaceholder ? null : flexRender(footer.column.columnDef.header, footer.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableFooter>
          </Table>
        </TableContainer>
      </ScrollX>
    </MainCard>
  );
}

ReactTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array
};

// ==============================|| REACT TABLE - EMPTY ||============================== //

const EmptyReactTable = () => {
  const data = useMemo(() => makeData(0), []);

  const columns = useMemo(
    () => [  {
      header: 'Id',
      footer: 'Id',
      accessorKey: 'id'
    },
      {
        header: 'Nume Prenume',
        footer: 'Nume Prenume',
        accessorKey: 'fullName'
      },
      {
        header: 'Bursa aplicată',
        footer: 'Bursa aplicată',
        accessorKey: 'email'
      },
      {
        header: 'An',
        footer: 'An',
        accessorKey: 'role'
      },
      {
        header: 'Facultate',
        footer: 'Facultate',
        accessorKey: 'age',
        meta: {
          className: 'cell-right'
        }
      },
     
      {
        header: 'Media',
        footer: 'Media',
        accessorKey: 'status'
      },
      {
        header: 'Status',
        footer: 'Status',
        accessorKey: 'status'
      },
      {
        header: 'Actiuni',
        footer: 'Actiuni',
        accessorKey: 'status'
      }
    ],
    []
  );

  return <ReactTable columns={columns} data={data} />;
};

export default EmptyReactTable;
