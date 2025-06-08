import {
  Form,
  useActionData,
  useLoaderData,
  useParams,
} from 'react-router-dom';
import Title from '../UI/Title';
import LinkBtn from '../UI/LinkBtn';
import Button from '../UI/Button';
import { FormActionType } from '../../dtos/formAction';
import FormError from '../UI/FormError';
import { useQuery } from '@tanstack/react-query';
import { getData } from '../../helperFunc.ts/apiRequest';

const EditFundHeadForm = () => {
  const member = useLoaderData();
  const error = useActionData() as FormActionType;

  const params = useParams();

  const { data } = useQuery({
    queryKey: ['fundHead', { ...params }],
    queryFn: () =>
      getData({
        url: `/fundClasses/${params.headId}?groupRef=${params.groupId}`,
      }),
  });

  const headTypes = ['income', 'expense'];

  return (
    <section>
      {/* Back button */}
      <div className='flex justify-end mb-3'>
        <LinkBtn
          btnText='Back'
          url={`/account/manage-group/view/${params.groupId}/fund-heads`}
        />
      </div>
      {/* Title */}
      <Title title='update fund head' />
      {/* Form */}
      <Form
        method='patch'
        id='createFundHead'
        className='w-full md:w-3/5 md:mx-auto'
      >
        {/* form error */}
        {error?.status === 'fail' && <FormError error={error.message} />}
        {/* Head  form group*/}
        <div className='mb-6'>
          <label
            htmlFor='head'
            className={`after:text-red-500 after:content-['*'] after:font-700`}
          >
            fund head
          </label>
          <input
            type='text'
            id='head'
            name='head'
            autoComplete='off'
            className='capitalize'
            defaultValue={data?.fundHead?.head}
          />
        </div>
        {/* head type form group */}
        <div className='mb-6'>
          <label
            htmlFor='headType'
            className={`after:text-red-500 after:content-['*'] after:font-700`}
          >
            head type
          </label>
          <select name='headType' id='headType' className='capitalize'>
            <option value={data?.fundHead?.headType}>
              {data?.fundHead?.headType}
            </option>
            {headTypes
              .filter((item) => item !== data?.fundHead?.headType)
              .map((el) => (
                <option value={el} key={el}>
                  {el}
                </option>
              ))}
          </select>
        </div>
        {/* other hidden fields */}
        <input
          type='text'
          name='groupId'
          defaultValue={member?.groupId?._id}
          hidden
        />
        <input
          type='text'
          name='groupRef'
          defaultValue={member?.groupId?.groupRef}
          hidden
        />
        <Button btnText='submit' btnType='submit' />
      </Form>
    </section>
  );
};

export default EditFundHeadForm;
