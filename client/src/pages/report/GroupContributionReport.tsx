import { useParams } from 'react-router-dom';
import LinkBtn from '../../components/UI/LinkBtn';
import DateRangeSelector from '../../components/UI/DateRangeSelector';
import { useState } from 'react';
import { ContributionReport } from '../../dtos/groupDto';
import { fetchOnlyData } from '../../helperFunc.ts/apiRequest';
import DataTable, { createTheme } from 'react-data-table-component';
import { customStyles } from '../../Actions/constant';
import { formatDate, formatNumber } from '../../helperFunc.ts/utilsFunc';
import { useAppSelector } from '../../Actions/store';
import Empty from '../../components/UI/Empty';

const GroupContributionReport = () => {
  const params = useParams();
  const [report, setReport] = useState<ContributionReport[]>();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { isDarkMode } = useAppSelector((state) => state.mode);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const form = Object.fromEntries(formData);
    const data = { ...form, groupRef: params.groupId };

    setEndDate(`${form.endDate}`);
    setStartDate(`${form.startDate}`);
    setIsLoading(true);

    const result = await fetchOnlyData({
      url: `/group-reports/contributions`,
      params: data,
    });

    if (result.status === 'success') {
      setReport(result?.contributions);
      setIsLoading(false);
    }
    if (result.status === 'fail') {
      setError(result.message);
      setIsLoading(false);
    }
  };

  type Row = {
    [key: string]: number | string;
  };

  const tableHeaders = report && Object.keys(report?.[0] as object);
  const columns = tableHeaders?.map((item) => {
    return {
      name: item.toUpperCase(),
      cell: (row: Row) => (
        <div style={{ textTransform: 'capitalize' }}>
          {typeof row[item] === 'string' ? row[item] : formatNumber(row[item])}
        </div>
      ),
      sortable: true,
    };
  });

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
    <>
      <div className='flex justify-end mb-4'>
        <LinkBtn
          btnText='back'
          url={`/account/manage-group/view/${params.groupId}/reports`}
        />
      </div>
      <DateRangeSelector
        handleSubmit={handleSubmit}
        error={error}
        isLoading={isLoading}
      />
      {report && report?.length > 0 ? (
        <div
          className='aside'
          style={{ width: '100%', overflowX: 'auto', marginTop: '20px' }}
        >
          <div className='text-center capitalize mb-3 font-500'>
            <p>Members contribution List</p>
            <p>start Date: {startDate && formatDate(new Date(startDate))}</p>
            <p>end Date: {endDate && formatDate(new Date(endDate))}</p>
          </div>
          <DataTable
            columns={columns || []}
            data={report || []}
            customStyles={customStyles}
            pagination
            theme={isDarkMode ? 'solarized' : 'light'}
            fixedHeader={true}
          />
        </div>
      ) : (
        <Empty message='No record available.' />
      )}
    </>
  );
};

export default GroupContributionReport;
