import { Form, useActionData } from 'react-router-dom';
import Button from '../UI/Button';
import Title from '../UI/Title';
import LinkBtn from '../UI/LinkBtn';
import { User } from '../../dtos/UserDto';
import { FormActionType } from '../../dtos/formAction';
import FormError from '../UI/FormError';

const AdminEditUser = ({ user }: { user: User }) => {
  const data = useActionData() as FormActionType;
  const status = ['active', 'suspend', 'banned'];

  console.log(user);

  return (
    <section>
      <div className='flex justify-end mb-2'>
        <LinkBtn btnText='back' url='/account/admin/user-manager' />
      </div>
      <Title title='update users' />

      <Form id='updateUserForm' method='patch'>
        {data?.status === 'fail' && <FormError error={data?.message} />}
        <div className='lg:grid lg:grid-cols-2 gap-4'>
          <div className='w-full mb-4 lg:mb-0'>
            <label htmlFor='surname'>surname</label>
            <input
              id='surname'
              name='surname'
              autoComplete='off'
              defaultValue={user?.surname}
              className='capitalize'
            />
          </div>
          <div className='w-full mb-4 lg:mb-0'>
            <label htmlFor='otherNames'>other names</label>
            <input
              id='otherNames'
              name='otherNames'
              autoComplete='off'
              defaultValue={user?.otherNames}
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
              defaultValue={user?.email}
            />
          </div>
          <div className='w-full mb-4 lg:mb-0'>
            <label htmlFor='phone'>phone</label>
            <input
              id='phone'
              name='phone'
              autoComplete='off'
              defaultValue={user?.phone}
              className='capitalize'
            />
          </div>
          <div className='w-full mb-4 lg:mb-0'>
            <label htmlFor='userStatus'>user status</label>
            <select id='userStatus' name='status' className=' capitalize'>
              <option value={user?.status}>{user?.status}</option>
              {status
                .filter((item) => item !== user?.status)
                .map((el) => (
                  <option value={el} key={el}>
                    {el}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className='mt-3'>
          <Button btnText='save' btnType='submit' />
        </div>
      </Form>
    </section>
  );
};

export default AdminEditUser;
