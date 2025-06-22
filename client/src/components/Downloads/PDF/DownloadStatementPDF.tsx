import pdfMake from 'pdfmake/build/pdfmake';
import pdFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { StatementType } from '../../../dtos/statementDto';
import { formatDate, formatNumber } from '../../../helperFunc.ts/utilsFunc';
import { User } from '../../../dtos/UserDto';
import { FaFilePdf } from 'react-icons/fa6';
import { Group } from '../../../dtos/groupDto';

// Set virtual font file system
pdfMake.vfs = pdFonts.vfs;

const DownloadStatementPDF = ({
  closingBal,
  openingBal,
  customerDetails,
  group,
  statementContent,
  dateRange,
}: {
  closingBal: number;
  openingBal: number;
  statementContent: StatementType[];
  customerDetails?: User;
  group?: Group;
  dateRange: { startDate: Date; endDate: Date };
}) => {
  let balance = openingBal || 0;

  const customer = customerDetails
    ? `${customerDetails?.surname?.toUpperCase()} ${customerDetails?.otherNames?.toUpperCase()}`
    : group?.groupName?.toUpperCase();

  const data = statementContent?.map((item) => {
    const debit = item.contribution < 0 ? item.contribution : 0.0;
    const credit = item.contribution > 0 ? item.contribution : 0.0;

    balance = balance += item.contribution;

    let from, to;

    if (item.contribution > 0 && customerDetails) {
      from = `${item.fromId?.surname} ${
        item?.fromId?.otherNames?.split(' ')[0]
      }`;
    }

    if (item.contribution < 0 && customerDetails) {
      to = '';
      // to = `${item.toId?.surname} ${item?.toId?.otherNames?.split(' ')[0]}`;
    }

    if (item.contribution > 0 && group) {
      from = `${item.fromId?.surname} ${
        item?.fromId?.otherNames?.split(' ')[0]
      }`;
    }

    if (item.contribution < 0 && group) {
      to = `:to ${item.to}`;
    }

    const description = `${item.description} ${
      from ? `: from ${from}` : `${to}`
    }`;

    return [
      formatDate(new Date(item.createdAt)),
      item.transactionRef,
      description,
      formatNumber(debit === 0 ? 0 : debit * -1),
      formatNumber(credit),
      formatNumber(balance),
    ];
  });

  const newData = data || [];

  const generatePDF = () => {
    const tableBody = [
      // header
      [
        { text: 'Date', bold: true },
        { text: 'Reference', bold: true },
        { text: 'Description', bold: true },
        { text: 'Debit', bold: true },
        { text: 'Credit', bold: true },
        { text: 'Balance', bold: true },
      ],
      //   Opening balance
      ['', '', 'Opening balance', '', '', formatNumber(openingBal) || 0],
      //   Statement body
      ...newData,
      //   Closing balance
      ['', '', 'Closing balance', '', '', formatNumber(closingBal) || 0],
    ];

    const docDefinition = {
      content: [
        // Business name and page label
        {
          text: 'Letango Financial Technology',
          bold: true,
          fontSize: 20,
          color: '#011359',
          margin: [0, 0, 0, 5],
        },
        // page label
        {
          text: 'Customer Statement',
          bold: true,
          fontSize: 10,
          margin: [0, 0, 0, 30],
        },

        // Customer details
        // Customer name
        {
          text: [{ text: 'Customer Name: ', bold: true }, `${customer}`],
          margin: [0, 0, 0, 4],
          fontSize: 11,
        },
        // Customer Opening balance
        {
          text: [
            { text: 'Opening Bal: ', bold: true },
            `${formatNumber(openingBal) || 0}`,
          ],
          margin: [0, 0, 0, 4],
          fontSize: 11,
        },
        // Customer closing balance
        {
          text: [
            { text: 'Closing Bal: ', bold: true },
            `${formatNumber(closingBal) || 0}`,
          ],
          margin: [0, 0, 0, 4],
          fontSize: 11,
        },
        // Statement start date
        {
          text: [
            { text: 'From Date: ', bold: true },
            `${formatDate(new Date(dateRange.startDate))}`,
          ],
          margin: [0, 0, 0, 4],
          fontSize: 11,
        },
        // Statement end date
        {
          text: [
            { text: 'To Date: ', bold: true },
            `${formatDate(new Date(dateRange.endDate))}`,
          ],
          margin: [0, 0, 0, 20],
          fontSize: 11,
        },
        // Statement content
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*', '*', '*'],
            body: tableBody,
          },
          layout: {
            fillColor: (rowIndex: number) => {
              return rowIndex === 0
                ? '#ccc'
                : rowIndex % 2 === 0
                ? '#ddd'
                : null;
            },
            hLineWidth: () => 0,
            vLineWidth: () => 0,
          },
        },
      ],
    };
    // Create PDF
    pdfMake
      .createPdf(docDefinition as TDocumentDefinitions)
      .download('statement.pdf');
  };
  //   Attached the pdf generator function to the download button.
  return (
    <button
      className='flex items-center gap-1 bg-rose-400 p-2 capitalize rounded-lg font-500 text-green-100 cursor-pointer mt-3'
      onClick={generatePDF}
    >
      export <FaFilePdf />
    </button>
  );
};

export default DownloadStatementPDF;
