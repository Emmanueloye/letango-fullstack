/* eslint-disable react-refresh/only-export-components */
import { ActionFunctionArgs, useActionData } from 'react-router-dom';
import ResetPasswordLinkForm from '../../components/AuthComponets/ResetPasswordLinkForm';
import { extractFormData, postData } from '../../helperFunc.ts/apiRequest';
import { FormActionType } from '../../dtos/formAction';

const ResetPasswordLink = () => {
  const data = useActionData() as FormActionType;

  return (
    <ResetPasswordLinkForm
      error={(data?.status === 'fail' && data?.message) || ''}
      successMsg={(data?.status === 'success' && data.message) || ''}
    />
  );
};

export default ResetPasswordLink;

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await extractFormData(request);
  return postData({
    url: '/auth/forget-password',
    data,
  });
};
