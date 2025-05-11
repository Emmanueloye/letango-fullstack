/* eslint-disable react-refresh/only-export-components */
// import DateRangeSelector from '../../components/UI/DateRangeSelector';
import {
  LoaderFunctionArgs,
  useLoaderData,
  useSearchParams,
} from 'react-router-dom';
import LinkBtn from '../../components/UI/LinkBtn';
import TransactionBox from '../../components/UI/TransactionBox';
import {
  extractParams,
  getData,
  queryClient,
} from '../../helperFunc.ts/apiRequest';
import { TFlow, TransactionFlowType } from '../../dtos/statementDto';
import Empty from '../../components/UI/Empty';
import {
  formatDateWD,
  formatTime,
  paginate,
} from '../../helperFunc.ts/utilsFunc';
import ReportPagination from '../../components/UI/ReportPagination';
import { useEffect, useState } from 'react';

const TransactionFlow = () => {
  const data = useLoaderData() as TransactionFlowType;

  const [flowData, setFlowData] = useState<TFlow[]>([]);

  useEffect(() => {
    if (data?.path === 'inflow') {
      setFlowData(data?.inflow || []);
    }
    if (data?.path === 'outflow') {
      setFlowData(data?.outlflow || []);
    }
  }, [data?.inflow, data?.outlflow, data?.path]);

  // Pagination setup
  const [searchParams] = useSearchParams();
  // Get start and end index
  const { startIndex, endIndex } = paginate(searchParams);

  const inflowList = flowData || [];
  const paginateInflow = inflowList?.slice(startIndex, endIndex);

  console.log(paginateInflow);

  return (
    <div>
      <div className='flex justify-end mb-4'>
        <LinkBtn btnText='back' url='/account/personal-wallet' />
      </div>
      {/* Date selector */}

      {/* Transaction cards */}
      <>
        <h4 className='text-center mt-8 mb-4 font-600'>Transaction history</h4>
        {flowData?.length > 0 ? (
          <div>
            {paginateInflow?.map((item) => (
              <TransactionBox
                key={item._id}
                description={item.description}
                date={formatDateWD(new Date(item.createdAt))}
                time={formatTime(new Date(item.createdAt))}
                amount={item.contribution}
              />
            ))}
            <ReportPagination numOfResults={flowData?.length || 0} />
          </div>
        ) : (
          <Empty message='No data available.' />
        )}
      </>
    </div>
  );
};

export default TransactionFlow;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const path = request.url.split('/').at(-1);
  const params = extractParams(request);

  if (path === 'inflow') {
    const result = await queryClient.ensureQueryData({
      queryKey: ['fetchInflow', path, params.page ?? 1],
      queryFn: () => getData({ url: '/personal/inflow' }),
    });

    return { ...result, path, params };
  }

  if (path === 'outflow') {
    const result = await queryClient.ensureQueryData({
      queryKey: ['fetchInflow', path, params.page ?? 1],
      queryFn: () => getData({ url: '/personal/outflow' }),
    });

    return { ...result, path };
  }
};
