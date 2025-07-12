import { Withdrawal } from '../../dtos/paymentDto';
import { formatNumber } from '../../helperFunc.ts/utilsFunc';

const ViewWithdrawalLayout = ({ withdrawal }: { withdrawal: Withdrawal }) => {
  return (
    <div className='grid md:grid-cols-3 gap-2'>
      <div className='mb-6'>
        <label htmlFor='id'>withdrawal ID</label>
        <input
          type='text'
          id='id'
          name='id'
          defaultValue={withdrawal?._id}
          autoComplete='off'
          className='capitalize'
          disabled
        />
      </div>
      <div className='mb-6'>
        <label htmlFor='receiver'>receiver account</label>
        <input
          type='text'
          id='receiver'
          name='receiver'
          defaultValue={withdrawal?.accountNumber}
          autoComplete='off'
          className='capitalize'
          disabled
        />
      </div>
      <div className='mb-6'>
        <label htmlFor='bank'>receiver bank</label>
        <input
          type='text'
          id='bank'
          name='bank'
          defaultValue={withdrawal?.bank}
          autoComplete='off'
          className='capitalize'
          disabled
        />
      </div>
      <div className='mb-6'>
        <label htmlFor='amount'>amount</label>
        <input
          type='text'
          id='amount'
          name='amount'
          defaultValue={formatNumber(withdrawal?.contribution)}
          autoComplete='off'
          className='capitalize'
          disabled
        />
      </div>
      <div className='mb-6'>
        <label htmlFor='from'>from</label>
        <input
          type='text'
          id='from'
          name='from'
          defaultValue={withdrawal?.fromGroup?.groupName}
          autoComplete='off'
          className='capitalize'
          disabled
        />
      </div>
      <div className='mb-6'>
        <label htmlFor='to'>To</label>
        <input
          type='text'
          id='to'
          name='to'
          defaultValue={withdrawal?.to}
          autoComplete='off'
          className='capitalize'
          disabled
        />
      </div>
      <div className='mb-6'>
        <label htmlFor='desc'>description</label>
        <input
          type='text'
          id='desc'
          name='desc'
          defaultValue={withdrawal?.description}
          autoComplete='off'
          className='capitalize'
          disabled
        />
      </div>
      <div className='mb-6'>
        <label htmlFor='headType'>head type</label>
        <input
          type='text'
          id='headType'
          name='headType'
          defaultValue={withdrawal?.headType}
          autoComplete='off'
          className='capitalize'
          disabled
        />
      </div>
      <div className='mb-6'>
        <label htmlFor='head'>head</label>
        <input
          type='text'
          id='head'
          name='head'
          defaultValue={withdrawal?.head}
          autoComplete='off'
          className='capitalize'
          disabled
        />
      </div>
    </div>
  );
};

export default ViewWithdrawalLayout;
