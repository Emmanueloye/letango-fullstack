import { useState } from 'react';
import LinkBtn from '../UI/LinkBtn';

const GroupBanner = () => {
  const [isShow, setIsShow] = useState(false);
  return (
    <>
      <div className=' bg-gray-100 dark:bg-slate-800 flex justify-between items-center flex-wrap text-lg p-2 border-b-2 border-green-600'>
        <h1 className='font-600 '>Alapomeji Association</h1>
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
          <span className='font-600 capitalize'>group type: </span>
          <span className='capitalize'>Peer contribution</span>
        </div>
        <div className='mb-2'>
          <span className='font-600 capitalize'>group Purpose: </span>
          <span className='capitalize'>group contribution</span>
        </div>
        <div className='mb-2'>
          <span className='font-600 capitalize'>group description: </span>
          <span className='text-justify'>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloremque
            exercitationem accusantium sunt omnis! Cum voluptatum, qui doloribus
            ut nesciunt provident?
          </span>
        </div>
        <div className='flex gap-2'>
          <LinkBtn
            btnText='manage group rules'
            url='/account/manage-group/view/1/manage-rules'
          />
          <LinkBtn
            btnText='view group rules'
            url='/account/manage-group/view/1/view-rules'
          />
        </div>
      </div>
    </>
  );
};

export default GroupBanner;
