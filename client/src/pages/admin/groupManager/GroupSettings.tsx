/* eslint-disable react-refresh/only-export-components */
import { ActionFunctionArgs } from 'react-router-dom';
import GroupSettingForm from '../../../components/DashboardComponents/GroupSettingForm';
import {
  extractFormData,
  getData,
  patchData,
  queryClient,
} from '../../../helperFunc.ts/apiRequest';

const GroupSettings = () => {
  return <GroupSettingForm />;
};

export default GroupSettings;

export const loader = async () => {
  return queryClient.ensureQueryData({
    queryKey: ['fetchGroupSetting', 'groupSettings'],
    queryFn: () => getData({ url: '/group-settings' }),
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { id, ...data } = await extractFormData(request);
  for (const key in data) {
    const value = data[key];
    data[key] = value.toString().replace(',', '');
  }

  queryClient.invalidateQueries({ queryKey: ['fetchGroupSetting'] });
  return patchData({
    url: `/group-settings/${id}`,
    data,
    setToast: true,
    invalidate: ['fetchGroupSetting'],
  });
};
