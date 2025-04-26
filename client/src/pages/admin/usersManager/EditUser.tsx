import { Form } from 'react-router-dom';
import LinkBtn from '../../../components/UI/LinkBtn';
import Title from '../../../components/UI/Title';
import Button from '../../../components/UI/Button';

const EditUser = () => {
  return (
    <section>
      <div className='flex justify-end mb-2'>
        <LinkBtn btnText='back' url='/account/admin/user-manager' />
      </div>
      <Title title='update users' />

      <Form id='updateUserForm'>
        <div className='lg:grid lg:grid-cols-2 gap-4'>
          <div className='w-full mb-4 lg:mb-0'>
            <label htmlFor='surname'>surname</label>
            <input id='surname' name='surname' autoComplete='off' />
          </div>
          <div className='w-full mb-4 lg:mb-0'>
            <label htmlFor='otherNames'>other names</label>
            <input id='otherNames' name='otherNames' autoComplete='off' />
          </div>
          <div className='w-full mb-4 lg:mb-0'>
            <label htmlFor='email'>email</label>
            <input id='email' name='email' autoComplete='off' />
          </div>
          <div className='w-full mb-4 lg:mb-0'>
            <label htmlFor='phone'>phone</label>
            <input id='phone' name='phone' autoComplete='off' />
          </div>
          <div className='w-full mb-4 lg:mb-0'>
            <label htmlFor='userStatus'>user status</label>
            <select id='userStatus' className=' capitalize'>
              <option value=''>suspend</option>
              <option value=''>banned</option>
              <option value=''>active</option>
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

export default EditUser;
