/* eslint-disable react-refresh/only-export-components */
import { FaPeopleGroup } from 'react-icons/fa6';
import { Link, LoaderFunctionArgs, useSearchParams } from 'react-router-dom';
import GroupCard from '../../components/DashboardComponents/GroupCard';
import {
  extractParams,
  getData,
  queryClient,
} from '../../helperFunc.ts/apiRequest';
import { useQuery } from '@tanstack/react-query';
import Empty from '../../components/UI/Empty';
import { Member } from '../../dtos/groupDto';
import Pagination from '../../components/UI/Pagination';

const ManageGroup = () => {
  const [searchParams] = useSearchParams();
  const page = searchParams.get('page');

  const { data } = useQuery({
    queryKey: ['fetchGroupMember', 'groupMember', page ?? 1],
    queryFn: () =>
      getData({
        url: `/members?page=${page || 1}&limit=12&sort=-joinedAt&status=true`,
      }),
  });

  const { totalPages, currentPage, nextPage, previousPage } = data?.page || {};

  return (
    <section>
      <div className='flex gap-2 flex-wrap'>
        <Link
          to='/account/manage-group/create-group'
          className='bg-primary-500 text-slate-50 px-3 py-2 rounded-md capitalize font-600 mt-1 mb-4'
        >
          New Contribution
        </Link>
        <Link
          to='/account/manage-group/create-group' // to be updated
          className='bg-primary-500 text-slate-50 px-3 py-2 rounded-md capitalize font-600 mt-1 mb-4'
        >
          New Club & Association
        </Link>
      </div>

      {data?.userGroups?.length > 0 ? (
        <>
          <div className='grid lg:grid-cols-4 gap-3 mt-8'>
            {data?.userGroups?.map((item: Member) => {
              return (
                <GroupCard
                  key={item?._id}
                  cardDesc={item?.groupId?.groupName}
                  balance={item?.groupId?.groupBalance}
                  icon={<FaPeopleGroup />}
                  detailURLText={'view group'}
                  detailURL={`/account/manage-group/view/${item?.groupRef}`}
                  editURL={`/account/manage-group/update-group/${item?.groupRef}`}
                  role={item.role}
                />
              );
            })}
          </div>
          {/* Pagination */}
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            nextPage={nextPage}
            previousPage={previousPage}
            baseLink={`/account/manage-group`}
          />
        </>
      ) : (
        <Empty message='You are not a member of any group yet.' />
      )}
    </section>
  );
};

export default ManageGroup;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { page } = extractParams(request);
  return queryClient.ensureQueryData({
    queryKey: ['fetchGroupMember', 'groupMember', page ?? 1],
    queryFn: () =>
      getData({
        url: `/members?page=${page || 1}&limit=12&sort=-joinedAt&status=true`,
      }),
  });
};
