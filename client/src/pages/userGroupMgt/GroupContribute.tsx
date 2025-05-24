/* eslint-disable react-refresh/only-export-components */
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from 'react-router-dom';
import GroupContributionForm from '../../components/DashboardComponents/GroupContributionForm';
import {
  extractFormData,
  fetchOnlyData,
  postData,
  queryClient,
} from '../../helperFunc.ts/apiRequest';

const GroupContribute = () => {
  //   const data = useLoaderData();

  return <GroupContributionForm />;
};

export default GroupContribute;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const classes = await queryClient.ensureQueryData({
    queryKey: ['fetchFundClass', params.groupId],
    queryFn: () =>
      fetchOnlyData({
        url: `/fundClasses?groupRef=${params.groupId}&headType=income&isActive=true`,
      }),
  });

  const respGroup = await queryClient.ensureQueryData({
    queryKey: ['user', params.groupId],
    queryFn: () => fetchOnlyData({ url: `/groups/${params.groupId}` }),
  });
  return { fundClasses: classes.fundClasses, group: respGroup.group };
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const data = await extractFormData(request);

  data.type = 'group';
  data.groupRef = params.groupId || '';

  const result = await postData({ url: `/personal`, data });
  if (result.status === 'success') {
    queryClient.invalidateQueries();
    return redirect(result.redirectURL);
  }
  return result;
};
