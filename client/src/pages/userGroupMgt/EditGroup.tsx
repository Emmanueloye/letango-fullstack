import EditGroupForm from '../../components/DashboardComponents/EditGroupForm';
import LinkBtn from '../../components/UI/LinkBtn';

const EditGroup = () => {
  return (
    <>
      <div className='flex justify-end'>
        <LinkBtn btnText='Back' url='/account/manage-group' />
      </div>
      <EditGroupForm />;
    </>
  );
};

export default EditGroup;
