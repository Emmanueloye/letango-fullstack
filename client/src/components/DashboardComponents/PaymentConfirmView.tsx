import { IPayment } from '../../dtos/paymentDto';
import { formatNumber } from '../../helperFunc.ts/utilsFunc';
import LinkBtn from '../UI/LinkBtn';

const PaymentConfirmView = ({
  payment,
  url,
  btnText,
}: {
  payment: IPayment;
  url: string;
  btnText: string;
}) => {
  return (
    <section>
      <article className='w-full lg:w-2/5 dark:bg-slate-800 bg-gray-100 p-2 mx-auto shadow'>
        <div className='text-center mb-4'>
          <p className='capitalize'>Transaction Successful</p>
          {/* <p>reference</p> */}
        </div>
        <div className='flex justify-between mb-3 flex-wrap'>
          <p className='capitalize'>refrence :</p>
          <p>{payment?.transactionRef}</p>
        </div>
        <div className='flex justify-between mb-3 flex-wrap'>
          <p className='capitalize'>contribution :</p>
          <p className='font-poppins'>
            &#8358;
            {payment?.contribution
              ? formatNumber(payment?.contribution)
              : '0.00'}
          </p>
        </div>
        <LinkBtn btnText={btnText} url={url} className='flex justify-center' />
      </article>
    </section>
  );
};

export default PaymentConfirmView;
