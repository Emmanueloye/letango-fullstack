import { Form } from 'react-router-dom';
import Button from '../UI/Button';
import logo from '../../assets/logo-no-bg.png';

const PasswordResetForm = () => {
  return (
    <section className='mt-30'>
      <Form className='lg:w-1/2 mx-auto border-1 border-primary-500 pb-3 rounded-md'>
        <div className='w-full h-20 flex justify-center border-b-2 border-b-amber-500 mb-2 dark:bg-green-200 rounded-md'>
          <img src={logo} alt='Brand logo' className='max-w-full h-full' />
        </div>

        <div className='px-3'>
          {/* Email group */}
          <div className='mb-2'>
            <label htmlFor='password'>new password</label>
            <input
              type='password'
              id='password'
              name='password'
              autoComplete='off'
            />
          </div>

          <div className='mb-2'>
            <label htmlFor='confirmPassword'>confirm password</label>
            <input
              type='confirmPassword'
              id='confirmPassword'
              name='confirmPassword'
              autoComplete='off'
            />
          </div>

          {/* Login submit button. */}
          <Button btnText='reset password' btnType='submit' />
        </div>
      </Form>
    </section>
  );
};

export default PasswordResetForm;
