/* eslint-disable react-refresh/only-export-components */
import {
  ActionFunctionArgs,
  useActionData,
  useNavigate,
} from 'react-router-dom';
import LoginForm from '../../components/AuthComponets/LoginForm';
import {
  extractFormData,
  postData,
  queryClient,
} from '../../helperFunc.ts/apiRequest';
import { FormActionType } from '../../dtos/formAction';
import { useEffect } from 'react';
import { useAppDispatch } from '../../Actions/store';
import { authActions } from '../../Actions/authAction';

const Login = () => {
  const data = useActionData() as FormActionType & { redirectURL: string };
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (data?.status === 'success') {
      dispatch(authActions.updateVerificationMsg(data?.message));
      navigate(data?.redirectURL);
    }
  }, [data, dispatch, navigate]);

  return <LoginForm error={(data?.status === 'fail' && data?.message) || ''} />;
};

export default Login;

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await extractFormData(request);
  const resp = await postData({
    url: '/auth/login',
    data,
  });

  if (resp.status === 'success') {
    queryClient.invalidateQueries();
    return resp;
  }
  queryClient.invalidateQueries();
  return resp;
};
