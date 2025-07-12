/* eslint-disable react-refresh/only-export-components */
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import LinkBtn from '../../../components/UI/LinkBtn';
import Title from '../../../components/UI/Title';
import { getData, queryClient } from '../../../helperFunc.ts/apiRequest';
import { useQuery } from '@tanstack/react-query';
import { formatDate } from '../../../helperFunc.ts/utilsFunc';

const ViewUser = () => {
  const params = useLoaderData();

  const { data } = useQuery({
    queryKey: ['fetchUser', 'user'],
    queryFn: () => getData({ url: `/users/${params.id}` }),
  });

  return (
    <section>
      <div className='flex justify-end mb-2'>
        <LinkBtn btnText='back' url='/account/admin/user-manager' />
      </div>
      <Title title='view user details' />

      <div className='lg:grid lg:grid-cols-2 gap-4'>
        <div className='w-full mb-4 lg:mb-0'>
          <label htmlFor='surname'>surname</label>
          <input
            id='surname'
            name='surname'
            autoComplete='off'
            disabled
            defaultValue={data?.user?.surname}
            className='capitalize'
          />
        </div>
        <div className='w-full mb-4 lg:mb-0'>
          <label htmlFor='otherNames'>other names</label>
          <input
            id='otherNames'
            name='otherNames'
            autoComplete='off'
            disabled
            defaultValue={data?.user?.otherNames}
            className='capitalize'
          />
        </div>
        <div className='w-full mb-4 lg:mb-0'>
          <label htmlFor='email'>email</label>
          <input
            id='email'
            name='email'
            autoComplete='off'
            disabled
            defaultValue={data?.user?.email}
          />
        </div>
        <div className='w-full mb-4 lg:mb-0'>
          <label htmlFor='phone'>phone</label>
          <input
            id='phone'
            name='phone'
            autoComplete='off'
            disabled
            defaultValue={data?.user?.phone}
            className='capitalize'
          />
        </div>
        <div className='w-full mb-4 lg:mb-0'>
          <label htmlFor='userStatus'>user status</label>
          <input
            id='userStatus'
            name='userStatus'
            autoComplete='off'
            disabled
            defaultValue={data?.user?.status}
            className='capitalize'
          />
        </div>

        <div className='w-full mb-4 lg:mb-0'>
          <label htmlFor='verifiedDate'>verifiedDate</label>
          <input
            id='verifiedDate'
            name='verifiedDate'
            autoComplete='off'
            disabled
            defaultValue={
              data?.user?.verificationDate &&
              formatDate(new Date(data?.user?.verificationDate))
            }
            className='capitalize'
          />
        </div>
      </div>
    </section>
  );
};

export default ViewUser;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  await queryClient.ensureQueryData({
    queryKey: ['fetchUser', 'user'],
    queryFn: () => getData({ url: `/users/${params.id}` }),
  });
  return params;
};
