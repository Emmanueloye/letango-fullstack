import { ActionFunctionArgs } from 'react-router-dom';
import GroupWithdrawalForm from '../../components/DashboardComponents/GroupWithdrawalForm';
import { extractFormData, postData } from '../../helperFunc.ts/apiRequest';

const GroupWithdrawal = () => {
  return <GroupWithdrawalForm />;
};

export default GroupWithdrawal;

// eslint-disable-next-line react-refresh/only-export-components
export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await extractFormData(request);
  const data = { ...formData, groupRef: params.groupId };
  return postData({
    url: `/withdrawals`,
    data,
  });
};
