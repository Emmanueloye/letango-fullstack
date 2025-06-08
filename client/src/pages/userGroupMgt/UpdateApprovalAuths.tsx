/* eslint-disable react-refresh/only-export-components */
import {
  ActionFunctionArgs,
  Form,
  LoaderFunctionArgs,
  redirect,
  useActionData,
  useParams,
} from 'react-router-dom';
import Button from '../../components/UI/Button';
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

const UpdateApprovalAuths = () => {
  const params = useParams();
  const [selectedMember, setSelectedMember] = useState<{ role: string }>({
    role: '',
  });
  const action = useActionData() as FormActionType;

  const { data } = useQuery({
    queryKey: ['fetchGroup', params.groupId],
    queryFn: () => getData({ url: `/groups/${params.groupId}` }),
  });

  const { data: memberList } = useQuery({
    queryKey: ['fetchMemberList', params.groupId],
    queryFn: () =>
      getData({
        url: `/members/group-members?groupRef=${params.groupId}`,
      }),
  });

  const oldApprovalAuth = data?.group.approvalAuthorities.find(
    (item: { _id: string }) => item._id === params.id
  );

  const handleSelectedMember = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const member = memberList?.members?.find(
      (item: { memberId: { _id: string } }) => {
        return item.memberId._id === e.target.value;
      }
    );

    setSelectedMember(member);
  };

  return (
    <section>
      <div className='flex justify-end mb-3'>
        <LinkBtn
          btnText='Back'
          url={`/account/manage-group/view/${params.groupId}/approvals`}
        />
      </div>
      <Form
        id='approvalAuthorityForm'
        method='post'
        className='w-full md:w-3/5 mx-auto'
      >
        <Title title='update approval authority' />

        {/* form error */}
        {action?.status === 'fail' && <FormError error={action?.message} />}
        {/* form inputs for old approval authorities */}
        <div className='mb-2'>
          <label htmlFor='oldApprovalAuthority'>current authority</label>
          <input
            type='text'
            id='oldApprovalAuthority'
            value={`${oldApprovalAuth?.surname || ''} ${
              oldApprovalAuth?.otherNames || ''
            }`}
            className='capitalize'
            onChange={() => {}}
          />
          <input
            type='text'
            name='oldApprovalAuthority'
            hidden
            defaultValue={oldApprovalAuth?._id}
          />
        </div>
        {/* New approval authority */}
        <div>
          <label htmlFor='approvalAuthority'>current authority</label>
          <select
            id='approvalAuthority'
            name='approvalAuthority'
            className='mb-4 capitalize'
            onChange={handleSelectedMember}
          >
            <option value='' hidden>
              Select member
            </option>
            {memberList?.members.map(
              (item: { memberId: { _id: string }; memberName: string }) => {
                return (
                  <option value={item?.memberId?._id} key={item?.memberId?._id}>
                    {item?.memberName}
                  </option>
                );
              }
            )}
          </select>
        </div>

        <p className='block w-full py-2 px-4 outline-0 border border-gray-300 rounded-md dark:text-slate-50 capitalize mb-4 h-10'>
          {selectedMember?.role}
        </p>
        <Button btnText='save' btnType='submit' />
      </Form>
    </section>
  );
};

export default UpdateApprovalAuths;

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
  console.log(data);

  return postData({
    url: `/approvals/update`,
    data,
    invalidate: ['fetchGroup'],
    setToast: true,
    redirectTo: `/account/manage-group/view/${params.groupId}/approvals`,
  });
};
