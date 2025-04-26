import { Form } from 'react-router-dom';
import LinkBtn from '../../../components/UI/LinkBtn';
import Title from '../../../components/UI/Title';
import Button from '../../../components/UI/Button';

const EditAdminGroup = () => {
  return (
    <section>
      <div className='flex justify-end mb-2'>
        <LinkBtn btnText='back' url='/account/admin/group-manager' />
      </div>
      <Title title='update group' />

      <Form id='updateGroupForm'>
        <div className='lg:grid lg:grid-cols-2 gap-4'>
          <div className='w-full mb-4 lg:mb-0'>
            <label htmlFor='groupName'>group name</label>
            <input
              type='text'
              id='groupName'
              name='groupName'
              defaultValue={''}
              autoComplete='off'
            />
          </div>
          <div className='w-full mb-4 lg:mb-0'>
            <label htmlFor='groupType'>group type</label>
            <select name='groupType' id='groupType'>
              <option value='' hidden>
                Select group type
              </option>
              <option value=''>Peer contribution</option>
              <option value=''>Association</option>
              <option value=''>Club</option>
              <option value=''>Crowd funding</option>
            </select>
          </div>
          <div className='w-full mb-4 lg:mb-0'>
            <label htmlFor='groupObjective'>Purpose of Group</label>
            <select name='groupType' id='groupType'>
              <option value='' hidden>
                Select group purpose
              </option>
              <option value=''>Personal contribution</option>
              <option value=''>Group contribution</option>
              <option value=''>Community portfolio</option>
              <option value=''>Special project</option>
              <option value=''>Fund raising</option>
            </select>
          </div>
          <div className='w-full mb-4 lg:mb-0'>
            <label htmlFor='group logo'>group logo</label>
            <input
              type='file'
              id='group logo'
              name='group logo'
              autoComplete='off'
              className='p-0'
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
