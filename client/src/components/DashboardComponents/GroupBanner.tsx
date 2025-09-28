import { useState } from 'react';
import LinkBtn from '../UI/LinkBtn';
import { Group } from '../../dtos/groupDto';

const GroupBanner = ({ group }: { group: Group }) => {
  const [isShow, setIsShow] = useState(false);
  return (
    <>
      <div className=' bg-gray-100 dark:bg-slate-800 flex justify-between items-center flex-wrap text-lg p-2 border-b-2 border-green-600'>
        <div className='flex items-center flex-wrap gap-2'>
          {group?.photo && (
            <img
              src={group?.photo}
              width={30}
              height={30}
              alt={`${group?.groupName} logo`}
              className='rounded-full'
            />
          )}
          <h1 className='font-600 capitalize'>{group?.groupName}</h1>
        </div>
        <span
          className='bg-green-600 p-1 px-6 rounded-2xl text-sm text-green-100 capitalize cursor-pointer'
          onClick={() => setIsShow(!isShow)}
        >
          {isShow ? 'hide' : 'show'}
        </span>
      </div>
      <div
        className={`text-sm bg-gray-100 dark:bg-slate-800 p-2  ${
          isShow ? 'pt-4 block' : 'hidden'
        }`}
      >
        <div className='mb-2'>
          <span className='font-600 capitalize'>group Ref: </span>
          <span className='font-poppins'>{group?.groupRef}</span>
        </div>
        <div className='mb-2'>
          <span className='font-600 capitalize'>group type: </span>
          <span className='capitalize'>{group?.groupType}</span>
        </div>
        <div className='mb-2'>
          <span className='font-600 capitalize'>group Purpose: </span>
          <span className='capitalize'>{group?.groupPurpose}</span>
        </div>
        <div className='mb-2'>
          <span className='font-600 capitalize'>group description: </span>
          <span className='text-justify'>{group?.groupDescription}</span>
        </div>
        <div className='mb-2'>
          <span className='font-600 capitalize'>group status: </span>
          <span className='text-justify'>
            {group?.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div className='flex flex-wrap gap-2'>
          <LinkBtn
            btnText='manage rules'
            url='/account/manage-group/view/1/manage-rules'
          />
          <LinkBtn
            btnText='view rules'
            url='/account/manage-group/view/1/view-rules'
          />
        </div>
      </div>
    </>
  );
};

export default GroupBanner;
