import { useSearchParams } from 'react-router-dom';
import LinkBtn from '../../components/UI/LinkBtn';
import { useEffect, useState } from 'react';
import { postData } from '../../helperFunc.ts/apiRequest';
import { FormActionType } from '../../dtos/formAction';
import FormError from '../../components/UI/FormError';

const VerifyEmail = () => {
  const [verifyMsg, setVerifyMsg] = useState<FormActionType>({
    status: '',
    message: '',
  });

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const sendEmailVerification = async () => {
      try {
        const data = Object.fromEntries(searchParams);

        // set http request
        const result = await postData({
          url: '/auth/verify-email',
          data,
        });

        // set verify message
        setVerifyMsg(result);
      } catch (error) {
        setVerifyMsg(error as { status: string; message: string });
      }
    };

    sendEmailVerification();
  }, [searchParams]);

  return (
    <section>
      <div className='flex justify-center items-center flex-col min-h-52'>
        {/* if status is fail, show this */}
        {verifyMsg.status === 'fail' ? (
          <p className='dark:text-slate-50 mb-4'>
            <FormError error={verifyMsg?.message} />
          </p>
        ) : (
          // otherwise show this
          <p className='dark:text-slate-50 mb-4'>{verifyMsg?.message}</p>
        )}
        <div className='flex justify-center'>
          {/* Only show login button when verification is successful. */}
          {verifyMsg.status === 'success' && (
            <LinkBtn btnText='Login' url='/login' />
          )}
        </div>
      </div>
    </section>
  );
};

export default VerifyEmail;
