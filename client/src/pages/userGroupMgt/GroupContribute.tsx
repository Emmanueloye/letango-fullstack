/* eslint-disable react-refresh/only-export-components */
import { LoaderFunctionArgs } from 'react-router-dom';
import GroupContributionForm from '../../components/DashboardComponents/GroupContributionForm';
import { fetchOnlyData, queryClient } from '../../helperFunc.ts/apiRequest';

const GroupContribute = () => {
  //   const data = useLoaderData();
  //   console.log(data);

  return <GroupContributionForm />;
};

export default GroupContribute;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const classes = await queryClient.ensureQueryData({
    queryKey: ['fetchFundClass', params.groupId],
    queryFn: () =>
      fetchOnlyData({
        url: `/fundClasses?groupRef=${params.groupId}&headType=income`,
      }),
  });

  const respGroup = await queryClient.ensureQueryData({
    queryKey: ['user', params.groupId],
    queryFn: () => fetchOnlyData({ url: `/groups/${params.groupId}` }),
  });
  return { fundClasses: classes.fundClasses, group: respGroup.group };
};
