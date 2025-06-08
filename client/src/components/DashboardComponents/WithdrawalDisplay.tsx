import { useOutletContext } from 'react-router-dom';
import { Approval, Withdrawal } from '../../dtos/paymentDto';
import { User } from '../../dtos/UserDto';

const WithdrawalDisplay = ({
  approvals,
  setAction,
  setDetails,
  transaction,
}: {
  approvals: Approval[];
  setAction: (action: boolean) => void;
  setDetails: (action: boolean) => void;
  transaction?: Withdrawal;
}) => {
  // Get currently logged in user passed into the outlet in the layout
  const user = useOutletContext() as User;

  // Find the current user approval
  const currentUserApproval = approvals.find(
    (item) => item.userId._id === user._id
  );

  const rejectedApproval = approvals?.find((item) => item.status === 'reject');

  const rejectComment =
    rejectedApproval && rejectedApproval!.comment!.length > 16
      ? `${rejectedApproval?.comment?.substring(0, 16)}...`
      : rejectedApproval?.comment;

  return (
    <>
      <div
        className={`flex justify-between items-center gap-3 flex-wrap border-t-1 text-sm pt-2`}
      >
        {/* approval label box */}
        <div>
          <span className='capitalize'>approvals: </span>
          {approvals?.length > 0 ? (
            <div className='text-sm font-500 flex gap-3 flex-wrap'>
              {approvals?.map((item, index) => {
                let approvalStatus;
                if (item?.status === 'pending') {
                  approvalStatus = <span className='text-amber-600'>...</span>;
                }

                if (item?.status === 'approve') {
                  approvalStatus = <span className='text-green-600'>✔</span>;
                }

                if (item?.status === 'reject') {
                  approvalStatus = (
                    <span className='text-green-600 text-sm'>❌</span>
                  );
                }

                return (
                  <span
                    key={index}
                    className='capitalize'
                    title={`${item?.userId?.surname?.toUpperCase()} ${item?.userId?.otherNames?.toUpperCase()}`}
                  >
                    {item?.userId?.surname}{' '}
                    {item?.userId?.otherNames?.split(' ')[0].charAt(0)}
                    {approvalStatus}
                  </span>
                );
              })}
            </div>
          ) : (
            <span>System</span>
          )}
        </div>
        {/*approval box  */}
        {approvals && (
          <div className='flex flex-col gap-2'>
            <span
              onClick={() => setDetails(true)}
              className='capitalize text-[13px] text-slate-50 cursor-pointer bg-amber-600 py-1 px-5 rounded-full font-600'
            >
              details
            </span>
            {currentUserApproval?.status === 'pending' && (
              <span
                onClick={() => setAction(true)}
                className='capitalize text-[13px] text-slate-50 cursor-pointer bg-amber-600 py-1 px-5 rounded-full font-600'
              >
                action
              </span>
            )}
          </div>
        )}
      </div>
      {transaction?.approvalStatus === 'reject' && (
        <div className='mt-2'>
          <span className={`text-sm font-500 break-words`}>status: </span>
          <span className={`text-sm font-300 text-rose-500 break-words`}>
            rejected -
          </span>
          <span
            className={`text-sm font-300 text-rose-500 break-words`}
            title={rejectedApproval?.comment}
          >
            {rejectComment}
          </span>
        </div>
      )}
    </>
  );
};

export default WithdrawalDisplay;
