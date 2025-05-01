/* eslint-disable react-refresh/only-export-components */
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  useLoaderData,
} from 'react-router-dom';
import AdminEditUser from '../../../components/DashboardComponents/AdminEditUser';
import {
  extractFormData,
  getData,
  patchData,
  queryClient,
} from '../../../helperFunc.ts/apiRequest';
import { useQuery } from '@tanstack/react-query';

const EditUser = () => {
  const params = useLoaderData();

  const { data } = useQuery({
    queryKey: ['fetchUser', 'user'],
    queryFn: () => getData({ url: `/users/${params.id}` }),
  });

  return <AdminEditUser user={data.user} />;
};

export default EditUser;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  await queryClient.ensureQueryData({
    queryKey: ['fetchUser', 'user'],
    queryFn: () => getData({ url: `/users/${params.id}` }),
  });
  return params;
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const data = await extractFormData(request);
  queryClient.invalidateQueries({ queryKey: ['fetchUser'] });
  return patchData({
    url: `/users/${params.id}`,
    data,
    setToast: true,
    invalidate: ['fetchUser'],
    redirectTo: '/account/admin/user-manager',
  });
};
