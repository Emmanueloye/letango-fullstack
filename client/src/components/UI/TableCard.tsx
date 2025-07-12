import TableAction from './TableAction';

const TableCard = ({
  children,
  className,
  showAction,
  editUrl,
  viewUrl,
  userStatus,
  showUserAction = true,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  showAction?: boolean;
  editUrl?: string;
  viewUrl?: string;
  userStatus?: string;
  showUserAction?: boolean;
  id?: string;
}) => {
  return (
    <div className='dark:bg-slate-800 shadow-md py-2 px-4 mb-2 rounded-2xl'>
      <div
        className={`flex justify-between flex-wrap gap-2 bg-grey-100  text-center text-sm mb-3 ${className}`}
      >
        {children}
      </div>
      {showAction && (
        <TableAction
          editUrl={editUrl || ''}
          viewUrl={viewUrl || ''}
          showUserAction={showUserAction}
          className='border-0 border-t-1 justify-between pt-2 flex-wrap'
          userStatus={userStatus}
          id={id as string}
        />
      )}
    </div>
  );
};

export default TableCard;
