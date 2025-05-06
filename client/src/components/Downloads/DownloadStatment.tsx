import * as XLSX from 'xlsx';
import { StatementType } from '../../dtos/statementDto';
import { User } from '../../dtos/UserDto';
import { formatDate } from '../../helperFunc.ts/utilsFunc';
import { FaFileExcel } from 'react-icons/fa';

const DownloadStatment = ({
  closingBal,
  openingBal,
  customerDetails,
  statementContent,
  dateRange,
}: {
  closingBal: number;
  openingBal: number;
  statementContent: StatementType[];
  customerDetails: User;
  dateRange: { startDate: Date; endDate: Date };
}) => {
  const handleExport = () => {
    const wb = XLSX.utils.book_new();

    const data = [];
    let runningBalance = openingBal || 0;

    // Business Information
    data.push(['Letango Financial Technology']);
    data.push(['Customer Statement']);
    data.push(['', '']);
    data.push(['', '']);

    // Customer Details
    data.push([
      'Customer Name',
      `${customerDetails.surname} ${customerDetails.otherNames}`,
    ]);
    data.push(['Opening Balance', openingBal || 0]);
    data.push(['Closing Balance', closingBal || 0]);
    data.push(['', '']);

    // Report date range
    data.push([
      'Start date',
      formatDate(new Date(dateRange.startDate)),
      'End date',
      formatDate(new Date(dateRange.endDate)),
    ]);
    data.push(['', '']);

    // Statement header
    data.push([
      'Date',
      'Reference',
      'Description',
      'Debit',
      'Credit',
      'Balance',
    ]);
    data.push(['', '', 'Opening Balance', '', '', openingBal]);

    // Statement content
    statementContent.forEach((item) => {
      let debit, credit;
      if (item.contribution > 0) {
        runningBalance += item.contribution;
        credit = item.contribution;
      }
      if (item.contribution < 0) {
        runningBalance -= item.contribution;
        debit = item.contribution;
      }

      data.push([
        formatDate(new Date(item.createdAt)),
        item.transactionRef,
        item.description,
        debit,
        credit,
        runningBalance,
      ]);
    });
    // Empty row for spacing
    data.push(['', '']);

    // Closing Balance
    data.push(['', '', 'Closing Balance', '', '', closingBal || 0]);

    // console.log(data);

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

    XLSX.utils.book_append_sheet(
      wb,
      ws,
      `${customerDetails.userRef}-Statement`
    );

    XLSX.writeFile(wb, `${customerDetails.userRef}-Statement.xlsx`);
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

export default DownloadStatment;
