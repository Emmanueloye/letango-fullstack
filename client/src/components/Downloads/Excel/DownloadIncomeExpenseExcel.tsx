import * as XLSX from 'xlsx';
import { Group, IIncomeAndExpense } from '../../../dtos/groupDto';
import { formatDate } from '../../../helperFunc.ts/utilsFunc';
import { FaFileExcel } from 'react-icons/fa';

const DownloadIncomeExpenseExcel = ({
  group,
  statement,
  dateRange,
}: {
  group: Group;
  statement: IIncomeAndExpense[];
  dateRange: { startDate: string; endDate: string };
}) => {
  const handleExport = () => {
    const wb = XLSX.utils.book_new();

    const data = [];
    let totalIncome = 0;
    let totalExpenses = 0;

    // Business Information
    data.push(['Letango Financial Technology']);
    data.push(['Customer Statement']);
    data.push(['', '']);
    data.push(['', '']);

    // Group details
    data.push(['Group Name', group?.groupName?.toUpperCase()]);

    // Report date range
    data.push(['Start date', formatDate(new Date(dateRange.startDate))]);
    data.push(['End date', formatDate(new Date(dateRange.endDate))]);
    data.push(['', '']);

    // Income section
    data.push(['Income And Expenses Statement']);
    data.push(['Income', '₦']);
    statement?.forEach((item) => {
      if (item?._id?.headType === 'income') {
        totalIncome += item?.amount;
        data.push([item?._id?.head, item?.amount]);
      }
    });
    data.push(['Total Income', totalIncome]);

    // Empty row for spacing
    data.push(['', '']);

    // Expenses section
    data.push(['Expenses', '₦']);
    statement?.forEach((item) => {
      if (item?._id?.headType === 'expense') {
        totalExpenses += item?.amount;
        data.push([item?._id?.head, item?.amount * -1]);
      }
    });
    data.push(['Total Expense', totalExpenses * -1]);
    data.push(['Surplus/(Deficit)', totalIncome + totalExpenses]);

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

    XLSX.utils.book_append_sheet(wb, ws, `${fileName}-Statement`);

    XLSX.writeFile(wb, `${fileName}-Statement.xlsx`);
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

export default DownloadIncomeExpenseExcel;
