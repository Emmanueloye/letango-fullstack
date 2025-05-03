import { FaCalendarAlt } from 'react-icons/fa';
import { Form, useActionData } from 'react-router-dom';
import Button from './Button';
import { useState } from 'react';
import { FormActionType } from '../../dtos/formAction';
import FormError from './FormError';

const DateRangeSelector = ({
  showCustomer = false,
  title = 'Date range',
}: {
  showCustomer?: boolean;
  title?: string;
}) => {
  const data = useActionData() as FormActionType;
  const [isDateBoxOpen, setIsDateBoxOpen] = useState(false);
  return (
    <div className='grid gap-3 mx-auto w-full lg:w-2/4 cursor-pointer'>
      {data?.status === 'fail' && <FormError error={data?.message} />}
      <div
        className='flex justify-between items-center flex-wrap font-500 border p-2 rounded-md'
        onClick={() => setIsDateBoxOpen(!isDateBoxOpen)}
      >
        <h2 className='capitalize'>{title}</h2>
        <FaCalendarAlt />
      </div>
      <Form
        id='dateSelector'
        method='post'
        className={isDateBoxOpen ? 'grid gap-1.5' : 'hidden'}
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
        <Button btnText='apply' btnType='submit' />
      </Form>
    </div>
  );
};

export default DateRangeSelector;
