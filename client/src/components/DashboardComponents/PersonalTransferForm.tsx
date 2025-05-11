import Button from '../UI/Button';
import BalanceCard from '../UI/BalanceCard';
import { Form, useActionData, useOutletContext } from 'react-router-dom';
import { useState } from 'react';
import { User } from '../../dtos/UserDto';
import { fetchOnlyData } from '../../helperFunc.ts/apiRequest';
import { BeneficiaryType } from '../../dtos/beneficiaryDto';
import { FormActionType } from '../../dtos/formAction';
import FormError from '../UI/FormError';

const PersonalTransferForm = ({
  beneficiaries,
}: {
  beneficiaries: BeneficiaryType[];
}) => {
  const [account, setAccount] = useState('');
  const [accountCode, setAccountCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState('');
  const error = useActionData() as FormActionType;

  const user = useOutletContext() as User;

  const handleAccountChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsLoading(true);
    setTimeout(async () => {
      const result = await fetchOnlyData({
        url: `/users/${encodeURIComponent(e.target.value.toUpperCase())}`,
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

  const handleBeneficiaryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAccountCode(e.target.value);

    setIsLoading(true);
    setTimeout(async () => {
      const result = await fetchOnlyData({
        url: `/users/${encodeURIComponent(e.target.value.toUpperCase())}`,
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
    <Form
      method='post'
      className='bg-gray-100 dark:bg-slate-800 p-2 w-full lg:w-4/5 lg:mx-auto'
    >
      {/* Card header */}
      <BalanceCard balance={user?.personalWallet} />

      {error?.status === 'fail' && <FormError error={error?.message} />}
      {/* Sending account */}
      <div className='mb-2'>
        <label htmlFor='from'>Sending account</label>
        <input
          type='text'
          id='from'
          name='from'
          autoComplete='off'
          defaultValue={`${user?.surname} ${user?.otherNames}`}
          disabled
          className='capitalize'
        />
      </div>
      {/* Receiving account */}
      <div
        className={`grid ${
          beneficiaries?.length > 0 && 'lg:grid-cols-2 gap-2'
        }`}
      >
        {/* Receiving account */}
        <div className='mb-2'>
          <label
            htmlFor='to'
            className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
          >
            Receiving account
          </label>
          <input
            type='text'
            id='to'
            name='to'
            autoComplete='off'
            defaultValue={accountCode}
            onChange={handleAccountChange}
          />
        </div>
        {/* Beneficiaries if available */}
        {beneficiaries?.length > 0 && (
          <div className='order-first lg:order-last'>
            <label htmlFor='beneficiaries'>beneficiaries</label>
            <select
              name='beneficiaries'
              id='beneficiaries'
              className='py-2.5 capitalize'
              onChange={handleBeneficiaryChange}
              // value={account}
            >
              <option value='' hidden>
                Select beneficiary
              </option>
              {beneficiaries.map((item) => (
                <option value={item.accountRef} key={item._id}>
                  {item.accountName}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      {/* Account name */}
      <div className='mb-2'>
        <label htmlFor='accountName'>Account name</label>
        {isError && <small className='text-rose-500'>{isError}</small>}
        {isLoading && <small> fetching...</small>}
        <input
          type='text'
          id='accountName'
          name='accountName'
          autoComplete='off'
          value={account}
          onChange={() => {}}
          disabled
          className='capitalize'
        />
      </div>
      {/* Transfer description */}
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
        />
      </div>
      {/* Transfer amount */}
      <div className='mb-2'>
        <label
          htmlFor='amount'
          className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
        >
          Amount
        </label>
        <input type='number' id='amount' name='amount' autoComplete='off' />
      </div>
      {/* Submit button */}
      <div className='mt-4'>
        <Button btnText='transfer' btnType='submit' />
      </div>
    </Form>
  );
};

export default PersonalTransferForm;
