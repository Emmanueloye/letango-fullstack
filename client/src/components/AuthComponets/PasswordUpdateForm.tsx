import Button from '../UI/Button';
import { Form } from 'react-router-dom';

const PasswordUpdateForm = () => {
  return (
    <article className='w-11/12 bg-gray-100 dark:bg-slate-800 container mx-auto lg:py-2 px-3 shadow-lg'>
      {/* Header */}
      <h3 className='border-b-2 py-4 mb-8 font-600 uppercase text-center border-b-green-500'>
        Update Password
      </h3>
      <Form id='form'>
        {/* current password group */}
        <div className='mb-2'>
          <label
            htmlFor='currentPassword'
            className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
          >
            current password
          </label>
          <input
            type='password'
            id='currentPassword'
            name='currentPassword'
            autoComplete='off'
          />
        </div>
        {/* Other names group */}
        <div className='mb-2'>
          <label
            htmlFor='password'
            className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
          >
            new password
          </label>
          <input
            type='password'
            id='password'
            name='password'
            autoComplete='off'
          />
        </div>
        {/* Email group */}
        <div className='mb-2'>
          <label
            htmlFor='confirmPassowrd'
            className={`after:text-red-500 after:content-['*'] after:font-700 text-sm `}
          >
            confirm Passowrd
          </label>
          <input
            type='password'
            id='confirmPassowrd'
            name='confirmPassowrd'
            autoComplete='off'
          />
        </div>

        <Button btnText='Save' btnType='submit' />
      </Form>
    </article>
  );
};

export default PasswordUpdateForm;
