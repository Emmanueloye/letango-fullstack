/* eslint-disable react-refresh/only-export-components */
import {
  LoaderFunctionArgs,
  redirect,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import LinkBtn from '../../components/UI/LinkBtn';
import Title from '../../components/UI/Title';
import TransactionBox from '../../components/UI/TransactionBox';
import {
  extractParams,
  fetchOnlyData,
  getData,
  queryClient,
} from '../../helperFunc.ts/apiRequest';
import { useQuery } from '@tanstack/react-query';
import { Withdrawal } from '../../dtos/paymentDto';
import { formatDate, formatTime } from '../../helperFunc.ts/utilsFunc';
import Empty from '../../components/UI/Empty';
import Pagination from '../../components/UI/Pagination';

const GroupPendingWithdrawals = () => {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const page = searchParams.get('page');

  const { data } = useQuery({
    queryKey: ['fetchWithdrawal', 'pending', params.groupId, page ?? 1],
    queryFn: () =>
      getData({
        url: `/withdrawals?groupRef=${
          params.groupId
        }&approvalStatus=pending&page=${page || 1}&limit=10`,
      }),
  });

  const { totalPages, currentPage, nextPage, previousPage } = data?.page || {};

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
          {/* Pagination */}
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            nextPage={nextPage}
            previousPage={previousPage}
            baseLink={`/account/manage-group/view/${params.groupId}/withdraw/pending`}
          />
        </div>
      ) : (
        <Empty message='No pending withdrawals awaiting approval.' />
      )}
    </section>
  );
};

export default GroupPendingWithdrawals;

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { page } = extractParams(request);

  await queryClient.ensureQueryData({
    queryKey: ['fetchWithdrawal', 'pending', params.groupId, page ?? 1],
    queryFn: () =>
      getData({
        url: `/withdrawals?groupRef=${
          params.groupId
        }&approvalStatus=pending&page=${page || 1}&limit=10`,
      }),
  });

  const resp = await queryClient.ensureQueryData({
    queryKey: ['fetchMember', params.groupId],
    queryFn: () => fetchOnlyData({ url: `/members/${params.groupId}` }),
  });

  if (!['admin', 'owner'].includes(resp.member.role)) {
    return redirect(`/account/manage-group/view/${params.groupId}`);
  }

  return page;
};
