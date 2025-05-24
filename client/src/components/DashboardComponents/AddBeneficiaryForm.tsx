import { Form, useActionData } from 'react-router-dom';
import Button from '../UI/Button';
import Title from '../UI/Title';
import { useState } from 'react';
import { fetchOnlyData } from '../../helperFunc.ts/apiRequest';
import { FormActionType } from '../../dtos/formAction';
import FormError from '../UI/FormError';

const AddBeneficiaryForm = () => {
  const [account, setAccount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState('');

  const error = useActionData() as FormActionType;

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    setTimeout(async () => {
      const result = await fetchOnlyData({
        url: `/users/${e.target.value.toUpperCase()}`,
      });

      if (result.status === 'success') {
        setIsError('');
        setAccount(`${result?.user?.surname} ${result?.user?.otherNames}`);
        setIsLoading(false);
      } else {
        setIsError('Invalid account reference');
        setAccount('');
        setIsLoading(false);
      }
    }, 2000);
  };

  return (
    <Form method='post' className='bg-gray-100 dark:bg-slate-800 p-2 w-full '>
      {/* Card header */}
      <Title title='Add Beneficiary' />
      {error?.status === 'fail' && <FormError error={error?.message} />}
      {/* Sending account */}
      <div className='mb-2'>
        <label
          htmlFor='accountRef'
          className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
        >
          account reference
        </label>
        <input
          type='text'
          id='accountRef'
          name='accountRef'
          autoComplete='off'
          onChange={handleChange}
        />
      </div>

      {/* account name */}
      <div className='mb-2'>
        <label
          htmlFor='accountName'
          className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
        >
          account name
        </label>
        {isError && <small className='text-rose-500'>{isError}</small>}
        {isLoading && <small> fetching...</small>}
        <input
          type='text'
          id='accountName'
          name='accountName'
          autoComplete='off'
          disabled
          value={account}
          onChange={() => {}}
          className='capitalize'
        />
        <input
          type='text'
          name='accountName'
          value={account}
          onChange={() => {}}
          hidden
        />
      </div>

      {/* Submit button */}
      <div className='mt-4'>
        <Button btnText='save' btnType='submit' />
      </div>
    </Form>
  );
};

export default AddBeneficiaryForm;
