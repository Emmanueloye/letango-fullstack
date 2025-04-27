import { Form, useNavigation } from 'react-router-dom';
import Button from '../UI/Button';
import logo from '../../assets/logo-no-bg.png';
import FormError from '../UI/FormError';

const ResetPasswordLinkForm = ({
  error,
  successMsg,
}: {
  error?: string;
  successMsg: string;
}) => {
  const { state } = useNavigation();
  return (
    <>
      <section className='mt-30'>
        <div className='flex justify-center'>
          {/* Error box */}
          {successMsg && <FormError error={successMsg} />}
        </div>
        <Form
          method='post'
          className='lg:w-1/2 mx-auto border-1 border-primary-500 pb-3 rounded-md'
        >
          <div className='w-full h-20 flex justify-center border-b-2 border-b-amber-500 mb-2 dark:bg-green-200 rounded-md'>
            <img src={logo} alt='Brand logo' className='max-w-full h-full' />
          </div>

          {/* Error box */}
          {error && <FormError error={error} />}

          <div className='px-3'>
            {/* Email group */}
            <div className='mb-2'>
              <label htmlFor='email'>email</label>
              <input type='email' id='email' name='email' autoComplete='off' />
            </div>

            {/* Login submit button. */}
            <Button
              btnText={
                state === 'submitting'
                  ? 'Sending reset link...'
                  : 'reset password link'
              }
              btnType='submit'
              disabled={state === 'submitting'}
            />
          </div>
        </Form>
      </section>
    </>
  );
};

export default ResetPasswordLinkForm;
