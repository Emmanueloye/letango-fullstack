import { ActionFunctionArgs } from 'react-router-dom';
import UpdateProfileForm from '../../components/AuthComponets/UpdateProfileForm';
import { patchData } from '../../helperFunc.ts/apiRequest';

const ProfileUpdate = () => {
  return <UpdateProfileForm />;
};

export default ProfileUpdate;

// eslint-disable-next-line react-refresh/only-export-components
export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await request.formData();

  return patchData({
    url: '/users/me',
    data,
    setToast: true,
    toastStyles: 'dark:bg-slate-700 text-slate-50',
    redirectTo: '/account/profile',
  });
};
