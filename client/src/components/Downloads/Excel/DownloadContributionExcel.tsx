import * as XLSX from 'xlsx';
import { ContributionReport, Group } from '../../../dtos/groupDto';
import { capitalized, formatDate } from '../../../helperFunc.ts/utilsFunc';
import { FaFileExcel } from 'react-icons/fa';

const DownloadContributionExcel = ({
  group,
  headers,
  statement,
  dateRange,
}: {
  group: Group;
  headers: string[];
  statement: ContributionReport[];
  dateRange: { startDate: string; endDate: string };
}) => {
  const handleExport = () => {
    const wb = XLSX.utils.book_new();

    const data = [];

    // Business Information
    data.push(['Letango Financial Technology']);
    data.push(['Members Contribution Report']);
    data.push(['', '']);
    data.push(['', '']);

    // Group details
    data.push(['Group Name', group?.groupName?.toUpperCase()]);

    // Report date range
    data.push(['Start date', formatDate(new Date(dateRange.startDate))]);
    data.push(['End date', formatDate(new Date(dateRange.endDate))]);
    data.push(['', '']);

    // contribution section
    data.push(['Contribution Report']);

    //header
    const capitalizedHeader = headers.map((header) => capitalized(header));
    data.push([...capitalizedHeader]);
    // statement
    statement.forEach((item) => {
      data.push([
        ...headers.map((header) =>
          // check if type is string, capitalized
          typeof item[header] === 'string'
            ? capitalized(item[header])
            : // otherwise, it's a number
              item[header]
        ),
      ]);
    });

    data.push(['', '']);

    // Convert the data array to a worksheet
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Set column widths
    ws['!cols'] = [
      { wch: 30 }, // Width for the first column
      { wch: 20 }, // Width for the second column
      { wch: 20 }, // Width for the third column
      { wch: 20 }, // Width for the fourth column
      { wch: 20 }, // Width for the fifth column
      { wch: 20 }, // Width for the sixth column
    ];

    const fileName = group?.groupRef;

    XLSX.utils.book_append_sheet(wb, ws, `${fileName}-contribution report`);

    XLSX.writeFile(wb, `${fileName}-contribution report.xlsx`);
  };

  return (
    <button
      onClick={handleExport}
      className='flex items-center gap-1 bg-green-700 p-2 capitalize rounded-lg font-500 text-green-100 cursor-pointer mt-3'
    >
      export
      <FaFileExcel />
    </button>
  );
};

export default DownloadContributionExcel;
