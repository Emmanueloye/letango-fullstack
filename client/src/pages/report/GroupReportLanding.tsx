import { TbListDetails } from 'react-icons/tb';
import Card from '../../components/UI/Card';
import { Link, useParams } from 'react-router-dom';
import LinkBtn from '../../components/UI/LinkBtn';

const GroupReportLanding = () => {
  const params = useParams();
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
          <Card cardDesc='Transaction details' icon={<TbListDetails />} />
        </Link>
        <Link
          to={`/account/manage-group/view/${params.groupId}/reports/statement`}
        >
          <Card cardDesc='income and expenses' icon={<TbListDetails />} />
        </Link>
      </div>
    </>
  );
};

export default GroupReportLanding;
