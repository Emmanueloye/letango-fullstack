import { Form, Link, useNavigation } from 'react-router-dom';
import Button from '../UI/Button';
import logo from '../../assets/logo-no-bg.png';
import FormError from '../UI/FormError';
import { useAppSelector } from '../../Actions/store';

const LoginForm = ({ error }: { error?: string }) => {
  const { message } = useAppSelector((state) => state.auth);
  const { passwordMessage } = useAppSelector((state) => state.auth);
  const { state } = useNavigation();
  return (
    <>
      <section className='mt-30'>
        <div className='text-center'>
          {message && <FormError error={message} />}
          {passwordMessage && <FormError error={passwordMessage} />}
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
            {/* Password group */}
            <div className='mb-2'>
              <label htmlFor='password'>password</label>
              <input
                type='password'
                id='password'
                name='password'
                autoComplete='off'
              />
            </div>
            {/* Login footer note */}
            <div className='text-sm mb-2 dark:text-slate-50'>
              <span>Don't have an account? </span>
              <Link to='/signup' className='underline'>
                Create an account here.
              </Link>
            </div>
            <div className='text-sm mb-2 dark:text-slate-50'>
              <span>Forget password? </span>
              <Link to='/forget-password' className='underline'>
                Reset password here.
              </Link>
            </div>
            {/* Login submit button. */}
            <Button
              btnText={state === 'submitting' ? 'Logging in' : 'Login'}
              btnType='submit'
              disabled={state === 'submitting'}
            />
          </div>
        </Form>
      </section>
    </>
  );
};

export default LoginForm;
