import { MdOutlineCheck, MdOutlineContentCopy } from 'react-icons/md';

const GroupInvitationLink = ({
  showLink,
  isCopy,
  handleCopy,
  invitationLink,
}: {
  showLink: boolean;
  isCopy: boolean;
  handleCopy: () => void;
  invitationLink: string;
}) => {
  return (
    <div>
      {showLink && (
        <div className='flex items-center relative mt-3'>
          <input
            type='text'
            className='pr-8 font-poppins text-sm'
            defaultValue={invitationLink}
          />
          {!isCopy && (
            <MdOutlineContentCopy
              title='Copy'
              className='text-2xl absolute right-0 cursor-pointer'
              onClick={handleCopy}
            />
          )}
          {isCopy && (
            <MdOutlineCheck className='text-2xl text-green-600 absolute right-0' />
          )}
        </div>
      )}
    </div>
  );
};

export default GroupInvitationLink;
