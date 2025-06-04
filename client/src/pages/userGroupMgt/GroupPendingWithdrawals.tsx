/* eslint-disable react-refresh/only-export-components */
import { LoaderFunctionArgs, redirect, useParams } from 'react-router-dom';
import LinkBtn from '../../components/UI/LinkBtn';
import Title from '../../components/UI/Title';
import TransactionBox from '../../components/UI/TransactionBox';
import {
  fetchOnlyData,
  getData,
  queryClient,
} from '../../helperFunc.ts/apiRequest';
import { useQuery } from '@tanstack/react-query';
import { Withdrawal } from '../../dtos/paymentDto';
import { formatDate, formatTime } from '../../helperFunc.ts/utilsFunc';
import Empty from '../../components/UI/Empty';

const GroupPendingWithdrawals = () => {
  const params = useParams();

  const { data } = useQuery({
    queryKey: ['fetchWithdrawal', 'pending', params.groupId],
    queryFn: () =>
      getData({
        url: `/withdrawals?groupRef=${params.groupId}&status=pending`,
      }),
  });

  console.log(data);

  return (
    <section>
      <div className='flex justify-end mb-3'>
        <LinkBtn
          btnText='Back'
          url={`/account/manage-group/view/${params?.groupId}/withdraw`}
        />
      </div>
      <Title title='Pending withdrawals' />

      {data?.withdrawals?.length > 0 ? (
        <div>
          {data?.withdrawals.map((item: Withdrawal) => {
            return (
              <TransactionBox
                key={item._id}
                description={item?.description}
                date={formatDate(new Date(item?.createdAt))}
                time={formatTime(new Date(item?.createdAt))}
                amount={-`${item?.contribution}`}
                approvals={item.approvedBy}
                show
              />
            );
          })}
        </div>
      ) : (
        <Empty message='No pending withdrawals awaiting approval.' />
      )}
    </section>
  );
};

export default GroupPendingWithdrawals;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  await queryClient.ensureQueryData({
    queryKey: ['fetchWithdrawal', 'pending', params.groupId],
    queryFn: () =>
      getData({
        url: `/withdrawals?groupRef=${params.groupId}&status=pending`,
      }),
  });

  const resp = await queryClient.ensureQueryData({
    queryKey: ['fetchMember', params.groupId],
    queryFn: () => fetchOnlyData({ url: `/members/${params.groupId}` }),
  });

  if (!['admin', 'owner'].includes(resp.member.role)) {
    return redirect(`/account/manage-group/view/${params.groupId}`);
  }

  return params;
};
