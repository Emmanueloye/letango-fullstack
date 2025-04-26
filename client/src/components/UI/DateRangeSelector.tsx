import { FaCalendarAlt } from 'react-icons/fa';
import { Form } from 'react-router-dom';
import Button from './Button';
import { useState } from 'react';

const DateRangeSelector = ({
  showCustomer = false,
  title = 'Date range',
}: {
  showCustomer?: boolean;
  title?: string;
}) => {
  const [isDateBoxOpen, setIsDateBoxOpen] = useState(false);
  return (
    <div className='grid gap-3 mx-auto w-full lg:w-2/4 cursor-pointer'>
      <div
        className='flex justify-between items-center flex-wrap font-500 border p-2 rounded-md'
        onClick={() => setIsDateBoxOpen(!isDateBoxOpen)}
      >
        <h2 className='capitalize'>{title}</h2>
        <FaCalendarAlt />
      </div>
      <Form className={isDateBoxOpen ? 'grid gap-1.5' : 'hidden'}>
        {showCustomer && (
          <select>
            <option value='' hidden>
              Select customer
            </option>
            <option value=''>customer A</option>
            <option value=''>Customer B</option>
          </select>
        )}
        <input type='date' id='start' name='startDate' className='py-1.5' />
        <input type='date' id='start' name='startDate' className='py-1.5' />
        <Button btnText='apply' btnType='submit' />
      </Form>
    </div>
  );
};

export default DateRangeSelector;
