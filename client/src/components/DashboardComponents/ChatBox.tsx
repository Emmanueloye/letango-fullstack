import { useRef } from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import { IChat } from '../../dtos/groupDto';
import avater from '../../assets/userjpg.jpg';

const ChatBox = ({
  bgColor,
  ml,
  chatMsg,
  showFooter = true,
}: {
  bgColor: string;
  ml?: string;
  chatMsg: IChat;
  showFooter?: boolean;
  //   setCurrentMsg: (data: string) => void;
}) => {
  const messageRef = useRef<HTMLParagraphElement>(null);

  const handleClick = () => {};

  const name =
    chatMsg?.senderName.length > 18
      ? `${chatMsg?.senderName.split(' ')[0]} ${chatMsg?.senderName
          .split(' ')[1]
          .charAt(0)}`
      : chatMsg?.senderName;

  return (
    <div
      className={`${bgColor} ${ml}  dark:text-primary-500 px-4 py-2 mb-1 rounded-2xl text-[14px] font-500 shadow`}
    >
      <div className='flex items-center gap-3 flex-wrap'>
        <img
          src={chatMsg?.sender?.photo || avater}
          alt='user image'
          width={30}
          height={30}
          className='rounded-full object-cover'
        />
        <p className='font-600 capitalize'>{name}</p>
      </div>
      <p className='pb-2 msgBox' ref={messageRef}>
        {chatMsg?.content}
      </p>
      {showFooter && (
        <div className='flex items-center justify-evenly gap-4 pt-3'>
          <div className='flex gap-2 font-poppins text-xs cursor-pointer'>
            <FaThumbsUp onClick={handleClick} />
            <span>
              {chatMsg?.likesCount && chatMsg?.likesCount > 0
                ? chatMsg?.likesCount
                : 0}
            </span>
          </div>
          <div className='flex gap-2 font-poppins text-xs cursor-pointer'>
            <FaThumbsUp className='rotate-180 mt-1' />
            <span>
              {chatMsg?.dislikesCount && chatMsg?.dislikesCount > 0
                ? chatMsg?.dislikesCount
                : 0}
            </span>
          </div>

          {/* <div
            className='flex gap-2 text-xs cursor-pointer replyBtn'
            // onClick={handleClick}
          >
            <FaReply className='replyBtn' />
            <span className='font-poppins replyBtn'>
              {chatMsg?.reply > 0 ? chatMsg?.reply : 0}
            </span>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default ChatBox;
