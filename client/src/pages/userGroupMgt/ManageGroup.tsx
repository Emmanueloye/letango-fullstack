import { FaPeopleGroup, FaUserGroup } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import GroupCard from '../../components/DashboardComponents/GroupCard';

const ManageGroup = () => {
  return (
    <section>
      <Link
        to='/account/manage-group/create-group'
        className='bg-primary-500 text-slate-50 px-3 py-2 rounded-md capitalize font-600 mt-1 mb-4'
      >
        create group
      </Link>

      <div className='grid lg:grid-cols-4 gap-3 mt-8'>
        <GroupCard
          cardDesc='Alapomeji Association'
          balance={1_200_000}
          icon={<FaUserGroup />}
          detailURLText={'view group'}
          detailURL='/account/manage-group/view/1'
          editURL='/account/manage-group/update-group/1'
        />
        <GroupCard
          cardDesc='Majue Contribution'
          balance={200_000}
          icon={<FaPeopleGroup />}
          detailURLText={'view group'}
          detailURL='/account/manage-group/view/2'
          editURL='/account/manage-group/update-group/2'
        />
      </div>
    </section>
  );
};

export default ManageGroup;
