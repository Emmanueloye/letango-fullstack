import { Group, Member } from '../../dtos/groupDto';
import Button from '../UI/Button';
import LinkBtn from '../UI/LinkBtn';

const GroupActionsLinks = ({
  roles,
  member,
  group,
  showLink,
  setShowLink,
  newMemberCount,
}: {
  roles: string[];
  member: Member;
  group: Group;
  showLink: boolean;
  setShowLink: (data: boolean) => void;
  newMemberCount: number;
}) => {
  return (
    <div className='flex flex-wrap gap-3 mt-4 text-sm'>
      <LinkBtn
        btnText='contribute'
        url={`/account/manage-group/view/${group?.groupRef}/contribute`}
      />
      {roles.includes(member?.role) && (
        <LinkBtn
          btnText='withdrawal'
          url={`/account/manage-group/view/${group?.groupRef}/withdraw`}
        />
      )}
      {roles.includes(member?.role) && (
        <LinkBtn
          btnText={`Admission (${newMemberCount})`}
          url={`/account/manage-group/view/${group?.groupRef}/admission`}
        />
      )}
      <LinkBtn
        btnText='members'
        url={`/account/manage-group/view/${group?.groupRef}/members`}
      />
      <div onClick={() => setShowLink(!showLink)}>
        <Button btnText='invite' btnType='button' />
      </div>

      {/* <LinkBtn
    btnText='beneficiaries'
    url={`/account/manage-group/view/${group?.groupRef}/beneficiaries`}
  /> */}
      {roles.includes(member?.role) && (
        <LinkBtn
          btnText='approvals'
          url={`/account/manage-group/view/${group?.groupRef}/approvals`}
        />
      )}
      {roles.includes(member?.role) && (
        <LinkBtn
          btnText='fund class'
          url={`/account/manage-group/view/${group?.groupRef}/fund-heads`}
        />
      )}
      {/* <LinkBtn
        btnText='My pledge'
        url={`/account/manage-group/view/${group?.groupRef}/my-pledge`}
      /> */}
    </div>
  );
};

export default GroupActionsLinks;
