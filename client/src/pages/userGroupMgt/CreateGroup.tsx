import CreateGroupForm from '../../components/DashboardComponents/CreateGroupForm';
import LinkBtn from '../../components/UI/LinkBtn';

const CreateGroup = () => {
  return (
    <>
      <div className='flex justify-end'>
        <LinkBtn btnText='Back' url='/account/manage-group' />
      </div>
      <CreateGroupForm />;
    </>
  );
};

export default CreateGroup;
