/* eslint-disable react-refresh/only-export-components */
import { MdChat } from 'react-icons/md';
import GroupBanner from '../../components/DashboardComponents/GroupBanner';
import LinkBtn from '../../components/UI/LinkBtn';
import { useEffect, useRef, useState } from 'react';
import { LoaderFunctionArgs, redirect, useParams } from 'react-router-dom';

import {
  fetchOnlyData,
  getData,
  queryClient,
} from '../../helperFunc.ts/apiRequest';
import { useQuery } from '@tanstack/react-query';
import { Group } from '../../dtos/groupDto';
import { formatDateWD, formatTime } from '../../helperFunc.ts/utilsFunc';
import { GroupTransaction } from '../../dtos/paymentDto';
import Empty from '../../components/UI/Empty';
import { toast } from 'react-toastify';
import GroupBalanceDisplay from '../../components/DashboardComponents/GroupBalanceDisplay';
import GroupInvitationLink from '../../components/DashboardComponents/GroupInvitationLink';
import GroupActionsLinks from '../../components/DashboardComponents/GroupActionsLinks';
import GroupViewAside from '../../components/DashboardComponents/GroupViewAside';
import TransactionBox from '../../components/UI/TransactionBox';

// import crypto from 'crypto';

const GroupView = () => {
  // const params = useLoaderData();
  const mainRef = useRef<HTMLElement>(null);

  const PageParams = useParams();
  const [showLink, setShowLink] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isCopy, setIsCopy] = useState(false);
  const [mainHeight, setMainHeight] = useState<number | null>();

  const { data } = useQuery({
    queryKey: ['fetchGroup', PageParams.groupId],
    queryFn: () => getData({ url: `/groups/${PageParams.groupId}` }),
  });

  const { data: transactData } = useQuery({
    queryKey: ['fetchTransactions', PageParams.groupId],
    queryFn: () =>
      getData({
        url: `/group-transacts?groupRef=${PageParams.groupId}&sort=-createdAt&limit=10`,
      }),
  });

  const { data: pendingWithdrawals } = useQuery({
    queryKey: ['fetchWithdrawal', 'pending', PageParams.groupId],
    queryFn: () =>
      getData({
        url: `/withdrawals?groupRef=${PageParams.groupId}&approvalStatus=pending`,
      }),
  });

  const { data: currentMember } = useQuery({
    queryKey: ['fetchMember', PageParams.groupId],
    queryFn: () => fetchOnlyData({ url: `/members/${PageParams.groupId}` }),
  });

  const { data: admission } = useQuery({
    queryKey: ['fetchMemberList'],
    queryFn: () =>
      fetchOnlyData({
        url: `/members/group-members?groupRef=${PageParams.groupId}&status=false`,
      }),
  });

  const withdrawalsPending = pendingWithdrawals?.withdrawals?.reduce(
    (acc: number, curr: { contribution: number }) => acc + curr.contribution,
    0
  );

  useEffect(() => {
    if (mainRef.current) {
      const height = mainRef.current.getBoundingClientRect().height;

      setMainHeight(height);
    }
  }, [mainRef]);

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
      <>
        <div className='flex justify-end mb-3'>
          <LinkBtn btnText='Back' url='/account/manage-group' />
        </div>
        {/* Group banner */}
        <GroupBanner group={group} />
        {/* Balance & report line */}
        <GroupBalanceDisplay
          group={group}
          withdrawalsPending={withdrawalsPending}
        />
        {/* Group link copy interface */}
        <GroupInvitationLink
          showLink={showLink}
          isCopy={isCopy}
          handleCopy={handleCopy}
          invitationLink={data?.inviteLink}
        />
        {/* Group action buttons/links */}
        <GroupActionsLinks
          roles={roles}
          member={currentMember?.member}
          group={group}
          showLink={showLink}
          setShowLink={setShowLink}
          newMemberCount={admission?.noHits}
        />
      </>
      {/* Main body */}
      <div className='lg:flex lg:gap-3 relative mt-6'>
        <main className='lg:basis-3/5 basis-full' ref={mainRef}>
          <div className='flex justify-between flex-wrap items-center'>
            <h3 className='font-600'>Recent Transactions</h3>
            <MdChat
              className='text-primary-500 dark:text-slate-100 text-2xl cursor-pointer lg:hidden'
              title='Show chat'
              onClick={() => setShowChat(!showChat)}
            />
          </div>
          {/* Recent transactions */}

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
        <GroupViewAside
          groupId={group?._id}
          showChat={showChat}
          setShowChat={setShowChat}
          mainHeight={mainHeight}
        />
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
    queryKey: ['fetchChat', params.groupId],
    queryFn: () =>
      getData({
        url: `/chats?sort=-createdAt`,
        params: { groupRef: params.groupId as string },
      }),
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

  await queryClient.ensureQueryData({
    queryKey: ['fetchMemberList'],
    queryFn: () =>
      fetchOnlyData({
        url: `/members/group-members?groupRef=${params.groupId}&status=false`,
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
