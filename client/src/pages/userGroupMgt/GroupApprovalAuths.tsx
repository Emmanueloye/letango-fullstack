/* eslint-disable react-refresh/only-export-components */
import {
  ActionFunctionArgs,
  Form,
  Link,
  LoaderFunctionArgs,
  redirect,
  useActionData,
  useParams,
} from 'react-router-dom';
import Button from '../../components/UI/Button';
import Empty from '../../components/UI/Empty';
import Title from '../../components/UI/Title';
import {
  extractFormData,
  fetchOnlyData,
  getData,
  postData,
  queryClient,
} from '../../helperFunc.ts/apiRequest';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { FormActionType } from '../../dtos/formAction';
import FormError from '../../components/UI/FormError';
import LinkBtn from '../../components/UI/LinkBtn';
import { FaPenAlt } from 'react-icons/fa';

const GroupApprovalAuths = () => {
  const params = useParams();
  const [selectedMember, setSelectedMember] = useState<{ role: string }>({
    role: '',
  });
  const action = useActionData() as FormActionType;
  const { data } = useQuery({
    queryKey: ['fetchMemberList', params.groupId],
    queryFn: () =>
      getData({
        url: `/members/group-members?groupRef=${params.groupId}`,
      }),
  });

  const { data: group } = useQuery({
    queryKey: ['fetchGroup', params.groupId],
    queryFn: () => getData({ url: `/groups/${params.groupId}` }),
  });

  const handleSelectedMember = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const member = data?.members?.find(
      (item: { memberId: { _id: string } }) => {
        return item.memberId._id === e.target.value;
      }
    );
    setSelectedMember(member);
  };

  return (
    <section>
      <div className='flex justify-end mb-4'>
        <LinkBtn
          btnText='back'
          url={`/account/manage-group/view/${params.groupId}`}
        />
      </div>
      <div className='grid md:grid-cols-2 gap-3'>
        <Form id='approvalAuthorityForm' method='post'>
          <Title title='add approval authority' />
          {selectedMember?.role &&
            !['admin', 'owner'].includes(selectedMember?.role) && (
              <p className='text-sm bg-amber-300 py-2 px-4 mb-4 rounded-2xl dark:text-primary-500 font-500'>
                Approval authority must either be a owner or admin. Go to the
                &nbsp;
                <span>
                  <Link
                    className='font-600 text-amber-900 underline'
                    to={`/account/manage-group/view/${params?.groupId}/members`}
                  >
                    member section
                  </Link>
                </span>
                &nbsp;of the group and update the member role if this member
                must be part of approval authorities.
              </p>
            )}
          {/* form error */}
          {action?.status === 'fail' && <FormError error={action?.message} />}
          {/* form inputs */}
          <select
            id='members'
            name='approvalAuthority'
            className='mb-4 capitalize'
            onChange={handleSelectedMember}
          >
            <option value='' hidden>
              Select member
            </option>
            {data?.members?.map(
              (item: { memberId: { _id: string }; memberName: string }) => (
                <option key={item?.memberId?._id} value={item?.memberId?._id}>
                  {item?.memberName}
                </option>
              )
            )}
          </select>
          <p className='block w-full py-2 px-4 outline-0 border border-gray-300 rounded-md dark:text-slate-50 capitalize mb-4 h-10'>
            {selectedMember?.role}
          </p>
          <Button btnText='save' btnType='submit' />
        </Form>

        {/* Approval authorities listing */}
        <div className='bg-gray-100 dark:bg-slate-800'>
          <Title title='approval authorities List' />

          {group?.group?.approvalAuthorities?.length > 0 ? (
            <div className=' w-full font-poppins p-2'>
              {group?.group?.approvalAuthorities?.map(
                (item: {
                  _id: string;
                  surname: string;
                  otherNames: string;
                }) => (
                  <div
                    key={item?._id}
                    className='flex justify-between items-center border-1 py-3 px-4 rounded-md text-sm mb-4'
                  >
                    <div>
                      <p className='mb-2 capitalize'>
                        Name: {item.surname} {item.otherNames}
                      </p>
                    </div>
                    <Link
                      to={`/account/manage-group/view/${params.groupId}/approvals/${item._id}`}
                    >
                      <FaPenAlt />
                    </Link>
                  </div>
                )
              )}
            </div>
          ) : (
            <Empty message='No beneficiaries saved.' />
          )}
        </div>
      </div>
    </section>
  );
};

export default GroupApprovalAuths;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  await queryClient.ensureQueryData({
    queryKey: ['fetchMemberList', params.groupId],
    queryFn: () =>
      getData({
        url: `/members/group-members?groupRef=${params.groupId}`,
      }),
  });

  await queryClient.ensureQueryData({
    queryKey: ['fetchGroup', params.groupId],
    queryFn: () => getData({ url: `/groups/${params.groupId}` }),
  });

  const resp = await queryClient.ensureQueryData({
    queryKey: ['fetchMember', params.groupId],
    queryFn: () => fetchOnlyData({ url: `/members/${params.groupId}` }),
  });

  if (!['admin', 'owner'].includes(resp.member.role)) {
    return redirect(`/account/manage-group/view/${params.groupId}`);
  }

  return null;
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await extractFormData(request);
  const data = { ...formData, groupRef: params.groupId };

  return postData({
    url: `/approvals`,
    data,
    invalidate: ['fetchGroup'],
    setToast: true,
  });
};
