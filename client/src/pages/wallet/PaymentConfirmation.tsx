/* eslint-disable react-refresh/only-export-components */
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import {
  extractParams,
  getData,
  queryClient,
} from '../../helperFunc.ts/apiRequest';
// import LinkBtn from '../../components/UI/LinkBtn';
// import { formatNumber } from '../../helperFunc.ts/utilsFunc';
import PaymentConfirmView from '../../components/DashboardComponents/PaymentConfirmView';
import { IPayment } from '../../dtos/paymentDto';

const PaymentConfirmation = () => {
  const data = useLoaderData();

  return (
    <PaymentConfirmView
      payment={data?.payment as IPayment}
      btnText='Personal Wallet'
      url='/account/personal-wallet'
    />
  );
};

export default PaymentConfirmation;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { reference } = extractParams(request);
  queryClient.invalidateQueries({ queryKey: ['user'] });
  return getData({ url: `/personal/confirm?reference=${reference}` });
};
