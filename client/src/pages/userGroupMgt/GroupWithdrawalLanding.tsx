import {
  Link,
  LoaderFunctionArgs,
  redirect,
  useParams,
} from 'react-router-dom';
import Card from '../../components/UI/Card';
import { FaTimesCircle } from 'react-icons/fa';
import { MdOutlinePending } from 'react-icons/md';
import { FaCircleCheck } from 'react-icons/fa6';
import LinkBtn from '../../components/UI/LinkBtn';
import { fetchOnlyData, queryClient } from '../../helperFunc.ts/apiRequest';

const GroupWithdrawalLanding = () => {
  const params = useParams();
  return (
    <section>
      <div className='flex justify-end mb-3'>
        <LinkBtn
          btnText='Back'
          url={`/account/manage-group/view/${params?.groupId}`}
        />
      </div>
      <LinkBtn
        btnText='place withdrawal'
        className='flex justify-center mb-4'
        url={`/account/manage-group/view/${params.groupId}/withdraw/draw`}
      />

      <div className='grid md:grid-cols-3 gap-4'>
        <Link
          to={`/account/manage-group/view/${params.groupId}/withdraw/pending`}
        >
          <Card cardDesc='pending' icon={<MdOutlinePending />} />
        </Link>
        <Link
          to={`/account/manage-group/view/${params.groupId}/withdraw/approved`}
        >
          <Card cardDesc='approved' icon={<FaCircleCheck />} />
        </Link>
        <Link
          to={`/account/manage-group/view/${params.groupId}/withdraw/rejected`}
        >
          <Card cardDesc='rejected' icon={<FaTimesCircle />} />
        </Link>
      </div>
    </section>
  );
};

export default GroupWithdrawalLanding;

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async ({ params }: LoaderFunctionArgs) => {
  const resp = await queryClient.ensureQueryData({
    queryKey: ['fetchMember', params.groupId],
    queryFn: () => fetchOnlyData({ url: `/members/${params.groupId}` }),
  });

  if (!['admin', 'owner'].includes(resp.member.role)) {
    return redirect(`/account/manage-group/view/${params.groupId}`);
  }
};
