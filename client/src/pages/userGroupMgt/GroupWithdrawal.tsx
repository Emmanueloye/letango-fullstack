/* eslint-disable react-refresh/only-export-components */
import { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router-dom';
import GroupWithdrawalForm from '../../components/DashboardComponents/GroupWithdrawalForm';
import {
  extractFormData,
  fetchOnlyData,
  postData,
  queryClient,
} from '../../helperFunc.ts/apiRequest';

const GroupWithdrawal = () => {
  return <GroupWithdrawalForm />;
};

export default GroupWithdrawal;

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await extractFormData(request);
  const data = { ...formData, groupRef: params.groupId };
  return postData({
    url: `/withdrawals`,
    data,
    redirectTo: '/account/manage-group/view/GP-LUCFZLVK/withdraw',
    setToast: true,
  });
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  await queryClient.ensureQueryData({
    queryKey: ['fetchFundHead', params.groupId, 'expense'],
    queryFn: () =>
      fetchOnlyData({
        url: `/fundClasses?groupRef=${params.groupId}&headType=expense&isActive=true`,
      }),
  });
};
