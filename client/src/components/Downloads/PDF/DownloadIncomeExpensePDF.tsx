// import pdfMake from 'pdfmake/build/pdfmake';
// import pdFonts from 'pdfmake/build/vfs_fonts';
// import { TDocumentDefinitions } from 'pdfmake/interfaces';
// import { Group, IIncomeAndExpense } from '../../../dtos/groupDto';
// import { formatDate } from '../../../helperFunc.ts/utilsFunc';
// import { FaFilePdf } from 'react-icons/fa';

// // set virtual font file system
// pdfMake.vfs = pdFonts.vfs;

// const DownloadIncomeExpensePDF = ({
//   group,
//   statement,
//   dateRange,
// }: {
//   group: Group;
//   statement: IIncomeAndExpense[];
//   dateRange: { startDate: string; endDate: string };
// }) => {
//   const groupName = group?.groupName;

//   // Income
//   const income =
//     statement?.map((item) => {
//       if (item?._id?.headType === 'income') {
//         return [item?._id?.head, item?.amount];
//       }
//     }) || [];

//   // Expenses
//   const expenses =
//     statement?.map((item) => {
//       if (item?._id?.headType === 'expense') {
//         return [item?._id?.head, item?.amount];
//       }
//     }) || [];

//   const generatePDF = () => {
//     const tableBody = [
//       // header
//       [{ text: 'Income', bold: true }, { text: '₦', bold: true }, ...income],

//       // expenses
//       [
//         { text: 'Expenses', bold: true },
//         { text: '₦', bold: true },
//         ...expenses,
//       ],
//     ];
//     const docDefinition = {
//       content: [
//         // Business name and page label
//         {
//           text: 'Letango Financial Technology',
//           bold: true,
//           fontSize: 20,
//           color: '#011359',
//           margin: [0, 0, 0, 5],
//         },
//         // page label
//         {
//           text: 'Customer Statement',
//           bold: true,
//           fontSize: 10,
//           margin: [0, 0, 0, 30],
//         },

//         // Customer details
//         // Customer name
//         {
//           text: [{ text: 'Customer Name: ', bold: true }, `${groupName}`],
//           margin: [0, 0, 0, 4],
//           fontSize: 11,
//         },

//         {
//           text: [
//             { text: 'From Date: ', bold: true },
//             `${formatDate(new Date(dateRange.startDate))}`,
//           ],
//           margin: [0, 0, 0, 4],
//           fontSize: 11,
//         },
//         // Statement end date
//         {
//           text: [
//             { text: 'To Date: ', bold: true },
//             `${formatDate(new Date(dateRange.endDate))}`,
//           ],
//           margin: [0, 0, 0, 20],
//           fontSize: 11,
//         },
//         // Statement content
//         {
//           table: {
//             headerRows: 1,
//             widths: ['*', '*', '*', '*', '*', '*'],
//             body: tableBody,
//           },
//           layout: {
//             fillColor: (rowIndex: number) => {
//               return rowIndex === 0
//                 ? '#ccc'
//                 : rowIndex % 2 === 0
//                 ? '#ddd'
//                 : null;
//             },
//             hLineWidth: () => 0,
//             vLineWidth: () => 0,
//           },
//         },
//       ],
//     };

//     // create pdf
//     pdfMake
//       .createPdf(docDefinition as TDocumentDefinitions)
//       .download('incomeAndExpense');
//   };

//   return (
//     <button
//       className='flex items-center gap-1 bg-rose-400 p-2 capitalize rounded-lg font-500 text-green-100 cursor-pointer mt-3'
//       onClick={generatePDF}
//     >
//       export <FaFilePdf />
//     </button>
//   );
// };

// export default DownloadIncomeExpensePDF;
