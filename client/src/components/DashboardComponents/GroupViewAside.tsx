import { FaTimesCircle } from 'react-icons/fa';
import ChatBox from './ChatBox';
import { useEffect, useRef, useState } from 'react';
import { IChat } from '../../dtos/groupDto';
import {
  fetchOnlyData,
  postData,
  queryClient,
} from '../../helperFunc.ts/apiRequest';
import { User } from '../../dtos/UserDto';
import { useOutletContext, useParams } from 'react-router-dom';
import Button from '../UI/Button';
import Empty from '../UI/Empty';
import { socket } from '../../helperFunc.ts/socketIo';

const GroupViewAside = ({
  groupId,
  showChat,
  setShowChat,
  mainHeight,
}: {
  showChat: boolean;
  setShowChat: (data: boolean) => void;
  groupId: string;
  mainHeight: number | undefined | null;
}) => {
  const user = useOutletContext() as User;
  const [chats, setChats] = useState<IChat[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLElement>(null);

  const pageParams = useParams();

  // Connect to group
  useEffect(() => {
    if (!socket) return;
    socket.emit('joinGroup', pageParams.groupId);
  }, [pageParams.groupId]);

  // Function to get chat
  useEffect(() => {
    setIsLoading(true);
    const fetchChats = async () => {
      const resp = await queryClient.fetchQuery({
        queryKey: ['fetchChat', pageParams.groupId],
        queryFn: () =>
          fetchOnlyData({
            url: `/chats?sort=-createdAt`,
            params: { groupRef: pageParams.groupId },
          }),
      });

      setChats(resp?.chats);
      if (resp?.status === 'success') {
        setIsLoading(false);
      }
    };

    fetchChats();

    socket.on('receivedChat', (chat) => {
      setChats((prevChats) => [chat, ...prevChats]);
    });

    // Get updated data back and replace it in the existing chat list
    socket.on('updatedChat', (updatedChat) => {
      setChats((prevChats) => {
        // Get the index of the updated chat
        const index = prevChats.findIndex(
          (item) => item._id === updatedChat._id
        );

        // checks that the object was found in the array, then replace existing on with the updatedChat
        if (index !== -1) {
          prevChats[index] = updatedChat;
        }

        return [...prevChats];
      });
    });

    return () => {
      socket.off('receivedChat');
    };
  }, [pageParams.groupId]);

  // Function to send chat to the server
  const sendChatHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const message = formData.get('chat') as string;
    if (message) {
      const data = {
        groupId,
        groupRef: pageParams.groupId as string,
        content: message,
        sender: user?._id,
        senderName: `${user?.surname} ${user?.otherNames}`,
      };

      e.currentTarget.reset();
      queryClient.invalidateQueries({ queryKey: ['fetchChat'] });
      await postData({
        url: '/chats',
        data,
      });
    }
  };

  // Function to expand chat input
  const handleInput = () => {
    const textarea = textAreaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  };

  return (
    <aside
      ref={formRef}
      className={`bg-gray-100 dark:bg-slate-800 basis-full w-full lg:basis-2/5 absolute ${
        showChat ? 'block' : 'hidden'
      } lg:block top-0 lg:sticky lg:top-0 h-screen md:h-[${mainHeight}px] overflow-y-auto aside transition-all duration-500 ease-in-out`}
    >
      <div>
        {/* Chat text box */}

        <div className='sticky top-0 z-10 bg-gray-100 dark:bg-slate-600 p-2'>
          <div className='flex justify-between items-center border-b-2 border-green-600 mb-3'>
            <h3 className='font-600 '>Group Conversation</h3>
            <FaTimesCircle
              className='text-2xl block lg:hidden'
              onClick={() => setShowChat(false)}
            />
          </div>
          <form id='chatForm' className='relative' onSubmit={sendChatHandler}>
            <textarea
              rows={1}
              name='chat'
              id='message'
              placeholder='Type your message here...'
              className='placeholder:text-sm mb-2 resize-none overflow-hidden'
              ref={textAreaRef}
              onInput={handleInput}
            ></textarea>
            <Button btnText='send' btnType='submit' />
          </form>
        </div>
        <div>
          {/* Chat card */}
          {chats.length > 0 ? (
            <article className='p-2'>
              {chats.map((item) => {
                if (item.sender === user._id) {
                  return (
                    <ChatBox
                      key={item._id}
                      chatMsg={item}
                      bgColor='bg-slate-200 dark:bg-slate-200'
                      ml='ml-5'
                      handleInput={handleInput}
                    />
                  );
                } else {
                  return (
                    <ChatBox
                      key={item._id}
                      chatMsg={item}
                      bgColor='bg-green-200 dark:bg-green-200'
                      handleInput={handleInput}
                    />
                  );
                }
              })}
            </article>
          ) : (
            <Empty
              message={
                isLoading ? 'Loading messages...' : 'No group conversation'
              }
            />
          )}
        </div>
      </div>
    </aside>
  );
};

export default GroupViewAside;
