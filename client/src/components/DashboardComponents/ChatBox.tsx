import { useRef, useState } from 'react';
import { FaCheck, FaPenAlt, FaThumbsUp, FaTimes } from 'react-icons/fa';
import { IChat } from '../../dtos/groupDto';
import avater from '../../assets/userjpg.jpg';
import { useOutletContext } from 'react-router-dom';
import { User } from '../../dtos/UserDto';
import { patchData } from '../../helperFunc.ts/apiRequest';
import { MAXWORD } from '../../Actions/constant';

const ChatBox = ({
  bgColor,
  ml,
  chatMsg,
  showFooter = true,
  handleInput,
}: {
  bgColor: string;
  ml?: string;
  chatMsg: IChat;
  showFooter?: boolean;
  handleInput: () => void;
}) => {
  const user = useOutletContext() as User;
  const messageRef = useRef<HTMLParagraphElement>(null);
  const [isEdited, setIsEdited] = useState(false);
  const [editedMessage, setEditedMessage] = useState(chatMsg?.content);

  const handleClick = async (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    if (e.currentTarget?.id === 'like') {
      await patchData({
        url: `/chats/${chatMsg?._id}`,
        data: { like: 1 },
        invalidate: ['fetchChat'],
      });
    }
  };

  const name =
    chatMsg?.senderName.length > 18
      ? `${chatMsg?.senderName.split(' ')[0]} ${chatMsg?.senderName
          .split(' ')[1]
          .charAt(0)}`
      : chatMsg?.senderName;

  const photo = chatMsg?.sender === user?._id && user.photo; //to be improved.

  const handleChatChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const word = e.target.value;
    if (word.length <= MAXWORD) {
      setEditedMessage(e.target.value);
    }
  };

  const handleEditSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    await patchData({
      url: `/chats/${chatMsg?._id}`,
      data: { content: editedMessage },
      invalidate: ['fetchChat'],
    });

    setIsEdited(false);
  };

  const handleCancel = () => {
    setIsEdited(false);
    setEditedMessage(chatMsg?.content);
  };

  return (
    <>
      {!isEdited ? (
        <div
          className={`${bgColor} ${ml}  dark:text-primary-500 px-4 py-2 mb-1 rounded-2xl text-[14px] font-500 shadow`}
        >
          <div className='flex items-center gap-3 flex-wrap'>
            <img
              src={photo || avater}
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
              <div className='flex gap-1 font-poppins text-[16px] cursor-pointer'>
                <FaThumbsUp id='like' onClick={handleClick} />
                <span className='text-sm'>
                  {chatMsg?.likesCount && chatMsg?.likesCount > 0
                    ? chatMsg?.likesCount
                    : 0}
                </span>
              </div>

              {chatMsg?.sender === user._id && (
                <FaPenAlt
                  className='text-[16px]'
                  onClick={() => setIsEdited(true)}
                />
              )}
            </div>
          )}
        </div>
      ) : (
        <div id='chatForm' className='relative mb-2'>
          <small className='text-amber-600 font-600'>
            Word limit: {MAXWORD}. Remaining words:
            {MAXWORD - editedMessage.length}
          </small>
          <textarea
            rows={3}
            name='chat'
            id='message'
            placeholder='Type your message here...'
            className='placeholder:text-sm mb-2 resize-none overflow-hidden text-sm'
            onInput={handleInput}
            value={editedMessage}
            onChange={handleChatChange}
          ></textarea>
          <div className='flex gap-3 absolute bottom-0 right-2'>
            <button type='button' onClick={handleCancel}>
              <FaTimes className='text-2xl text-rose-500 cursor-pointer' />
            </button>
            <button type='submit' onClick={handleEditSubmit}>
              <FaCheck className='text-2xl text-green-600 cursor-pointer' />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBox;
