import { Form, useParams } from 'react-router-dom';
import LinkBtn from '../UI/LinkBtn';
import Title from '../UI/Title';
import Button from '../UI/Button';

const GroupWithdrawalForm = () => {
  const params = useParams();

  return (
    <>
      <div className='flex justify-end mb-3'>
        <LinkBtn
          btnText='Back'
          url={`/account/manage-group/view/${params?.groupId}/withdraw`}
        />
      </div>
      <Title title='withdrawal form' />
      <Form
        method='post'
        className='w-full md:w-3/5 md:mx-auto bg-gray-100 dark:bg-slate-800 py-4 px-6 rounded-2xl'
      >
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
        <div className='mb-2'>
          <label
            htmlFor='bank'
            className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
          >
            expense head
          </label>
          <select>
            <option value='' hidden>
              Select expense
            </option>
            <option value=''>event</option>
            <option value=''>event</option>
          </select>
        </div>
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
