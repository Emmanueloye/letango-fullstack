/* eslint-disable react-refresh/only-export-components */
import { MdChat, MdOutlineCheck, MdOutlineContentCopy } from 'react-icons/md';
import GroupBanner from '../../components/DashboardComponents/GroupBanner';
import LinkBtn from '../../components/UI/LinkBtn';
import { useState } from 'react';
import {
  Form,
  LoaderFunctionArgs,
  redirect,
  useLoaderData,
} from 'react-router-dom';
import Button from '../../components/UI/Button';
import ChatBox from '../../components/DashboardComponents/ChatBox';
import TransactionBox from '../../components/UI/TransactionBox';
import { chatMessages } from '../../assets/tempData/chatData';
import { FaTimesCircle } from 'react-icons/fa';
import {
  fetchOnlyData,
  getData,
  queryClient,
} from '../../helperFunc.ts/apiRequest';
import { useQuery } from '@tanstack/react-query';
import { Group } from '../../dtos/groupDto';
import {
  formatDateWD,
  formatNumber,
  formatTime,
} from '../../helperFunc.ts/utilsFunc';
import { GroupTransaction } from '../../dtos/paymentDto';
import Empty from '../../components/UI/Empty';
import { toast } from 'react-toastify';

const GroupView = () => {
  const params = useLoaderData();
  const [showChat, setShowChat] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [isCopy, setIsCopy] = useState(false);

  const { data } = useQuery({
    queryKey: ['fetchGroup', params.groupId],
    queryFn: () => getData({ url: `/groups/${params.groupId}` }),
  });

  const { data: transactData } = useQuery({
    queryKey: ['fetchTransactions', params.groupId],
    queryFn: () =>
      getData({
        url: `/group-transacts?groupRef=${params.groupId}&sort=-createdAt&limit=10`,
      }),
  });

  const { data: pendingWithdrawals } = useQuery({
    queryKey: ['fetchWithdrawal', 'pending', params.groupId],
    queryFn: () =>
      getData({
        url: `/withdrawals?groupRef=${params.groupId}&approvalStatus=pending`,
      }),
  });

  const { data: currentMember } = useQuery({
    queryKey: ['fetchMember', params.groupId],
    queryFn: () => fetchOnlyData({ url: `/members/${params.groupId}` }),
  });

  const withdrawalsPending = pendingWithdrawals?.withdrawals?.reduce(
    (acc: number, curr: { contribution: number }) => acc + curr.contribution,
    0
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data?.inviteLink);

      setIsCopy(true);
      setTimeout(() => {
        setIsCopy(false);
      }, 1000);
      toast.success('Invite link copied to clipboard');
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const transactions: GroupTransaction[] = transactData.transactions;
  const group: Group = data?.group;

  const roles = ['admin', 'owner'];

  return (
    <section>
      <div className='flex justify-end mb-3'>
        <LinkBtn btnText='Back' url='/account/manage-group' />
      </div>
      {/* Group banner */}
      <GroupBanner group={group} />
      {/* Balance & report line */}
      <div className='bg-gray-100 dark:bg-slate-800 flex justify-between items-center flex-wrap mt-0.5 p-1.5 border-b-2 border-t-2 border-green-600'>
        <div>
          <div className='font-poppins text-sm'>
            <span className='font-500'>Account Balance: </span>
            <span className='font-600 text-green-600'>
              &#8358;{formatNumber(group?.groupBalance || 0)}
            </span>
          </div>
          <div className='font-poppins text-sm'>
            <span className='font-500'>Pending withdrawal: </span>
            <span className='font-600 text-green-600'>
              &#8358;{formatNumber(withdrawalsPending || 0)}
            </span>
          </div>
          <div className='font-poppins text-sm'>
            <span className='font-500'>Effective Balance: </span>
            <span className='font-600 text-green-600'>
              &#8358;
              {formatNumber(group?.groupBalance - withdrawalsPending || 0)}
            </span>
          </div>
        </div>

        <LinkBtn btnText='report' url='/account/manage-group/view/1/reports' />
      </div>
      {/* Group link copy interface */}
      {showLink && (
        <div className='flex items-center relative mt-3'>
          <input
            type='text'
            className='pr-8 font-poppins text-sm'
            defaultValue={data?.inviteLink}
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
      {/* Group action buttons/links */}

      <div className='flex flex-wrap gap-3 mt-4 text-sm'>
        <LinkBtn
          btnText='contribute'
          url={`/account/manage-group/view/${group?.groupRef}/contribute`}
        />
        {roles.includes(currentMember?.member?.role) && (
          <LinkBtn
            btnText='withdrawal'
            url={`/account/manage-group/view/${group?.groupRef}/withdraw`}
          />
        )}
        <LinkBtn
          btnText='members'
          url={`/account/manage-group/view/${group?.groupRef}/members`}
        />
        <div onClick={() => setShowLink(!showLink)}>
          <Button btnText='invite' btnType='button' />
        </div>

        {/* <LinkBtn
          btnText='beneficiaries'
          url={`/account/manage-group/view/${group?.groupRef}/beneficiaries`}
        /> */}
        {roles.includes(currentMember?.member?.role) && (
          <LinkBtn
            btnText='approvals'
            url={`/account/manage-group/view/${group?.groupRef}/approvals`}
          />
        )}
        {roles.includes(currentMember?.member?.role) && (
          <LinkBtn
            btnText='fund class'
            url={`/account/manage-group/view/${group?.groupRef}/fund-heads`}
          />
        )}
        <LinkBtn
          btnText='My pledge'
          url={`/account/manage-group/view/${group?.groupRef}/my-pledge`}
        />
      </div>

      {/* Main body */}
      <div className='lg:flex lg:gap-3 relative mt-6'>
        <main className='lg:basis-3/5 basis-full'>
          <div className='flex justify-between flex-wrap items-center'>
            <h3 className='font-600'>Recent Transactions</h3>
            <MdChat
              className='text-primary-500 dark:text-slate-100 text-2xl cursor-pointer lg:hidden'
              title='Show chat'
              onClick={() => setShowChat(!showChat)}
            />
          </div>
          {/* Recent transactions */}
          {/* 'Osunkoya Mayowa: contribution for Jan 2025' */}
          {transactions?.length > 0 ? (
            <div>
              {transactions?.map((item) => (
                <TransactionBox
                  key={item?._id}
                  description={`${
                    item?.fromId?.surname
                      ? item?.fromId?.surname
                      : `to ${item.to} - ${item.description}`
                  } ${
                    item?.fromId?.otherNames
                      ? item?.fromId?.otherNames?.split(' ')[0]
                      : ''
                  }: ${item?.head ? item?.head : item?.description}`}
                  date={
                    item?.createdAt && formatDateWD(new Date(item?.createdAt))
                  }
                  time={
                    item?.createdAt && formatTime(new Date(item?.createdAt))
                  }
                  amount={item?.contribution}
                />
              ))}
            </div>
          ) : (
            <Empty message='No recent transaction' />
          )}
        </main>
        {/* Group chat */}
        <aside
          className={`bg-gray-100 dark:bg-slate-800 basis-full w-full lg:basis-2/5 absolute ${
            showChat ? 'block' : 'hidden'
          } lg:block top-0 lg:sticky lg:top-0 h-screen overflow-y-auto aside transition-all duration-500 ease-in-out`}
        >
          <div>
            {/* Chat text box */}

            <div className='sticky top-0 z-10 bg-gray-100 dark:bg-slate-600 p-2'>
              <div className='flex justify-between items-center border-b-2 border-green-600 mb-3'>
                <h3 className='font-600 '>Group conversation</h3>
                <FaTimesCircle
                  className='text-2xl block lg:hidden'
                  onClick={() => setShowChat(false)}
                />
              </div>
              <Form id='chatForm' className='relative'>
                <textarea
                  name='chat'
                  id='message'
                  placeholder='Type your message here...'
                  className='placeholder:text-sm mb-2 resize'
                ></textarea>
                <Button btnText='send' btnType='submit' />
              </Form>
            </div>
            {/* Chat card */}
            <article className='p-2 *:odd:ml-3'>
              {chatMessages.map((item) => {
                return (
                  <ChatBox key={item.id} chatMsg={item} bgColor='bg-gray-50' />
                );
              })}
            </article>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default GroupView;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  await queryClient.ensureQueryData({
    queryKey: ['fetchGroup', params.groupId],
    queryFn: () => getData({ url: `/groups/${params.groupId}` }),
  });

  await queryClient.ensureQueryData({
    queryKey: ['fetchWithdrawal', 'pending', params.groupId],
    queryFn: () =>
      fetchOnlyData({
        url: `/withdrawals?groupRef=${params.groupId}&approvalStatus=pending`,
      }),
  });

  await queryClient.ensureQueryData({
    queryKey: ['fetchTransactions', params.groupId],
    queryFn: () =>
      getData({
        url: `/group-transacts?groupRef=${params.groupId}&sort=-createdAt&limit=10`,
      }),
  });

  const resp = await queryClient.ensureQueryData({
    queryKey: ['fetchMember', params.groupId],
    queryFn: () => fetchOnlyData({ url: `/members/${params.groupId}` }),
  });

  if (resp.status === 'fail') {
    return redirect('/account/manage-group');
  }
  return params;
};
