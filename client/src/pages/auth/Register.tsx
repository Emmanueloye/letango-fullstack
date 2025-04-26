/* eslint-disable react-refresh/only-export-components */
import {
  ActionFunctionArgs,
  useActionData,
  useNavigate,
} from 'react-router-dom';
import RegisterForm from '../../components/AuthComponets/RegisterForm';
import { extractFormData, postData } from '../../helperFunc.ts/apiRequest';
import { useAppDispatch } from '../../Actions/store';
import { useEffect } from 'react';
import { authActions } from '../../Actions/authAction';
import { FormActionType } from '../../dtos/formAction';

const Register = () => {
  const data = useActionData() as FormActionType;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (data?.status === 'success') {
      dispatch(authActions.registerMessage(data?.message));

      navigate('/login');
    }
  }, [data, dispatch, navigate]);

  return (
    <RegisterForm error={(data?.status === 'fail' && data?.message) || ''} />
  );
};

export default Register;

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await extractFormData(request);
  return postData({
    url: '/auth/signup',
    data,
    invalidate: ['fetchUser'],
  });
};
