import { useQuery } from '@tanstack/react-query';
import { User } from '../../dtos/UserDto';
import Button from '../UI/Button';
import LinkBtn from '../UI/LinkBtn';
import Title from '../UI/Title';
import { Form, useOutletContext, useParams } from 'react-router-dom';
import { fetchOnlyData } from '../../helperFunc.ts/apiRequest';

const GroupContributionForm = () => {
  const params = useParams();
  const user = useOutletContext() as User;

  const { data: fundClass } = useQuery({
    queryKey: ['fetchFundHead', params.groupId],
    queryFn: () =>
      fetchOnlyData({
        url: `/fundClasses?groupRef=${params.groupId}&headType=income&isActive=true`,
      }),
  });

  const { data: groupData } = useQuery({
    queryKey: ['user', params.groupId],
    queryFn: () => fetchOnlyData({ url: `/groups/${params.groupId}` }),
  });

  const fundClasses = fundClass?.fundClasses;
  const group = groupData?.group;

  const excludedFields = ['peer contribution', 'crowd funding'];

  return (
    <section>
      <div className='flex justify-end mb-3'>
        <LinkBtn
          btnText='Back'
          url={`/account/manage-group/view/${group?.groupRef}`}
        />
      </div>
      <Title title={`Group Contribution - ${group?.groupType}`} />
      <Form method='post' id='contributionForm' className='lg:w-3/5 lg:mx-auto'>
        {/* {data?.status === 'fail' && <FormError error={data?.message} />} */}
        {/* General info section */}
        {/* Fullname */}
        <div className=''>
          <div className='mb-2'>
            <label
              htmlFor='fullName'
              className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
            >
              fullName
            </label>
            <input
              type='text'
              id='fullName'
              name='fullName'
              autoComplete='off'
              defaultValue={`${user.surname} ${user.otherNames}`}
              className='capitalize'
              disabled
            />
          </div>
          {/* Email */}
          <div className='mb-2'>
            <label
              htmlFor='email'
              className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
            >
              email
            </label>
            <input
              type='text'
              id='email'
              name='email'
              autoComplete='off'
              defaultValue={user.email}
              disabled
            />
          </div>
          {/* contribution classification */}
          {!excludedFields.includes(group?.groupType?.toLowerCase()) && (
            <div className='mb-2'>
              <label
                htmlFor='contributionFor'
                className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
              >
                contribution For
              </label>
              <select
                name='fundClass'
                id='contributionFor'
                className='capitalize'
              >
                <option value='' hidden>
                  Purpose of payment
                </option>
                {fundClasses?.map((item: { _id: string; head: string }) => (
                  <option value={item._id} key={item._id}>
                    {item.head}
                  </option>
                ))}
              </select>
            </div>
          )}
          {/* contribution */}
          <div className='mb-2'>
            <label
              htmlFor='contribution'
              className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
            >
              contribution
            </label>
            <input
              type='number'
              id='contribution'
              name='contribution'
              autoComplete='off'
              className='font-poppins'
            />
          </div>
          {/* description */}
          <div className='mb-2'>
            <label
              htmlFor='description'
              className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
            >
              description
            </label>
            <input
              type='text'
              id='description'
              name='description'
              autoComplete='off'
            />
          </div>
        </div>

        <Button btnText='contribute' btnType='submit' />
      </Form>
    </section>
  );
};

export default GroupContributionForm;
