/* eslint-disable react-refresh/only-export-components */
import {
  Link,
  LoaderFunctionArgs,
  redirect,
  useLoaderData,
  useParams,
} from 'react-router-dom';
import LinkBtn from '../../components/UI/LinkBtn';
import { FaPencilAlt } from 'react-icons/fa';
import {
  extractParams,
  fetchOnlyData,
  patchData,
  queryClient,
} from '../../helperFunc.ts/apiRequest';
import { useQuery } from '@tanstack/react-query';
import { IFundHead } from '../../dtos/groupDto';
import { useEffect, useState } from 'react';
import Pagination from '../../components/UI/Pagination';
import {
  MdOutlineArrowCircleDown,
  MdOutlineArrowCircleUp,
} from 'react-icons/md';
import { toast } from 'react-toastify';

const FundHeadLanding = () => {
  const page = useLoaderData();
  const params = useParams();
  const [fundHeads, setFundHeads] = useState<IFundHead[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const { data } = useQuery({
    queryKey: ['fetchFundHead', params.groupId, page ?? 1],
    queryFn: () =>
      fetchOnlyData({
        url: `/fundClasses?groupRef=${params.groupId}&page=${
          page || 1
        }&limit=9`,
      }),
  });

  const { totalPages, currentPage, nextPage, previousPage } = data?.page || {};

  //   Handle search functionality
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Get search value from the input
    const searchVal = encodeURIComponent(e.target.value);
    setIsSearching(true);
    // The setTimeout is to wait one sec for the after the user finish typing before making the request
    setTimeout(async () => {
      const result = await queryClient.fetchQuery({
        queryKey: ['fetchFundHead', searchVal],
        queryFn: () =>
          fetchOnlyData({
            url: `/fundClasses?groupRef=${params?.groupId}&search=head&value=${searchVal}`,
          }),
      });

      //   Set members state depending on the result status. If there is error, we want to revert back to the main data.
      if (result?.status === 'success' && searchVal) {
        setFundHeads(result?.fundClasses);
        setIsSearching(false);
      } else {
        setFundHeads(data?.fundClasses);
        setIsSearching(false);
      }
    }, 1000);
  };

  const handleHeadStatus = async (
    e: React.MouseEvent<SVGElement, MouseEvent>,
    id: string
  ) => {
    const action = e.currentTarget.id;

    const proceed = window.confirm(
      `Are you sure you want to ${action} this fund head? `
    );
    const value = action === 'deactivate' ? false : true;
    if (proceed) {
      const result = await patchData({
        url: `/fundClasses/${id}?groupRef=${params.groupId}`,
        data: { isActive: value },
      });

      if (result?.status === 'success') {
        queryClient.invalidateQueries({ queryKey: ['fetchFundHead'] });
        toast.success(`Fund head updated.`);
      }
    }
  };

  useEffect(() => {
    setFundHeads(data?.fundClasses);
  }, [data?.fundClasses]);

  return (
    <section>
      {/* Back button */}
      <div className='flex justify-end mb-3'>
        <LinkBtn
          btnText='Back'
          url={`/account/manage-group/view/${params?.groupId}`}
        />
      </div>
      {/* Create new fund head link */}
      <Link
        to={`/account/manage-group/view/${params?.groupId}/fund-heads/create`}
        className='bg-primary-500 text-slate-50 px-3 py-2 rounded-md capitalize font-600 mt-1 mb-4'
      >
        New head
      </Link>

      {/* search */}
      <div className='w-full md:w-3/6 md:mx-auto mb-6 relative'>
        <input
          type='text'
          id='search'
          name='search'
          placeholder='Search fund heads...'
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

      {/* main listing */}

      <div className='grid md:grid-cols-3 gap-3 mt-6'>
        {/* members card */}
        {fundHeads?.map((item: IFundHead) => (
          <div
            className='flex justify-center flex-wrap items-start shadow px-2 py-3 dark:bg-slate-800 bg-gray-100'
            key={item._id}
          >
            <div className='mb-2'>
              <p className='mb-2 font-500 capitalize text-center'>
                {item.head}
              </p>
              <p className='mb-2 font-500 capitalize text-center'>
                {item.headType}
              </p>
              {/* /account/manage-group/view/GP-LUCFZLVK/fund-heads */}
              <div className='flex justify-center items-center gap-8'>
                <Link
                  to={`/account/manage-group/view/${params.groupId}/fund-heads/edit/${item._id}`}
                >
                  <FaPencilAlt title='Edit' className='text-amber-600' />
                </Link>
                {item.isActive ? (
                  <MdOutlineArrowCircleDown
                    title='Deactivate'
                    id='deactivate'
                    className='text-2xl text-red-500 cursor-pointer'
                    onClick={(e) => handleHeadStatus(e, item._id)}
                  />
                ) : (
                  <MdOutlineArrowCircleUp
                    title='Activate'
                    id='activate'
                    className='text-2xl text-green-500 cursor-pointer'
                    onClick={(e) => handleHeadStatus(e, item._id)}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        nextPage={nextPage}
        previousPage={previousPage}
        baseLink={`/account/manage-group/view/${params?.groupId}/fund-heads`}
      />
    </section>
  );
};

export default FundHeadLanding;

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { page } = extractParams(request);

  await queryClient.ensureQueryData({
    queryKey: ['fetchFundHead', params.groupId, page ?? 1],
    queryFn: () =>
      fetchOnlyData({
        url: `/fundClasses?groupRef=${params.groupId}&page=${
          page || 1
        }&limit=9`,
      }),
  });
  const resp = await queryClient.ensureQueryData({
    queryKey: ['fetchMember', params.groupId],
    queryFn: () => fetchOnlyData({ url: `/members/${params.groupId}` }),
  });

  if (!['admin', 'owner'].includes(resp.member.role)) {
    return redirect(`/account/manage-group/view/${params.groupId}`);
  }

  return page;
};
