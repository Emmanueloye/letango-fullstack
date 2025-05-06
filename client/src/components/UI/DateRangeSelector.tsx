import { FaCalendarAlt } from 'react-icons/fa';
// import { Form, useActionData } from 'react-router-dom';
import Button from './Button';
import { useState } from 'react';
// import { FormActionType } from '../../dtos/formAction';
import FormError from './FormError';

const DateRangeSelector = ({
  showCustomer = false,
  title = 'Date range',
  handleSubmit,
  error,
  isLoading,
}: {
  showCustomer?: boolean;
  title?: string;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  error?: string;
  isLoading: boolean;
}) => {
  const [isDateBoxOpen, setIsDateBoxOpen] = useState(false);
  return (
    <div className='grid gap-3 mx-auto w-full lg:w-2/4 cursor-pointer'>
      {error === 'fail' && <FormError error={error} />}
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
        {showCustomer && (
          <select>
            <option value='' hidden>
              Select customer
            </option>
            <option value=''>customer A</option>
            <option value=''>Customer B</option>
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
