import * as XLSX from 'xlsx';
import { FaFileExcel } from 'react-icons/fa';
import { Withdrawal } from '../../../dtos/paymentDto';

const DownloadWithdrawalExcel = ({
  withdrawal,
}: {
  withdrawal: Withdrawal[];
}) => {
  const handleExport = () => {
    const wb = XLSX.utils.book_new();

    const data = [];

    // Statement header
    data.push([
      'WITHDRAWAL ID',
      'AMOUNT',
      'BANK',
      'ACCOUNT NO.',
      'FROM',
      'TO',
      'DESCRIPTION',
      'STATUS',
    ]);

    // Statement content
    withdrawal.forEach((item) => {
      data.push([
        item?._id,
        item?.contribution,
        item?.bank,
        item?.accountNumber,
        item?.fromGroup?.groupName,
        item?.to,
        item?.description,
        item?.approvalStatus,
      ]);
    });

    // Convert the data array to a worksheet
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Set column widths
    ws['!cols'] = [
      { wch: 30 }, // Width for the 1st column
      { wch: 20 }, // Width for the 2nd column
      { wch: 20 }, // Width for the 3rd column
      { wch: 20 }, // Width for the 4th column
      { wch: 20 }, // Width for the 5th column
      { wch: 20 }, // Width for the 6th column
      { wch: 20 }, // Width for the 7th column
      { wch: 20 }, // Width for the 8th column
    ];

    XLSX.utils.book_append_sheet(wb, ws, `withdrawal`);

    XLSX.writeFile(wb, `withdrawal.xlsx`);
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

export default DownloadWithdrawalExcel;
