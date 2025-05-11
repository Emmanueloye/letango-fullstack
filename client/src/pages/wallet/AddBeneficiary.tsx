/* eslint-disable react-refresh/only-export-components */
import AddBeneficiaryForm from '../../components/DashboardComponents/AddBeneficiaryForm';
import BeneficiaryCard from '../../components/BeneficiaryCard';
import Title from '../../components/UI/Title';
import { ActionFunctionArgs } from 'react-router-dom';
import {
  extractFormData,
  getData,
  postData,
  queryClient,
} from '../../helperFunc.ts/apiRequest';
import { useQuery } from '@tanstack/react-query';
import Empty from '../../components/UI/Empty';
import { BeneficiaryType } from '../../dtos/beneficiaryDto';
import LinkBtn from '../../components/UI/LinkBtn';

const AddBeneficiary = () => {
  const { data } = useQuery({
    queryKey: ['fetchBeneficiary'],
    queryFn: () => getData({ url: `/beneficiaries` }),
  });

  return (
    <section>
      <div className='flex justify-end mb-4'>
        <LinkBtn btnText='back' url='/account/personal-wallet' />
      </div>

      <div className='grid md:grid-cols-2 gap-2'>
        {/* Beneficiary form */}
        <AddBeneficiaryForm />

        {/* Beneficiary card */}
        {data?.beneficiaries?.length > 0 ? (
          <div className='bg-gray-100 dark:bg-slate-800'>
            <Title title='beneficiaries List' />
            {data?.beneficiaries?.map((item: BeneficiaryType) => (
              <BeneficiaryCard beneficiary={item} key={item._id} />
            ))}
          </div>
        ) : (
          <Empty message='No beneficiaries saved.' />
        )}
      </div>
    </section>
  );
};

export default AddBeneficiary;

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await extractFormData(request);

  const result = await postData({ url: '/beneficiaries', data });
  if (result.status === 'success') {
    queryClient.invalidateQueries({ queryKey: ['fetchBeneficiary'] });
    return result;
  }
};

export const loader = async () => {
  return queryClient.ensureQueryData({
    queryKey: ['fetchBeneficiary'],
    queryFn: () => getData({ url: `/beneficiaries` }),
  });
};
