/* eslint-disable react-refresh/only-export-components */
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from 'react-router-dom';
import {
  extractFormData,
  fetchOnlyData,
  getData,
  patchData,
  queryClient,
} from '../../helperFunc.ts/apiRequest';
import EditFundHeadForm from '../../components/DashboardComponents/EditFundHeadForm';

const EditFundHead = () => {
  return <EditFundHeadForm />;
};

export default EditFundHead;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  await queryClient.ensureQueryData({
    queryKey: ['fundHead', { ...params }],
    queryFn: () =>
      getData({
        url: `/fundClasses/${params.headId}?groupRef=${params.groupId}`,
      }),
  });

  const resp = await queryClient.ensureQueryData({
    queryKey: ['fetchMember', params.groupId],
    queryFn: () => fetchOnlyData({ url: `/members/${params.groupId}` }),
  });

  if (!['admin', 'owner'].includes(resp.member.role)) {
    return redirect(`/account/manage-group/view/${params.groupId}`);
  }

  return resp?.member;
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await extractFormData(request);

  return patchData({
    url: `/fundClasses/${params.headId}?groupRef=${params.groupId}`,
    data: { head: formData.head, headType: formData.headType },
    invalidate: ['fundHead', 'fetchFundHead'],
    redirectTo: `/account/manage-group/view/${params.groupId}/fund-heads`,
    setToast: true,
  });
};
