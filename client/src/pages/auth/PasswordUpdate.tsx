import { ActionFunctionArgs } from 'react-router-dom';
import PasswordUpdateForm from '../../components/AuthComponets/PasswordUpdateForm';
import {
  extractFormData,
  patchData,
  queryClient,
} from '../../helperFunc.ts/apiRequest';

const PasswordUpdate = () => {
  return <PasswordUpdateForm />;
};

export default PasswordUpdate;

// eslint-disable-next-line react-refresh/only-export-components
export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await extractFormData(request);
  queryClient.invalidateQueries();
  return patchData({
    url: '/users/update-password',
    data,
    setToast: true,
    redirectTo: '/account/profile',
  });
};
