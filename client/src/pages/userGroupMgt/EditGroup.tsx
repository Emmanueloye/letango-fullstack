/* eslint-disable react-refresh/only-export-components */
import { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router-dom';
import EditGroupForm from '../../components/DashboardComponents/EditGroupForm';
import LinkBtn from '../../components/UI/LinkBtn';
import {
  getData,
  patchData,
  queryClient,
} from '../../helperFunc.ts/apiRequest';

const EditGroup = () => {
  return (
    <>
      <div className='flex justify-end'>
        <LinkBtn btnText='Back' url='/account/manage-group' />
      </div>
      <EditGroupForm />
    </>
  );
};

export default EditGroup;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  await queryClient.ensureQueryData({
    queryKey: ['fetchGroup', params.groupId],
    queryFn: () => getData({ url: `/groups/${params.groupId}` }),
  });
  return params;
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const data = await request.formData();
  return patchData({
    url: `/groups/${params.groupId}`,
    data,
    invalidate: ['fetchGroupMember', 'fetchGroup', 'fetchAllGroup'],
    redirectTo: '/account/manage-group',
    setToast: true,
  });
};
