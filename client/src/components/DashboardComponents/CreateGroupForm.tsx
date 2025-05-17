import { Form, useActionData } from 'react-router-dom';
import Button from '../UI/Button';
import Title from '../UI/Title';
import FormError from '../UI/FormError';

const CreateGroupForm = () => {
  const error = useActionData();
  return (
    <div className='w-full lg:w-4/5 lg:mx-auto bg-gray-100 dark:bg-slate-800 p-2.5 lg:p-4 rounded-lg'>
      {/* Form title */}
      <Title title='create new group' />
      <Form id='createGroup' method='post' encType='multipart/form-data'>
        {error?.status === 'fail' && <FormError error={error.message} />}
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
            <option value='Peer contribution'>Peer contribution</option>
            <option value='Association'>Association</option>
            <option value='Club'>Club</option>
            <option value='Crowd funding'>Crowd funding</option>
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
            <option value='' hidden>
              Select group purpose
            </option>
            <option value='Group contribution'>Group contribution</option>
            <option value='Community portfolio'>Community portfolio</option>
            <option value='Special project'>Special project</option>
            <option value='Fund raising'>Fund raising</option>
          </select>
        </div>
        {/* Group logo */}
        <div className='mb-6'>
          <label htmlFor='photo'>Group logo</label>

          <input type='file' name='photo' id='photo' />
        </div>
        {/* Group description input */}
        <div className='mb-6'>
          <label
            htmlFor='description'
            className={`after:text-red-500 after:content-['*'] after:font-700`}
          >
            Group description
          </label>

          <textarea name='groupDescription' id='description'></textarea>
        </div>
        <Button btnText='create group' btnType='submit' />
      </Form>
    </div>
  );
};

export default CreateGroupForm;
