import { useQuery } from '@tanstack/react-query';
import Button from '../UI/Button';
import Title from '../UI/Title';
import { getData } from '../../helperFunc.ts/apiRequest';
import { formatNumber } from '../../helperFunc.ts/utilsFunc';
import { Form } from 'react-router-dom';

const GroupSettingForm = () => {
  const { data } = useQuery({
    queryKey: ['fetchGroupSetting', 'groupSettings'],
    queryFn: () => getData({ url: '/group-settings' }),
  });

  const setting = data?.groupSetting?.[0];

  return (
    <Form method='patch'>
      <section>
        {/* Membership settings */}
        <Title title='Member Settings' />

        <div className='grid lg:grid-cols-2 gap-2'>
          {/* Contribution member limit */}
          <div className='mb-2'>
            <label
              htmlFor='cmemberLimit'
              className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
            >
              Contribution Member limit
            </label>
            <input
              type='text'
              id='cmemberLimit'
              name='cmemberLimit'
              autoComplete='off'
              defaultValue={setting?.cmemberLimit}
            />
          </div>

          {/* Contributin group creation limit */}
          <div className='mb-2'>
            <label
              htmlFor='cGroupLimit'
              className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
            >
              Contribution Group limit
            </label>
            <input
              type='text'
              id='cGroupLimit'
              name='cGroupLimit'
              autoComplete='off'
              defaultValue={setting?.cGroupLimit}
            />
          </div>

          {/* Basic Club and Asso member limit*/}
          <div className='mb-2'>
            <label
              htmlFor='basicMemberLimit'
              className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
            >
              Basic Club & Asso Member limit
            </label>
            <input
              type='text'
              id='basicMemberLimit'
              name='basicMemberLimit'
              autoComplete='off'
              defaultValue={setting?.basicMemberLimit}
            />
          </div>

          {/* Bronse Club & Association member limit*/}
          <div className='mb-2'>
            <label
              htmlFor='bronzeMemberLimit'
              className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
            >
              Bronze Club & Asso Member limit
            </label>
            <input
              type='text'
              id='bronzeMemberLimit'
              name='bronzeMemberLimit'
              autoComplete='off'
              defaultValue={setting?.bronzeMemberLimit}
            />
          </div>

          {/* Gold Club & Association member limit*/}
          <div className='mb-2'>
            <label
              htmlFor='goldMemberLimit'
              className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
            >
              Gold Club & Asso Member limit
            </label>
            <input
              type='text'
              id='goldMemberLimit'
              name='goldMemberLimit'
              autoComplete='off'
              defaultValue={setting?.goldMemberLimit}
            />
          </div>

          {/* Diamond Club & Association member limit*/}
          <div className='mb-2'>
            <label
              htmlFor='diamondMemberLimit'
              className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
            >
              diamond Club & Asso Member limit
            </label>
            <input
              type='text'
              id='diamondMemberLimit'
              name='diamondMemberLimit'
              autoComplete='off'
              defaultValue={setting?.diamondMemberLimit}
            />
          </div>
        </div>

        {/* Club & association charges */}
        <Title title='Charge Settings' />

        <div className='grid lg:grid-cols-2 gap-2'>
          {/* Basic charge */}
          <div className='mb-2'>
            <label
              htmlFor='basicCharge'
              className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
            >
              Club & Association Basic Charge
            </label>
            <input
              type='text'
              id='basicCharge'
              name='basicCharge'
              autoComplete='off'
              defaultValue={formatNumber(setting?.basicCharge)}
            />
          </div>

          {/* Bronze Charge */}
          <div className='mb-2'>
            <label
              htmlFor='bronzeCharge'
              className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
            >
              Club & Association Bronze Charge
            </label>
            <input
              type='text'
              id='bronzeCharge'
              name='bronzeCharge'
              autoComplete='off'
              defaultValue={formatNumber(setting?.bronzeCharge)}
            />
          </div>

          {/* gold charge*/}
          <div className='mb-2'>
            <label
              htmlFor='goldCharge'
              className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
            >
              Club & Association Gold charge
            </label>
            <input
              type='text'
              id='goldCharge'
              name='goldCharge'
              autoComplete='off'
              defaultValue={formatNumber(setting?.goldCharge)}
            />
          </div>

          {/* Diamond charge*/}
          <div className='mb-2'>
            <label
              htmlFor='diamondCharge'
              className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
            >
              Club & Association Diamond Charge
            </label>
            <input
              type='text'
              id='diamondCharge'
              name='diamondCharge'
              autoComplete='off'
              defaultValue={formatNumber(setting?.diamondCharge)}
            />
          </div>

          {/* Charge per new member for contribution */}
          <div className='mb-2'>
            <label
              htmlFor='chargePerNewMember'
              className={`after:text-red-500 after:content-['*'] after:font-700 text-sm`}
            >
              Contribution Additional Members
            </label>
            <input
              type='text'
              id='chargePerNewMember'
              name='chargePerNewMember'
              autoComplete='off'
              defaultValue={formatNumber(setting?.chargePerNewMember)}
            />
          </div>
          <input type='hidden' name='id' defaultValue={setting?._id} />
        </div>

        <div className='mt-2'>
          <Button btnText='Save' btnType='submit' />
        </div>
      </section>
    </Form>
  );
};

export default GroupSettingForm;
