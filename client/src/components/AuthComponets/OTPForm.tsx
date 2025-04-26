import { Form, useNavigation } from 'react-router-dom';
import Button from '../UI/Button';
import logo from '../../assets/logo-no-bg.png';
import { useAppSelector } from '../../Actions/store';
import FormError from '../UI/FormError';

const OTPForm = ({ error }: { error?: string }) => {
  const { verifyMessage } = useAppSelector((state) => state.auth);
  const { state } = useNavigation();
  return (
    <>
      <section className='mt-30'>
        <div className='text-center'>
          {verifyMessage && <FormError error={verifyMessage} />}
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
              <label htmlFor='loginOTP'>OTP</label>
              <input
                type='loginOTP'
                id='loginOTP'
                name='loginOTP'
                autoComplete='off'
              />
            </div>

            {/* Login submit button. */}
            <Button
              btnText={
                state === 'submitting' ? 'authenticating' : 'authenticate'
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

export default OTPForm;
