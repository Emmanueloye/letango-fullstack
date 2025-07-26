/* eslint-disable react-refresh/only-export-components */
import {
  LoaderFunctionArgs,
  redirect,
  useLoaderData,
  useOutletContext,
  useParams,
} from 'react-router-dom';
import LinkBtn from '../../components/UI/LinkBtn';
import Title from '../../components/UI/Title';
import {
  deleteData,
  extractParams,
  fetchOnlyData,
  getData,
  patchData,
  queryClient,
} from '../../helperFunc.ts/apiRequest';
import { useQuery } from '@tanstack/react-query';
import Pagination from '../../components/UI/Pagination';
import { IMember } from '../../dtos/groupDto';
import { capitalized, formatDateWD } from '../../helperFunc.ts/utilsFunc';
import { useEffect, useState } from 'react';
import Empty from '../../components/UI/Empty';
import { toast } from 'react-toastify';
import { User } from '../../dtos/UserDto';

const MemberAdmission = () => {
  const user = useOutletContext() as User;

  // Getting the page from loader
  const { groupId, page } = useLoaderData();
  //   Getting group id from the url
  const params = useParams();
  //   member state
  const [members, setMembers] = useState<IMember[]>([]);
  //   loading state
  const [isSearching, setIsSearching] = useState(false);

  //   Data fetching for members list
  const { data } = useQuery({
    queryKey: ['fetchMemberList', 'pending', groupId, page ?? 1],
    queryFn: () =>
      getData({
        url: `/members/group-members?groupRef=${groupId}&page=${
          page || 1
        }&limit=12&status=false`,
      }),
  });

  const { data: myMembership } = useQuery({
    queryKey: ['fetchMember', 'pending', groupId],
    queryFn: () => getData({ url: `/members/${groupId}` }),
  });

  //   Extracting required data from the query result.
  const membersData: IMember[] = data?.members;
  const { totalPages, currentPage, nextPage, previousPage } = data?.page || {};

  //   Handle search functionality
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Get search value from the input
    const searchVal = encodeURIComponent(e.target.value);
    setIsSearching(true);
    // The setTimeout is to wait one sec for the after the user finish typing before making the request
    setTimeout(async () => {
      const result = await queryClient.fetchQuery({
        queryKey: ['fetchMeberList', 'pending', searchVal],
        queryFn: () =>
          fetchOnlyData({
            url: `/members/group-members?groupRef=${groupId}&status=false&search=memberName&value=${searchVal}`,
          }),
      });

      //   Set members state depending on the result status. If there is error, we want to revert back to the main data.
      if (result?.status === 'success' && searchVal) {
        setMembers(result?.members);
        setIsSearching(false);
      } else {
        setMembers(membersData);
        setIsSearching(false);
      }
    }, 1000);
  };

  const handleMemberStatus = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => {
    let data;

    // Get the target member from list of members
    const targetMember = members.find((item) => item._id === id);

    if (e.currentTarget.id === 'activate') {
      data = {
        status: true,
        admittedBy: user?._id,
        admittedDate: new Date(Date.now()),
      };

      // get out the user full name
      const name = `${targetMember?.memberId?.surname} ${
        targetMember?.memberId?.otherNames.split(' ')[0]
      }`;

      //   Confirm that user wants to do the update.
      const proceed = window.confirm(
        `Are you sure you want to admit ${capitalized(name) || 'user'}?`
      );

      // update the member once confirmed.
      if (proceed) {
        const resp = await patchData({
          url: `/members/${id}?groupRef=${groupId}`,
          data,
        });
        if (resp.status === 'success') {
          queryClient.invalidateQueries({ queryKey: ['fetchMember'] });
          queryClient.invalidateQueries({ queryKey: ['fetchMemberList'] });
          toast.success(
            `${capitalized(
              targetMember?.memberId?.surname || ''
            )} ${capitalized(
              targetMember?.memberId?.otherNames?.split(' ')[0] || ''
            )} has been admitted.`
          );
        }
      }
    }

    if (e.currentTarget.id === 'reject') {
      // get out the user full name
      const name = `${targetMember?.memberId?.surname} ${
        targetMember?.memberId?.otherNames.split(' ')[0]
      }`;

      //   Confirm that user wants to do the update.
      const proceed = window.confirm(
        `Are you sure you want to reject ${
          capitalized(name) || 'user'
        }? Rejection would delete this member permanently.`
      );
      if (proceed) {
        await deleteData({
          url: `/members/${id}?groupRef=${groupId}`,
          invalidate: ['fetchMemberList'],
        });
      }
    }
  };

  //   To put members data in the state.
  useEffect(() => {
    setMembers(data?.members);
  }, [data?.members]);

  return (
    <section>
      {/* back button */}
      <div className='flex justify-end mb-3'>
        <LinkBtn
          btnText='Back'
          url={`/account/manage-group/view/${params?.groupId}`}
        />
      </div>
      {/* page title */}
      <Title title='Members awaiting admission' />
      {/* The members grid */}
      {/* search */}
      <div className='w-full md:w-3/6 md:mx-auto mb-6 relative'>
        <input
          type='text'
          id='search'
          name='search'
          placeholder='Search members...'
          className='placeholder:text-sm'
          onChange={handleSearch}
        />
        {/* Loader indicator */}
        {isSearching && (
          <small className='flex justify-center text-center'>
            Searching...
          </small>
        )}
      </div>
      {members?.length > 0 ? (
        <div className='grid md:grid-cols-2 gap-3'>
          {/* members card */}
          {members?.map((member) => (
            <div
              key={member._id}
              className='flex justify-between flex-wrap items-start shadow px-2 py-3 dark:bg-slate-800 bg-gray-100'
            >
              <div className='mb-2'>
                <p className='mb-2 font-500 capitalize'>
                  {member?.memberId?.surname} {member?.memberId?.otherNames}
                </p>
                <p className='capitalize text-[12px]'>
                  joined: {formatDateWD(new Date(member?.joinedAt))}
                </p>
                <p className='capitalize text-[12px]'>
                  Status: {member?.status ? 'admitted' : 'awaiting admission'}
                </p>
                <p className='capitalize text-[12px]'>role: {member?.role}</p>
                {member?.unadmitBy && (
                  <p className='capitalize text-[12px]'>
                    unadmitted by: &nbsp;
                    <span className='capitalize'>
                      {capitalized(member?.unadmitBy?.surname)} {''}
                      {capitalized(member?.unadmitBy?.otherNames.split(' ')[0])}
                    </span>
                  </p>
                )}
              </div>
              {['admin', 'owner'].includes(myMembership?.member?.role) && (
                <div>
                  <div className='flex justify-center'>
                    <button
                      onClick={(e) => handleMemberStatus(e, member?._id)}
                      className='bg-green-600 px-3 py-1 rounded-2xl mt-2 capitalize text-sm cursor-pointer text-slate-50'
                      title='Admit Member'
                      id='activate'
                    >
                      Admit
                    </button>
                  </div>
                  <div className='flex justify-center mt-4'>
                    <button
                      onClick={(e) => handleMemberStatus(e, member?._id)}
                      className='bg-amber-600 px-3 py-1 rounded-2xl mt-2 capitalize text-sm cursor-pointer text-slate-50'
                      title='Reject Member'
                      id='reject'
                    >
                      reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <Empty message='No data available' />
      )}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        nextPage={nextPage}
        previousPage={previousPage}
        baseLink={`/account/manage-group/view/${groupId}/members`}
      />
    </section>
  );
};

export default MemberAdmission;

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { page } = extractParams(request);
  await queryClient.ensureQueryData({
    queryKey: ['fetchMemberList', 'pending', params.groupId, page ?? 1],
    queryFn: () =>
      getData({
        url: `/members/group-members?groupRef=${params.groupId}&page=${
          page || 1
        }&limit=12&status=false`,
      }),
  });

  const member = await queryClient.ensureQueryData({
    queryKey: ['fetchMember', 'pending', params.groupId],
    queryFn: () => fetchOnlyData({ url: `/members/${params.groupId}` }),
  });

  const roles = ['owner', 'admin'];
  if (!roles.includes(member?.member.role)) {
    return redirect(`/account/manage-group/view/${params.groupId}`);
  }

  return { groupId: params.groupId, page };
};
