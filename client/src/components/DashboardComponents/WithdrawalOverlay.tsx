import {
  useActionData,
  useNavigation,
  useParams,
  useSubmit,
} from 'react-router-dom';
import Button from '../UI/Button';
import { useEffect } from 'react';
import { FormActionType } from '../../dtos/formAction';
import FormError from '../UI/FormError';

const WithdrawalOverlay = ({
  action,
  id,
  height,
  setAction,
}: {
  action: boolean;
  id: string;
  height: number;
  setAction: (action: boolean) => void;
}) => {
  const submit = useSubmit();
  const params = useParams();
  const actionData = useActionData() as FormActionType;
  const { state } = useNavigation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('groupRef', params.groupId as string);
    formData.append('id', id as string);

    submit(formData, { method: 'PATCH' });
  };

  useEffect(() => {
    if (actionData?.status === 'success') {
      setAction(false);
    }
  }, [actionData?.status, setAction]);

  return (
    <div
      style={{ height: `${height + 50}px` }}
      className={`absolute top-0 ${
        action ? 'left-0' : '-left-[100%]'
      } w-full bg-slate-100 dark:bg-slate-600 rounded-md transition-all duration-700 ease-in-out p-2`}
    >
      <form onSubmit={handleSubmit}>
        {actionData?.status === 'fail' && (
          <FormError error={actionData?.message} />
        )}
        <div className='w-full md:w-3/5 mx-auto mb-2 mt-1'>
          <select
            name='status'
            id={`status-${id}`}
            className='capitalize mb-2 py-1 text-sm'
          >
            <option value='' hidden>
              Select action
            </option>
            <option value='approve'>approve</option>
            <option value='reject'>reject</option>
          </select>
          <textarea
            name='comment'
            id={`comment-${id}`}
            className='resize-none dark:bg-slate-700 mb-1 py-1 text-sm'
            cols={1}
            rows={1}
            placeholder='Short comment'
          ></textarea>
          <div className='flex gap-1 flex-wrap md:flex-nowrap'>
            <Button
              btnText={state === 'submitting' ? 'saving' : 'save'}
              btnType='submit'
              className='py-1.5 text-sm'
            />
            <Button
              btnText='cancel'
              btnType='button'
              className='py-1.5 text-sm'
              onTrigger={() => setAction(false)}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default WithdrawalOverlay;
