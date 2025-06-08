/* eslint-disable react-refresh/only-export-components */
import { LoaderFunctionArgs, useLoaderData, useParams } from 'react-router-dom';
import LinkBtn from '../../components/UI/LinkBtn';
import Title from '../../components/UI/Title';
import {
  extractParams,
  fetchOnlyData,
  getData,
  patchData,
  queryClient,
} from '../../helperFunc.ts/apiRequest';
import { useQuery } from '@tanstack/react-query';
import Pagination from '../../components/UI/Pagination';
import { IMember } from '../../dtos/groupDto';
import { formatDateWD } from '../../helperFunc.ts/utilsFunc';
import { useEffect, useState } from 'react';
import Empty from '../../components/UI/Empty';
import { toast } from 'react-toastify';

const MembersList = () => {
  // Getting the page from loader
  const { groupId, page } = useLoaderData();
  //   Getting group id from the url
  const params = useParams();
  //   member state
  const [members, setMembers] = useState<IMember[]>([]);
  //   loading state
  const [isSearching, setIsSearching] = useState(false);

  const role = ['member', 'owner', 'admin'];

  //   Data fetching for members list
  const { data } = useQuery({
    queryKey: ['fetchMemberList', groupId, page ?? 1],
    queryFn: () =>
      getData({
        url: `/members/group-members?groupRef=${groupId}&page=${
          page || 1
        }&limit=12`,
      }),
  });

  const { data: myMembership } = useQuery({
    queryKey: ['fetchMember', groupId],
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
        queryKey: ['fetchMeberList', searchVal],
        queryFn: () =>
          fetchOnlyData({
            url: `/members/group-members?groupRef=${groupId}&search=memberName&value=${searchVal}`,
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

  const handleRoleChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
    id: string
  ) => {
    // Get the target member from list of members
    const targetMember = members.find((item) => item._id === id);
    // get out the user full name
    const name = `${targetMember?.memberId?.surname.toUpperCase()} ${targetMember?.memberId?.otherNames
      .split(' ')[0]
      .toUpperCase()}`;
    //   Confirm that user wants to do the update.
    const proceed = window.confirm(
      `Are you sure you want to update ${name || 'user'}'s role?`
    );

    // update the member once confirmed.
    if (proceed) {
      const resp = await patchData({
        url: `/members/${id}?groupRef=${groupId}`,
        data: { role: encodeURIComponent(e.target.value) },
      });
      if (resp.status === 'success') {
        queryClient.invalidateQueries({ queryKey: ['fetchMember'] });
        queryClient.invalidateQueries({ queryKey: ['fetchMemberList'] });
        toast.success(resp.message);
      }
    }
  };

  const handleMemberStatus = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => {
    let data;
    if (e.currentTarget.id === 'deactivate') data = { status: false };
    if (e.currentTarget.id === 'activate') data = { status: true };

    // Get the target member from list of members
    const targetMember = members.find((item) => item._id === id);
    // get out the user full name
    const name = `${targetMember?.memberId?.surname.toUpperCase()} ${targetMember?.memberId?.otherNames
      .split(' ')[0]
      .toUpperCase()}`;

    //   Confirm that user wants to do the update.
    const proceed = window.confirm(
      `Are you sure you want to update ${name || 'user'}'s status?`
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
        toast.success(resp.message);
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
      <Title title='Members List' />
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
                <p className='capitalize text-[12px]'>role: {member?.role}</p>
              </div>
              {['admin', 'owner'].includes(myMembership?.member?.role) && (
                <div>
                  <select
                    name='role'
                    id={member?._id}
                    className='capitalize w-30 py-1 text-sm'
                    onChange={(e) => handleRoleChange(e, member?._id)}
                  >
                    <option value={member?.role}>{member?.role}</option>
                    {role
                      .filter((item) => item !== member?.role)
                      .map((el) => (
                        <option value={el} key={el}>
                          {el}
                        </option>
                      ))}
                  </select>
                  <div className='flex justify-center'>
                    {member?.status ? (
                      <button
                        onClick={(e) => handleMemberStatus(e, member?._id)}
                        id='deactivate'
                        className='bg-rose-600 px-3 py-1 rounded-2xl mt-2 capitalize text-sm'
                        title='Deactive Member'
                      >
                        deactivate
                      </button>
                    ) : (
                      <button
                        onClick={(e) => handleMemberStatus(e, member?._id)}
                        className='bg-green-600 px-3 py-1 rounded-2xl mt-2 capitalize text-sm'
                        title='Activate Member'
                        id='activate'
                      >
                        activate
                      </button>
                    )}
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

export default MembersList;

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { page } = extractParams(request);
  await queryClient.ensureQueryData({
    queryKey: ['fetchMemberList', params.groupId, page ?? 1],
    queryFn: () =>
      getData({
        url: `/members/group-members?groupRef=${params.groupId}&page=${
          page || 1
        }&limit=12`,
      }),
  });

  await queryClient.ensureQueryData({
    queryKey: ['fetchMember', params.groupId],
    queryFn: () => fetchOnlyData({ url: `/members/${params.groupId}` }),
  });

  return { groupId: params.groupId, page };
};
