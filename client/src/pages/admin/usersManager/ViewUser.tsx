import LinkBtn from '../../../components/UI/LinkBtn';
import Title from '../../../components/UI/Title';

const ViewUser = () => {
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
            defaultValue={''}
          />
        </div>
        <div className='w-full mb-4 lg:mb-0'>
          <label htmlFor='otherNames'>other names</label>
          <input
            id='otherNames'
            name='otherNames'
            autoComplete='off'
            disabled
            defaultValue={''}
          />
        </div>
        <div className='w-full mb-4 lg:mb-0'>
          <label htmlFor='email'>email</label>
          <input
            id='email'
            name='email'
            autoComplete='off'
            disabled
            defaultValue={''}
          />
        </div>
        <div className='w-full mb-4 lg:mb-0'>
          <label htmlFor='phone'>phone</label>
          <input
            id='phone'
            name='phone'
            autoComplete='off'
            disabled
            defaultValue={''}
          />
        </div>
        <div className='w-full mb-4 lg:mb-0'>
          <label htmlFor='userStatus'>user status</label>
          <input
            id='userStatus'
            name='userStatus'
            autoComplete='off'
            disabled
            defaultValue={''}
          />
        </div>
      </div>
    </section>
  );
};

export default ViewUser;
