import Table from '../../../components/UI/Table';
import TableAction from '../../../components/UI/TableAction';
import TableCard from '../../../components/UI/TableCard';
import Title from '../../../components/UI/Title';

const GroupManager = () => {
  const headers = ['group name', 'group type', 'created date', 'action'];
  const columns = '1fr 1fr 1fr 1.2fr';
  return (
    <section>
      <Title title='manage groups' />
      {/* Large screen table view */}
      <div className='w-full overflow-x-auto hidden lg:block'>
        <Table headers={headers} columns={columns}>
          <>
            <p className='border border-[#d1d5dc]'>Alapomeji Association</p>
            <p className='border border-[#d1d5dc]'>Peer contribution</p>
            <p className='border  border-[#d1d5dc]'>April 4, 2025</p>
            <TableAction
              editUrl='/account/admin/group-manager/edit/1'
              viewUrl='/account/admin/group-manager/view/1'
              showUserAction
            />
          </>
          <>
            <p className='border border-[#d1d5dc]'>Majue Contribution</p>
            <p className='border border-[#d1d5dc]'>community portfolio</p>
            <p className='border  border-[#d1d5dc]'>April 4, 2025</p>
            <TableAction
              editUrl='/account/admin/group-manager/edit/1'
              viewUrl='/account/admin/group-manager/view/1'
              showUserAction
            />
          </>
        </Table>
      </div>

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
          editUrl='/account/admin/group-manager/edit/1'
          viewUrl='/account/admin/group-manager/view/1'
          showAction
        >
          <p>Osunkoya Mayowa</p>
          <p className='break-all'>Osunkoya@gmail.com</p>
          <p>April 4, 2025</p>
        </TableCard>
        <TableCard
          editUrl='/account/admin/group-manager/edit/1'
          viewUrl='/account/admin/group-manager/view/1'
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

export default GroupManager;
