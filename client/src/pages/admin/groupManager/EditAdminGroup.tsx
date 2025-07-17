/* eslint-disable react-refresh/only-export-components */
import {
  ActionFunctionArgs,
  Form,
  LoaderFunctionArgs,
  redirect,
  useParams,
} from 'react-router-dom';
import LinkBtn from '../../../components/UI/LinkBtn';
import Title from '../../../components/UI/Title';
import Button from '../../../components/UI/Button';
import {
  fetchOnlyData,
  getData,
  patchData,
  queryClient,
} from '../../../helperFunc.ts/apiRequest';
import { useQuery } from '@tanstack/react-query';

const EditAdminGroup = () => {
  const params = useParams();

  const { data } = useQuery({
    queryKey: ['fetchGroup', 'group', params?.id],
    queryFn: () =>
      getData({
        url: `/groups/admin/${params?.id}`,
      }),
  });

  const groupType = [
    'Peer Contribution',
    'Association',
    'Club',
    'Crowd funding',
  ];

  const groupPurpose = [
    'Group contribution',
    'Community portfolio',
    'Special project',
    'Fund raising',
  ];

  return (
    <section>
      <div className='flex justify-end mb-2'>
        <LinkBtn btnText='back' url='/account/admin/group-manager' />
      </div>
      <Title title='update group' />

      <Form id='updateGroupForm' method='patch' encType='multipart/form-data'>
        <div className='lg:grid lg:grid-cols-2 gap-4'>
          <div className='w-full mb-4 lg:mb-0'>
            <label htmlFor='groupName'>group name</label>
            <input
              type='text'
              id='groupName'
              name='groupName'
              defaultValue={data?.group?.groupName}
              autoComplete='off'
              className='capitalize'
            />
          </div>
          <div className='w-full mb-4 lg:mb-0'>
            <label htmlFor='groupType'>group type</label>
            <select name='groupType' id='groupType'>
              <option value={data?.group?.groupType}>
                {data?.group?.groupType}
              </option>
              {groupType
                .filter(
                  (item) =>
                    item.toLowerCase() !== data?.group?.groupType.toLowerCase()
                )
                ?.map((el) => (
                  <option value={el}>{el}</option>
                ))}
            </select>
          </div>
          <div className='w-full mb-4 lg:mb-0'>
            <label htmlFor='groupPurpose'>Purpose of Group</label>
            <select name='groupPurpose' id='groupPurpose'>
              <option value={data?.group?.groupPurpose}>
                {data?.group?.groupPurpose}
              </option>
              {groupPurpose
                ?.filter(
                  (el) =>
                    el.toLowerCase() !== data?.group?.groupPurpose.toLowerCase()
                )
                .map((item) => (
                  <option value={item}>{item}</option>
                ))}
            </select>
          </div>
          <div className='w-full mb-4 lg:mb-0'>
            <label htmlFor='group logo'>group logo</label>
            <input
              type='file'
              id='group logo'
              name='photo'
              autoComplete='off'
              className='p-0'
            />
          </div>
        </div>
        <div className='w-full mt-4 lg:mb-0'>
          <label htmlFor='groupDescription'>group description</label>
          <textarea
            name='groupDescription'
            id='groupDescription'
            defaultValue={data?.group?.groupDescription}
            cols={10}
            rows={5}
            className='resize-y'
          ></textarea>
        </div>
        <div className='mt-3'>
          <Button btnText='save' btnType='submit' />
        </div>
      </Form>
    </section>
  );
};

export default EditAdminGroup;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  await queryClient.ensureQueryData({
    queryKey: ['fetchGroup', 'group', params?.id],
    queryFn: () =>
      getData({
        url: `/groups/admin/${params?.id}`,
      }),
  });

  const resp = await queryClient.ensureQueryData({
    queryKey: ['user'],
    queryFn: () => fetchOnlyData({ url: '/users/me' }),
  });

  const roles = ['super-admin', 'admin'];

  if (resp?.user && !roles.includes(resp?.user?.role)) {
    return redirect('/login');
  }

  return null;
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const data = await request.formData();
  return patchData({
    url: `/groups/admin/${params.id}`,
    data,
    invalidate: ['fetchGroupMember', 'fetchGroup', 'fetchAllGroup'],
    redirectTo: '/account/admin/group-manager',
    setToast: true,
  });
};
