import Table from '../../../components/UI/Table';
import Title from '../../../components/UI/Title';
import TableAction from '../../../components/UI/TableAction';
import TableCard from '../../../components/UI/TableCard';

const UserManager = () => {
  const headers = ['username', 'email', 'reg date', 'action'];
  const columns = '1fr 1fr 1fr 1.2fr';
  return (
    <section>
      <Title title='manage users' />
      {/* Large screen table view */}
      <div className='w-full overflow-x-auto hidden lg:block'>
        <Table headers={headers} columns={columns}>
          <>
            <p className='border border-[#d1d5dc]'>osunkoya mayowa</p>
            <p className='border lowercase border-[#d1d5dc]'>
              mayorj@gmail.com
            </p>
            <p className='border  border-[#d1d5dc]'>April 4, 2025</p>
            <TableAction
              editUrl='/account/admin/user-manager/edit/1'
              viewUrl='/account/admin/user-manager/view/1'
              showUserAction
            />
          </>
          <>
            <p className='border border-[#d1d5dc]'>osunkoya mayowa</p>
            <p className='border lowercase border-[#d1d5dc]'>
              mayorj@gmail.com
            </p>
            <p className='border  border-[#d1d5dc]'>April 4, 2025</p>
            <TableAction
              editUrl='/account/admin/user-manager/edit/1'
              viewUrl='/account/admin/user-manager/view/1'
              showUserAction
            />
          </>
        </Table>
      </div>
      {/*End Large screen table view */}
      {/*================= Small screen table view =============== */}
      <div className='block lg:hidden'>
        {/* Table card header */}
        <TableCard className='font-600 uppercase'>
          <p>username</p>
          <p className='break-all'>email</p>
          <p>reg date</p>
        </TableCard>
        {/* Table card row */}
        <TableCard
          editUrl='/account/admin/user-manager/edit/1'
          viewUrl='/account/admin/user-manager/view/1'
          showAction
        >
          <p>Osunkoya Mayowa</p>
          <p className='break-all'>Osunkoya@gmail.com</p>
          <p>April 4, 2025</p>
        </TableCard>
        <TableCard
          editUrl='/account/admin/user-manager/edit/1'
          viewUrl='/account/admin/user-manager/view/1'
          showAction
        >
          <p>Osunkoya Mayowa</p>
          <p className='break-all'>Osunkoya@gmail.com</p>
          <p>April 4, 2025</p>
        </TableCard>
      </div>
      {/*End Small screen table view */}
    </section>
  );
};

export default UserManager;
