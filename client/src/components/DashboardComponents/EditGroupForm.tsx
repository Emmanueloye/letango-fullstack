import { Form } from 'react-router-dom';
import Title from '../UI/Title';
import Button from '../UI/Button';

const EditGroupForm = () => {
  return (
    <div className='w-full lg:w-4/5 lg:mx-auto bg-gray-100 dark:bg-slate-800 p-2.5 lg:p-4 rounded-lg'>
      {/* Form title */}
      <Title title='update group' />
      <Form id='updateGroup'>
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
            defaultValue={''}
            autoComplete='off'
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
            <option value='' hidden>
              Select group type
            </option>
            <option value=''>Peer contribution</option>
            <option value=''>Association</option>
            <option value=''>Club</option>
            <option value=''>Crowd funding</option>
          </select>
        </div>
        {/* Group purpose input */}
        <div className='mb-6'>
          <label
            htmlFor='groupObjective'
            className={`after:text-red-500 after:content-['*'] after:font-700`}
          >
            Purpose of Group
          </label>

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
        {/* Group logo */}
        <div className='mb-6'>
          <label
            htmlFor='logo'
            className={`after:text-red-500 after:content-['*'] after:font-700`}
          >
            Group logo
          </label>

          <input type='file' />
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
            defaultValue={''}
          ></textarea>
        </div>
        <Button btnText='update group' btnType='submit' />
      </Form>
    </div>
  );
};

export default EditGroupForm;
