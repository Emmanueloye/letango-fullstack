import { FaTrashAlt } from 'react-icons/fa';
import { BeneficiaryType } from '../dtos/beneficiaryDto';
import { deleteData, queryClient } from '../helperFunc.ts/apiRequest';
import { useState } from 'react';

const BeneficiaryCard = ({ beneficiary }: { beneficiary: BeneficiaryType }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handDelete = async () => {
    setIsLoading(true);
    const resp = await deleteData({
      url: `/beneficiaries/${beneficiary._id}`,
    });

    if (resp.status === 'success') {
      setIsLoading(false);
      queryClient.invalidateQueries({ queryKey: ['fetchBeneficiary'] });
    }
    setIsLoading(false);
  };
  return (
    <div className=' w-full font-poppins p-1'>
      <div className='flex justify-between items-center border-1 py-3 px-4 rounded-md text-sm'>
        <div>
          <p className='mb-2'>Account ref: {beneficiary.accountRef}</p>
          <p className='capitalize'>Account name: {beneficiary.accountName}</p>
        </div>
        {isLoading ? (
          '...'
        ) : (
          <FaTrashAlt className='text-rose-500' onClick={handDelete} />
        )}
      </div>
    </div>
  );
};

export default BeneficiaryCard;
