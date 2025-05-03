/* eslint-disable react-refresh/only-export-components */
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import {
  extractParams,
  getData,
  queryClient,
} from '../../helperFunc.ts/apiRequest';
import LinkBtn from '../../components/UI/LinkBtn';
import { formatNumber } from '../../helperFunc.ts/utilsFunc';

const PaymentConfirmation = () => {
  const data = useLoaderData();

  return (
    <section>
      <article className='w-full lg:w-2/5 dark:bg-slate-800 bg-gray-100 p-2 mx-auto shadow'>
        <div className='text-center mb-4'>
          <p className='capitalize'>Transaction Successful</p>
          {/* <p>reference</p> */}
        </div>
        <div className='flex justify-between mb-3 flex-wrap'>
          <p className='capitalize'>refrence :</p>
          <p>{data?.payment?.transactionRef}</p>
        </div>
        <div className='flex justify-between mb-3 flex-wrap'>
          <p className='capitalize'>contribution :</p>
          <p className='font-poppins'>
            &#8358;
            {data?.payment?.contribution
              ? formatNumber(data?.payment?.contribution)
              : '0.00'}
          </p>
        </div>
        <LinkBtn
          btnText='Personal Wallet'
          url='/account/personal-wallet'
          className='flex justify-center'
        />
      </article>
    </section>
  );
};

export default PaymentConfirmation;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { reference } = extractParams(request);
  queryClient.invalidateQueries({ queryKey: ['user'] });
  return getData({ url: `/personal/confirm?reference=${reference}` });
};
