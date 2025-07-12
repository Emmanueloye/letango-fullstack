import { LoaderFunctionArgs, useLocation, useParams } from 'react-router-dom';
import Title from '../../../components/UI/Title';
import LinkBtn from '../../../components/UI/LinkBtn';
import { getData, queryClient } from '../../../helperFunc.ts/apiRequest';
import { useQuery } from '@tanstack/react-query';
import ViewWithdrawalLayout from '../../../components/DashboardComponents/ViewWithdrawalLayout';
import { formatDateWD } from '../../../helperFunc.ts/utilsFunc';
import { Approval } from '../../../dtos/paymentDto';

const ViewWithdrawals = () => {
  const params = useParams();
  const path = useLocation();
  const pathIdentifier = path.pathname?.split('/').at(-2);
  const backURL = `/account/admin/withdrawals/${pathIdentifier}`;

  const { data } = useQuery({
    queryKey: ['fetchWithdrawal', params.id],
    queryFn: () => getData({ url: `/withdrawals/admin/${params.id}` }),
  });

  console.log(data);

  return (
    <div>
      {/* Back link */}
      <div className='flex justify-end mb-2'>
        <LinkBtn btnText='back' url={backURL} />
      </div>
      <Title title={`${pathIdentifier} withdrawal details`} />
      {/* open withdrawal details */}
      <ViewWithdrawalLayout withdrawal={data?.withdrawal} />
      {/* requester details */}
      <Title title={`requester details`} />
      <div className='grid md:grid-cols-2 gap-2'>
        <div className='mb-6'>
          <label htmlFor='requester'>requested by</label>
          <input
            type='text'
            id='requester'
            name='requester'
            defaultValue={`${data?.withdrawal?.requester?.surname} ${data?.withdrawal?.requester?.otherNames}`}
            autoComplete='off'
            className='capitalize'
            disabled
          />
        </div>
        <div className='mb-6'>
          <label htmlFor='createdAt'>Created date</label>
          <input
            type='text'
            id='createdAt'
            name='createdAt'
            defaultValue={formatDateWD(new Date(data?.withdrawal?.createdAt))}
            autoComplete='off'
            className='capitalize'
            disabled
          />
        </div>
      </div>
      {/* approval details */}
      <Title title={`approval details`} />
      {!data?.withdrawal?.approvedBySys ? (
        <div className='grid md:grid-cols-3 gap-2'>
          {data?.withdrawal?.approvedBy?.map((item: Approval) => (
            <>
              <div className='mb-6'>
                <label htmlFor='approvedBy'>approved by</label>
                <input
                  type='text'
                  id='approvedBy'
                  name='approvedBy'
                  defaultValue={`${item?.userId?.surname} ${item?.userId?.otherNames}`}
                  autoComplete='off'
                  className='capitalize'
                  disabled
                />
              </div>
              <div className='mb-6'>
                <label htmlFor='comment'>comment</label>
                <input
                  type='text'
                  id='comment'
                  name='comment'
                  defaultValue={item?.comment}
                  autoComplete='off'
                  className='capitalize'
                  disabled
                />
              </div>
              <div className='mb-6'>
                <label htmlFor='approvedAt'>approval date</label>
                <input
                  type='text'
                  id='approvedAt'
                  name='approvedAt'
                  defaultValue={formatDateWD(
                    new Date(item?.approvedAt as Date)
                  )}
                  autoComplete='off'
                  className='capitalize'
                  disabled
                />
              </div>
            </>
          ))}
        </div>
      ) : (
        <div>Approved by system</div>
      )}
    </div>
  );
};

export default ViewWithdrawals;

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async ({ params }: LoaderFunctionArgs) => {
  return queryClient.ensureQueryData({
    queryKey: ['fetchWithdrawal', params.id],
    queryFn: () => getData({ url: `/withdrawals/admin/${params.id}` }),
  });
};
