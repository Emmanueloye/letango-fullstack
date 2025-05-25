import { Form, useActionData, useLoaderData } from 'react-router-dom';
import Title from '../UI/Title';
import Button from '../UI/Button';
import { useQuery } from '@tanstack/react-query';
import { getData } from '../../helperFunc.ts/apiRequest';
import FormError from '../UI/FormError';

const EditGroupForm = () => {
  const action = useActionData();
  const params = useLoaderData();

  const { data } = useQuery({
    queryKey: ['fetchGroup', params.groupId],
    queryFn: () => getData({ url: `/groups/${params.groupId}` }),
  });

  const typeOptions = [
    'Peer contribution',
    'Association',
    'Club',
    'Crowd funding',
  ];
  const purposeOptions = [
    'Group contribution',
    'Community portfolio',
    'Special project',
    'Fund raising',
  ];

  return (
    <div className='w-full lg:w-4/5 lg:mx-auto bg-gray-100 dark:bg-slate-800 p-2.5 lg:p-4 rounded-lg'>
      {/* Form title */}
      <Title title='update group' />
      <Form id='updateGroup' method='patch' encType='multipart/form-data'>
        {action?.status === 'fail' && <FormError error={action?.message} />}
        {/* Group name input */}
        <div className='mb-6'>
          <label
            htmlFor='groupName'
            className={`after:text-red-500 after:content-['*'] after:font-700`}
          >
            group name
          </label>
          <input
            type='text'
            id='groupName'
            name='groupName'
            defaultValue={data?.group?.groupName}
            autoComplete='off'
            className='capitalize'
          />
        </div>
        {/* Group type input */}
        <div className='mb-6'>
          <label
            htmlFor='groupType'
            className={`after:text-red-500 after:content-['*'] after:font-700`}
          >
            group type
          </label>

          <select name='groupType' id='groupType'>
            <option value={data?.group?.groupType}>
              {data?.group?.groupType}
            </option>
            {typeOptions
              .filter(
                (item) =>
                  item.toUpperCase() !== data?.group?.groupType.toUpperCase()
              )
              .map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
          </select>
        </div>
        {/* Group purpose input */}
        <div className='mb-6'>
          <label
            htmlFor='groupPurpose'
            className={`after:text-red-500 after:content-['*'] after:font-700`}
          >
            Purpose of Group
          </label>

          <select name='groupPurpose' id='groupPurpose'>
            <option value={data?.group?.groupPurpose}>
              {data?.group?.groupPurpose}
            </option>
            {purposeOptions
              .filter(
                (item) =>
                  item.toUpperCase() !== data?.group?.groupPurpose.toUpperCase()
              )
              .map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
          </select>
        </div>
        {/* Group logo */}
        <div className='mb-6'>
          <label htmlFor='logo'>Group logo</label>

          <input type='file' id='logo' name='photo' />
        </div>
        {/* Group description input */}
        <div className='mb-6'>
          <label
            htmlFor='description'
            className={`after:text-red-500 after:content-['*'] after:font-700`}
          >
            Group description
          </label>

          <textarea
            name='description'
            id='description'
            defaultValue={data?.group?.groupDescription}
          ></textarea>
        </div>
        <Button btnText='update group' btnType='submit' />
      </Form>
    </div>
  );
};

export default EditGroupForm;
