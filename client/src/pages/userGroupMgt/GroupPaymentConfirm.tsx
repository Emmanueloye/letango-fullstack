import { LoaderFunctionArgs, useLoaderData, useParams } from 'react-router-dom';
import PaymentConfirmView from '../../components/DashboardComponents/PaymentConfirmView';
import { IPayment } from '../../dtos/paymentDto';
import {
  extractParams,
  getData,
  queryClient,
} from '../../helperFunc.ts/apiRequest';

const GroupPaymentConfirm = () => {
  const data = useLoaderData();
  const params = useParams();

  return (
    <PaymentConfirmView
      payment={data?.payment as IPayment}
      url={`/account/manage-group/view/${params.groupId}`}
      btnText='back to group'
    />
  );
};

export default GroupPaymentConfirm;

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { reference } = extractParams(request);
  queryClient.invalidateQueries({ queryKey: ['user'] });
  return getData({ url: `/personal/group-confirm?reference=${reference}` });
};
