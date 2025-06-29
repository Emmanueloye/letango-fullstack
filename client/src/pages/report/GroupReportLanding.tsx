import { TbListDetails } from 'react-icons/tb';
import { PiHandCoins } from 'react-icons/pi';
import Card from '../../components/UI/Card';
import { Link, LoaderFunctionArgs, useParams } from 'react-router-dom';
import LinkBtn from '../../components/UI/LinkBtn';
import { fetchOnlyData, queryClient } from '../../helperFunc.ts/apiRequest';
import { useQuery } from '@tanstack/react-query';

const GroupReportLanding = () => {
  const params = useParams();

  const { data } = useQuery({
    queryKey: ['fetchGroup', params.groupId],
    queryFn: () => fetchOnlyData({ url: `/groups/${params.groupId}` }),
  });

  return (
    <>
      <div className='flex justify-end mb-4'>
        <LinkBtn
          btnText='back'
          url={`/account/manage-group/view/${params.groupId}`}
        />
      </div>
      <div className='grid md:grid-cols-2 gap-4'>
        <Link
          to={`/account/manage-group/view/${params.groupId}/reports/transaction`}
        >
          <Card cardDesc='Group Statement' icon={<TbListDetails />} />
        </Link>
        {['ASSOCIATION', 'CLUB'].includes(
          data?.group?.groupType?.toUpperCase()
        ) && (
          <Link
            to={`/account/manage-group/view/${params.groupId}/reports/statement`}
          >
            <Card cardDesc='income and expenses' icon={<TbListDetails />} />
          </Link>
        )}
        <Link
          to={`/account/manage-group/view/${params.groupId}/reports/contributions`}
        >
          <Card cardDesc='Contributions Report' icon={<PiHandCoins />} />
        </Link>
      </div>
    </>
  );
};

export default GroupReportLanding;

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async ({ params }: LoaderFunctionArgs) => {
  await queryClient.ensureQueryData({
    queryKey: ['fetchGroup', params.groupId],
    queryFn: () => fetchOnlyData({ url: `/groups/${params.groupId}` }),
  });
};
