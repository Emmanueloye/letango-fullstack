import { Form, useActionData, useOutletContext } from 'react-router-dom';
import Button from '../UI/Button';
import Title from '../UI/Title';
import { User } from '../../dtos/UserDto';
import { FormActionType } from '../../dtos/formAction';
import FormError from '../UI/FormError';

const ContributeForm = () => {
  const user = useOutletContext() as User;
  const data = useActionData() as FormActionType;

  return (
    <section>
      <Title title='Contribution Details' />
      <Form method='post' id='contributionForm' className='lg:w-3/5 lg:mx-auto'>
        {data?.status === 'fail' && <FormError error={data?.message} />}
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
          {/* contribution */}
          <div className='mb-2'>
            <label
              htmlFor='address'
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

export default ContributeForm;
