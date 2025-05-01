import { FaEye, FaPencilAlt } from 'react-icons/fa';
import { Link, useSubmit } from 'react-router-dom';

const TableAction = ({
  editUrl,
  viewUrl,
  showUserAction = false,
  className,
  userStatus,
  id,
}: {
  editUrl: string;
  viewUrl: string;
  showUserAction?: boolean;
  className?: string;
  id?: string;
  userStatus?: string;
}) => {
  const status = ['active', 'suspend', 'banned'];
  const submit = useSubmit();

  const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const proceed = window.confirm(
      'Are you sure you want to update the status?'
    );
    if (proceed) {
      const formData = new FormData();
      formData.append('status', e.target.value);
      formData.append('id', id as string);
      submit(formData, { method: 'PATCH' });
    }
  };
  return (
    <div
      className={`flex items-center gap-2 border border-[#d1d5dc] ${className}`}
    >
      <Link
        to={editUrl}
        className='bg-amber-600 p-2 rounded-full text-slate-50'
      >
        <FaPencilAlt />
      </Link>
      <Link
        to={viewUrl}
        className='bg-amber-600 p-2 rounded-full text-slate-50'
      >
        <FaEye />
      </Link>
      {showUserAction && (
        <select className='p-1 w-25 capitalize' onChange={handleOnChange}>
          <option value={userStatus}>{userStatus}</option>
          {status
            .filter((item) => item !== userStatus)
            .map((el) => (
              <option value={el} key={el}>
                {el}
              </option>
            ))}
        </select>
      )}
    </div>
  );
};

export default TableAction;
