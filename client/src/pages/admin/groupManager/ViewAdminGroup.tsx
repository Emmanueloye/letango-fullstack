import LinkBtn from '../../../components/UI/LinkBtn';
import Title from '../../../components/UI/Title';

const ViewAdminGroup = () => {
  return (
    <section>
      <div className='flex justify-end mb-2'>
        <LinkBtn btnText='back' url='/account/admin/group-manager' />
      </div>
      <Title title='view group details' />

      <div className='lg:grid lg:grid-cols-2 gap-4'>
        <div className='w-full mb-4 lg:mb-0'>
          <label htmlFor='groupName'>group name</label>
          <input
            type='text'
            id='groupName'
            name='groupName'
            defaultValue={''}
            autoComplete='off'
            disabled
          />
        </div>
        <div className='w-full mb-4 lg:mb-0'>
          <label htmlFor='groupType'>group type</label>
          <input
            type='text'
            id='groupType'
            name='groupType'
            defaultValue={''}
            autoComplete='off'
            disabled
          />
        </div>
        <div className='w-full mb-4 lg:mb-0'>
          <label htmlFor='groupObjective'>Purpose of Group</label>
          <input
            type='text'
            id='groupObjective'
            name='groupObjective'
            defaultValue={''}
            autoComplete='off'
            disabled
          />
        </div>
        <div className='w-full mb-4 lg:mb-0'>
          <label htmlFor='group logo'>group logo</label>
          <input
            type='file'
            id='group logo'
            name='group logo'
            autoComplete='off'
            className='p-0'
            disabled
          />
        </div>
      </div>
      <div className='w-full mt-4 lg:mb-0'>
        <label htmlFor='description'>group description</label>
        <textarea
          name='description'
          id='description'
          defaultValue={''}
          cols={10}
          rows={5}
          className='resize-y'
          disabled
        ></textarea>
      </div>
    </section>
  );
};

export default ViewAdminGroup;
