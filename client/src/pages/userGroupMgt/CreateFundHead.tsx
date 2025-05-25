/* eslint-disable react-refresh/only-export-components */
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from 'react-router-dom';
import CreateFundHeadForm from '../../components/DashboardComponents/CreateFundHeadForm';
import {
  extractFormData,
  fetchOnlyData,
  postData,
  queryClient,
} from '../../helperFunc.ts/apiRequest';

const CreateFundHead = () => {
  return <CreateFundHeadForm />;
};

export default CreateFundHead;

export const loader = async ({ params }: LoaderFunctionArgs) => {
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
  const data = await extractFormData(request);

  return postData({
    url: `/fundClasses`,
    data,
    redirectTo: `/account/manage-group/view/${params.groupId}/fund-heads`,
    setToast: true,
  });
};
