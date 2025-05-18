/* eslint-disable react-refresh/only-export-components */
import {
  ActionFunctionArgs,
  Link,
  redirect,
  useActionData,
  useLocation,
  useSearchParams,
  useSubmit,
} from 'react-router-dom';
import Button from '../../components/UI/Button';
import { extractFormData, postData } from '../../helperFunc.ts/apiRequest';

const JoinGroup = () => {
  const data = useActionData();
  const path = useLocation();
  const groupName = path.pathname.split('/').at(-1)?.split('-').join(' ');
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams);
  const submit = useSubmit();

  const handleJoin = () => {
    const formData = new FormData();
    formData.append('group', params.group);
    formData.append('join', params.join);
    submit(formData, { method: 'POST' });
  };

  return (
    <section>
      <article className='bg-gray-100 dark:bg-slate-700  dark:text-slate-50 p-3 shadow mt-6 mb-4 flex flex-col justify-center items-center font-500 h-auto text-center'>
        {data?.status === 'fail' && (
          <div className='bg-amber-600 p-2 rounded-lg mb-4'>
            <p>{data?.message}. Please login or sign up to join the group.</p>
          </div>
        )}
        <h3 className='text-center mb-5'>
          Thank you for showing interest in joining{' '}
          <span className='capitalize font-600 underline text-[20px] text-green-800 dark:text-green-500'>
            {groupName}
          </span>
        </h3>
        <p className='text-[15px] mb-4'>
          Please, click the join button below to join
        </p>
        <p className='text-[15px]'>
          You will be required to{' '}
          <span className='underline font-600 text-amber-600'>
            <Link to='/login'>logged in</Link>
          </span>
          &nbsp; or &nbsp;
          <span className='underline font-600 text-amber-600'>
            <Link to='/signup'>signup</Link>
          </span>
          &nbsp;to join a group.
        </p>
        <div className='mt-6' onClick={handleJoin}>
          <Button btnText={`Join ${groupName}`} btnType='button' />
        </div>
      </article>
    </section>
  );
};

export default JoinGroup;

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await extractFormData(request);

  const resp = await postData({
    url: `/groups/join`,
    data,
  });

  if (resp.status === 'success') {
    return redirect('/account/manage-group');
  }

  return resp;
};
