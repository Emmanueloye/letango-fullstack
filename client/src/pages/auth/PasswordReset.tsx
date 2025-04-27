/* eslint-disable react-refresh/only-export-components */
import {
  ActionFunctionArgs,
  useActionData,
  useNavigate,
} from 'react-router-dom';
import PasswordResetForm from '../../components/AuthComponets/PasswordResetForm';
import {
  extractFormData,
  extractParams,
  postData,
} from '../../helperFunc.ts/apiRequest';
import { FormActionType } from '../../dtos/formAction';
import { useEffect } from 'react';
import { useAppDispatch } from '../../Actions/store';
import { authActions } from '../../Actions/authAction';

const PasswordReset = () => {
  const data = useActionData() as FormActionType;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (data?.status === 'success') {
      dispatch(authActions.passwordResetMsg(data?.message));
      navigate('/login');
    }
  }, [data, dispatch, navigate]);

  return (
    <PasswordResetForm
      error={(data?.status === 'fail' && data?.message) || ''}
    />
  );
};

export default PasswordReset;

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await extractFormData(request);
  const queryParam = extractParams(request);

  return postData({
    url: '/auth/reset-password',
    data: { ...formData, ...queryParam },
  });
};
