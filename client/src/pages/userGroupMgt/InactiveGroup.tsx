/* eslint-disable react-refresh/only-export-components */
import { useQuery } from '@tanstack/react-query';
import GroupBanner from '../../components/DashboardComponents/GroupBanner';
import LinkBtn from '../../components/UI/LinkBtn';
import { getData, queryClient } from '../../helperFunc.ts/apiRequest';
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';

const InactiveGroup = () => {
  const pageParams = useLoaderData() as { groupId: string };

  const { data } = useQuery({
    queryKey: ['fetchGroup', pageParams.groupId],
    queryFn: () => getData({ url: `/groups/${pageParams.groupId}` }),
  });

  return (
    <section>
      <div className='flex justify-end mb-3'>
        <LinkBtn btnText='Back' url='/account/manage-group' />
      </div>
      {/* Group banner */}
      <GroupBanner group={data?.group} />
      <div className='flex justify-center items-center flex-col'>
        <p className='mt-8'>This group has been deactivated by the admin</p>

        <h4 className='mt-8 font-800 text-2xl underline'>Why?</h4>

        <p className='text-center mt-2'>{data?.group?.reason}</p>
      </div>
    </section>
  );
};

export default InactiveGroup;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  await queryClient.ensureQueryData({
    queryKey: ['fetchGroup', params.groupId],
    queryFn: () => getData({ url: `/groups/${params.groupId}` }),
  });

  return params;
};
