/* eslint-disable react-refresh/only-export-components */
import { ActionFunctionArgs } from 'react-router-dom';
import CreateGroupForm from '../../components/DashboardComponents/CreateGroupForm';
import LinkBtn from '../../components/UI/LinkBtn';
import { postData } from '../../helperFunc.ts/apiRequest';

const CreateGroup = () => {
  return (
    <>
      <div className='flex justify-end'>
        <LinkBtn btnText='Back' url='/account/manage-group' />
      </div>
      <CreateGroupForm />;
    </>
  );
};

export default CreateGroup;

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await request.formData();
  return postData({
    url: '/groups',
    data,
    invalidate: ['fetchGroupMember'],
    setToast: true,
    redirectTo: '/account/manage-group',
  });
};
