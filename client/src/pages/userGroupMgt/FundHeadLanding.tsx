/* eslint-disable react-refresh/only-export-components */
import {
  Link,
  LoaderFunctionArgs,
  redirect,
  useParams,
} from 'react-router-dom';
import LinkBtn from '../../components/UI/LinkBtn';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import { fetchOnlyData, queryClient } from '../../helperFunc.ts/apiRequest';
import { useQuery } from '@tanstack/react-query';
import { IFundHead } from '../../dtos/groupDto';

const FundHeadLanding = () => {
  const params = useParams();

  const { data } = useQuery({
    queryKey: ['fetchFundHead', params.groupId],
    queryFn: () =>
      fetchOnlyData({ url: `/fundClasses?groupRef=${params.groupId}` }),
  });

  return (
    <section>
      {/* Back button */}
      <div className='flex justify-end mb-3'>
        <LinkBtn
          btnText='Back'
          url={`/account/manage-group/view/${params?.groupId}`}
        />
      </div>
      {/* Create new fund head link */}
      <Link
        to={`/account/manage-group/view/${params?.groupId}/fund-heads/create`}
        className='bg-primary-500 text-slate-50 px-3 py-2 rounded-md capitalize font-600 mt-1 mb-4'
      >
        New head
      </Link>

      {/* main listing */}

      <div className='grid md:grid-cols-3 gap-3 mt-6'>
        {/* members card */}
        {data?.fundClasses?.map((item: IFundHead) => (
          <div className='flex justify-center flex-wrap items-start shadow px-2 py-3 dark:bg-slate-800 bg-gray-100'>
            <div className='mb-2'>
              <p className='mb-2 font-500 capitalize text-center'>
                {item.head}
              </p>
              <p className='mb-2 font-500 capitalize text-center'>
                {item.headType}
              </p>
              {/* /account/manage-group/view/GP-LUCFZLVK/fund-heads */}
              <div className='flex justify-center gap-8'>
                <Link
                  to={`/account/manage-group/view/${params.groupId}/fund-heads/edit/${item._id}`}
                >
                  <FaPencilAlt className='text-amber-600' />
                </Link>
                <FaTrashAlt className='text-red-500' />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FundHeadLanding;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  await queryClient.ensureQueryData({
    queryKey: ['fetchFundHead', params.groupId],
    queryFn: () =>
      fetchOnlyData({
        url: `/fundClasses?groupRef=${params.groupId}&isActive=true`,
      }),
  });
  const resp = await queryClient.ensureQueryData({
    queryKey: ['fetchMember', params.groupId],
    queryFn: () => fetchOnlyData({ url: `/members/${params.groupId}` }),
  });

  if (!['admin', 'owner'].includes(resp.member.role)) {
    return redirect(`/account/manage-group/view/${params.groupId}`);
  }

  return null;
};
