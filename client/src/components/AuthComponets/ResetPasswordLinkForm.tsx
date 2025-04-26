import { Form } from 'react-router-dom';
import Button from '../UI/Button';
import logo from '../../assets/logo-no-bg.png';

const ResetPasswordLinkForm = () => {
  return (
    <>
      <section className='mt-30'>
        <Form className='lg:w-1/2 mx-auto border-1 border-primary-500 pb-3 rounded-md'>
          <div className='w-full h-20 flex justify-center border-b-2 border-b-amber-500 mb-2 dark:bg-green-200 rounded-md'>
            <img src={logo} alt='Brand logo' className='max-w-full h-full' />
          </div>

          <div className='px-3'>
            {/* Email group */}
            <div className='mb-2'>
              <label htmlFor='email'>email</label>
              <input type='email' id='email' name='email' autoComplete='off' />
            </div>

            {/* Login submit button. */}
            <Button btnText='reset password link' btnType='submit' />
          </div>
        </Form>
      </section>
    </>
  );
};

export default ResetPasswordLinkForm;
