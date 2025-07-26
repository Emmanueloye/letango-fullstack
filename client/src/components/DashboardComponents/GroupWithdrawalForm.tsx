import { Form, useActionData, useParams } from 'react-router-dom';
import LinkBtn from '../UI/LinkBtn';
import Title from '../UI/Title';
import Button from '../UI/Button';
import { FormActionType } from '../../dtos/formAction';
import FormError from '../UI/FormError';
import { useQuery } from '@tanstack/react-query';
import { fetchOnlyData } from '../../helperFunc.ts/apiRequest';
import { IFundHead } from '../../dtos/groupDto';

const GroupWithdrawalForm = () => {
  const params = useParams();

  const error = useActionData() as FormActionType;

  const { data } = useQuery({
    queryKey: ['fetchFundHead', params.groupId, 'expense'],
    queryFn: () =>
      fetchOnlyData({
        url: `/fundClasses?groupRef=${params.groupId}&headType=expense&isActive=true`,
      }),
  });

  return (
    <>
      <div className='flex justify-end mb-3'>
        <LinkBtn
          btnText='Back'
          url={`/account/manage-group/view/${params?.groupId}/withdraw`}
        />
      </div>
      <Title title='withdrawal form' />
      {/* Withdrawal notice */}
      <div className='bg-amber-600 text-white text-[15px] md:w-3/5 w-full mx-auto mb-3 px-6 py-3 rounded-2xl'>
        Please note that your withdrawal will be credited your account in within
        24 hours of placement and approval
      </div>
      <Form
        method='post'
        id='withdrawalForm'
        className='w-full md:w-3/5 md:mx-auto bg-gray-100 dark:bg-slate-800 py-4 px-6 rounded-2xl'
      >
        {error?.status === 'fail' && <FormError error={error?.message} />}
        <div className='mb-2'>
          <label
            htmlFor='to'
            className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
          >
            Receiver name
          </label>
          <input
            type='text'
            id='to'
            name='to'
            autoComplete='off'
            className='capitalize'
          />
        </div>
        <div className='mb-2'>
          <label
            htmlFor='bank'
            className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
          >
            Receiver Bank
          </label>
          <input
            type='text'
            id='bank'
            name='bank'
            autoComplete='off'
            className='capitalize'
          />
        </div>
        <div className='mb-2'>
          <label
            htmlFor='accountNumber'
            className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
          >
            Receiver account
          </label>
          <input
            type='text'
            id='accountNumber'
            name='accountNumber'
            autoComplete='off'
            className='capitalize'
          />
        </div>
        {data?.fundClasses.length > 0 && (
          <div className='mb-2'>
            <label
              htmlFor='bank'
              className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
            >
              expense head
            </label>
            <select className='capitalize' name='head'>
              <option value='' hidden>
                Select expense
              </option>
              {data?.fundClasses?.map((item: IFundHead) => (
                <option value={item?._id} key={item?._id}>
                  {item?.head}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className='mb-2'>
          <label
            htmlFor='amount'
            className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
          >
            amount
          </label>
          <input
            type='text'
            id='amount'
            name='amount'
            autoComplete='off'
            className='capitalize'
          />
        </div>
        <div className='mb-2'>
          <label
            htmlFor='description'
            className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
          >
            description
          </label>
          <input
            type='text'
            id='description'
            name='description'
            autoComplete='off'
            className='capitalize'
          />
        </div>
        <div className='mt-4'>
          <Button btnText='place withdrawal' btnType='submit' />
        </div>
      </Form>
    </>
  );
};

export default GroupWithdrawalForm;
