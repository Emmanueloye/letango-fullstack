/* eslint-disable react-refresh/only-export-components */
import { useQuery } from '@tanstack/react-query';
import PersonalTransferForm from '../../components/DashboardComponents/PersonalTransferForm';
import LinkBtn from '../../components/UI/LinkBtn';
import {
  extractFormData,
  fetchOnlyData,
  postData,
  queryClient,
} from '../../helperFunc.ts/apiRequest';
import { ActionFunctionArgs } from 'react-router-dom';

const PersonalTransfer = () => {
  const { data } = useQuery({
    queryKey: ['fetchBeneficiary'],
    queryFn: () => fetchOnlyData({ url: `/beneficiaries` }),
  });

  return (
    <>
      <div className='flex justify-end mb-4'>
        <LinkBtn btnText='back' url='/account/personal-wallet/transfer' />
      </div>
      <PersonalTransferForm beneficiaries={data?.beneficiaries} />
    </>
  );
};

export default PersonalTransfer;

export const loader = () => {
  return queryClient.ensureQueryData({
    queryKey: ['fetchBeneficiary'],
    queryFn: () => fetchOnlyData({ url: `/beneficiaries` }),
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await extractFormData(request);
  return postData({
    url: '/transfer',
    data,
    setToast: true,
    redirectTo: '/account/personal-wallet',
    invalidate: ['fetchBeneficiary'],
  });
};
