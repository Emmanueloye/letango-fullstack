import { FaCalendarAlt } from 'react-icons/fa';
// import { Form, useActionData } from 'react-router-dom';
import Button from './Button';
import { useState } from 'react';
// import { FormActionType } from '../../dtos/formAction';
import FormError from './FormError';
import { Group } from '../../dtos/groupDto';
import { User } from '../../dtos/UserDto';

const DateRangeSelector = ({
  showCustomer = false,
  title = 'Date range',
  handleSubmit,
  error,
  isLoading,
  customers,
  users,
}: {
  showCustomer?: boolean;
  title?: string;
  handleSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  error?: string;
  isLoading?: boolean;
  customers?: Group[];
  users?: User[];
}) => {
  const [isDateBoxOpen, setIsDateBoxOpen] = useState(false);
  return (
    <div className='grid gap-3 mx-auto w-full lg:w-2/4 cursor-pointer'>
      {error === 'fail' || (error && <FormError error={error} />)}
      <div
        className='flex justify-between items-center flex-wrap font-500 border p-2 rounded-md'
        onClick={() => setIsDateBoxOpen(!isDateBoxOpen)}
      >
        <h2 className='capitalize'>{title}</h2>
        <FaCalendarAlt />
      </div>
      <form
        id='dateSelector'
        className={isDateBoxOpen ? 'grid gap-1.5' : 'hidden'}
        onSubmit={(e) => handleSubmit?.(e)}
      >
        {showCustomer && customers && (
          <select name='groupRef' className='capitalize'>
            <option value='' hidden>
              Select customer
            </option>
            {customers?.map((item) => (
              <option
                value={item?.groupRef}
                className='capitalize'
                key={item?._id}
              >
                {item?.groupName}
              </option>
            ))}
          </select>
        )}

        {showCustomer && users && (
          <select name='userRef' className='capitalize'>
            <option value='' hidden>
              Select user
            </option>
            {users?.map((item) => (
              <option
                value={item?.userRef}
                className='capitalize'
                key={item?._id}
              >
                {item?.surname} {item.otherNames}
              </option>
            ))}
          </select>
        )}
        <input
          type='date'
          id='startDate'
          name='startDate'
          className='py-1.5 font-poppins text-sm'
        />
        <input
          type='date'
          id='endDate'
          name='endDate'
          className='py-1.5 font-poppins text-sm'
        />
        <Button
          btnText={isLoading ? 'Generating...' : 'Apply'}
          btnType='submit'
          disabled={isLoading}
        />
      </form>
    </div>
  );
};

export default DateRangeSelector;
