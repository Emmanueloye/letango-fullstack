import { Form, useActionData, useOutletContext } from 'react-router-dom';
import defaultUser from '../../assets/user-2935527_1280.webp';
import { useState } from 'react';
import Button from '../UI/Button';
import { FormActionType } from '../../dtos/formAction';
import FormError from '../UI/FormError';
import { User } from '../../dtos/UserDto';

const UpdateProfileForm = () => {
  const data = useActionData() as FormActionType;

  const user = useOutletContext() as User;
  const [image, setImage] = useState(user?.photo || defaultUser);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(URL.createObjectURL(file));
    }
  };
  return (
    <article className='w-11/12 bg-gray-100 dark:bg-slate-800 container mx-auto lg:py-2 px-3 shadow-lg'>
      {/* Header */}
      <h3 className='border-b-2 py-4 mb-8 font-600 uppercase text-center border-b-green-500'>
        Update Profile
      </h3>
      <Form id='form' method='patch' encType='multipart/form-data'>
        {data?.status === 'fail' && <FormError error={data.message} />}
        <div className='grid lg:grid-cols-2 gap-3'>
          {/* Surname group */}
          <div className='mb-2'>
            <label
              htmlFor='surname'
              className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
            >
              Surname
            </label>
            <input
              type='text'
              id='surname'
              name='surname'
              autoComplete='off'
              defaultValue={user?.surname}
              className='capitalize'
            />
          </div>
          {/* Other names group */}
          <div className='mb-2'>
            <label
              htmlFor='otherNames'
              className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
            >
              Other names
            </label>
            <input
              type='text'
              id='otherNames'
              name='otherNames'
              autoComplete='off'
              defaultValue={user?.otherNames}
              className='capitalize'
            />
          </div>
          {/* Email group */}
          <div className='mb-2'>
            <label
              htmlFor='email'
              className={`after:text-red-500 after:content-['*'] after:font-700 text-sm `}
            >
              email
            </label>
            <input
              type='text'
              id='email'
              name='email'
              autoComplete='off'
              disabled
              defaultValue={user?.email}
            />
          </div>
          {/* Email phone */}
          <div className='mb-2'>
            <label
              htmlFor='phone'
              className={`after:text-red-500 after:content-['*'] after:font-700 text-sm `}
            >
              phone
            </label>
            <input
              type='text'
              id='phone'
              name='phone'
              autoComplete='off'
              defaultValue={user?.phone}
              className='font-poppins'
            />
          </div>
          {/* files group */}
          <div className='mb-2'>
            <label
              htmlFor='photo'
              className={`after:text-red-500 after:content-['*'] after:font-700 text-sm `}
            >
              Profile Photo
            </label>
            <input
              type='file'
              id='photo'
              name='photo'
              autoComplete='off'
              onChange={handleImageChange}
              className='p-0.5'
            />
          </div>
          <div className='flex justify-center mb-3'>
            <img
              src={image}
              alt='User image preview'
              width={80}
              height={80}
              className='rounded-full mt-3'
            />
          </div>
        </div>

        <Button btnText='Save' btnType='submit' />
      </Form>
    </article>
  );
};

export default UpdateProfileForm;
