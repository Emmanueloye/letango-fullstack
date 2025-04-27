/* eslint-disable react-refresh/only-export-components */
import { ActionFunctionArgs, useActionData } from 'react-router-dom';
import OTPForm from '../../components/AuthComponets/OTPForm';
import {
  extractFormData,
  extractParams,
  postData,
} from '../../helperFunc.ts/apiRequest';
import { FormActionType } from '../../dtos/formAction';

const OTPValidation = () => {
  const data = useActionData() as FormActionType;
  return <OTPForm error={(data?.status === 'fail' && data?.message) || ''} />;
};

export default OTPValidation;

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await extractFormData(request);
  const params = extractParams(request);

  return postData({
    url: '/auth/verify-OTP',
    data: { ...formData, ...params },
    redirectTo: '/account',
  });
};
