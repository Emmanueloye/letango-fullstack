import DataTable, { createTheme } from 'react-data-table-component';
import { customStyles } from '../../Actions/constant';
import { useAppSelector } from '../../Actions/store';
import { JSX } from 'react';

export type Row = {
  [key: string]: number | string | boolean;
};

export type Columns = {
  name: string;
  selector?: (row: Row) => string | number | boolean;
  cell?: (row: Row, index?: number) => JSX.Element;
  sortable?: boolean;
};

const DataTableUI = ({
  columns,
  data,
  pagination = true,
}: {
  columns: Columns[] | undefined;
  data: Row[];
  pagination?: boolean;
}) => {
  const { isDarkMode } = useAppSelector((state) => state.mode);
  // Table Dark theme
  createTheme(
    'solarized',
    {
      text: {
        primary: '#f8fafc',
        secondary: '#f8fafc',
      },
      background: {
        default: 'oklch(27.9% 0.041 260.031)',
      },
    },
    'dark'
  );
  return (
    <DataTable
      columns={columns ?? []}
      data={data}
      customStyles={customStyles}
      pagination={pagination}
      theme={isDarkMode ? 'solarized' : 'light'}
      fixedHeader={true}
    />
  );
};

export default DataTableUI;
