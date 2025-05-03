/* eslint-disable react-refresh/only-export-components */
import { ActionFunctionArgs, redirect } from 'react-router-dom';
import ContributeForm from '../../components/DashboardComponents/ContributeForm';
import {
  extractFormData,
  postData,
  queryClient,
} from '../../helperFunc.ts/apiRequest';

const Contribute = () => {
  return <ContributeForm />;
};

export default Contribute;

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await extractFormData(request);
  queryClient.invalidateQueries({ queryKey: ['user'] });
  const result = await postData({ url: `/personal`, data });
  if (result.status === 'success') {
    return redirect(result.redirectURL);
  }
  return result;
};
