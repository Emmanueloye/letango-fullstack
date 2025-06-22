// const reportLastDate = (endDate: string) => {
//   //   Determine if the current date is last day of the month
//   const newDate = new Date();
//   const currentDate = new Date(
//     newDate.getFullYear(),
//     newDate.getMonth() + 1,
//     0
//   );
//   let lastDate;
//   if (new Date(endDate).getDate() === currentDate.getDate()) {
//     lastDate = new Date(
//       `${currentDate.getFullYear()}-0${currentDate.getMonth() + 2}-01`
//     );
//   } else {
//     const reqDate = new Date(endDate);

//     lastDate = new Date(
//       `${reqDate.getFullYear()}-0${reqDate.getMonth() + 1}-${
//         reqDate.getDate() + 1
//       }`
//     );
//   }

//   return lastDate;
// };

const reportLastDate = (endDate: string) => {
  const inputDate = new Date(endDate);
  const now = new Date();
  const lastDayOfThisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  let lastDate: Date;

  if (inputDate.getDate() === lastDayOfThisMonth.getDate()) {
    // First day of next month
    lastDate = new Date(
      lastDayOfThisMonth.getFullYear(),
      lastDayOfThisMonth.getMonth() + 1,
      1
    );
  } else {
    // Next day
    lastDate = new Date(
      inputDate.getFullYear(),
      inputDate.getMonth(),
      inputDate.getDate() + 1
    );
  }

  // Set time to 12:00 AM
  lastDate.setHours(0, 0, 0, 0);

  return lastDate;
};

export default reportLastDate;
