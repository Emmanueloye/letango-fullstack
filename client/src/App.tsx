import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import LandingLayout from './layouts/LandingLayout';
import Register, { action as signUpAction } from './pages/auth/Register';
import Login, { action as LoginAction } from './pages/auth/Login';
import VerifyEmail from './pages/auth/VerifyEmail';
import OTPValidation, {
  action as OTPValidationAction,
} from './pages/auth/OTPValidation';
import ResetPasswordLink, {
  action as forgetPasswordAction,
} from './pages/auth/ResetPasswordLink';
import PasswordReset, {
  action as resetPasswordAction,
} from './pages/auth/PasswordReset';
import DashBoardLayout, {
  loader as dashboardLoader,
} from './layouts/DashBoardLayout';
import Profile from './pages/auth/Profile';
import ProfileLayout from './layouts/ProfileLayout';
import ProfileUpdate, {
  action as profileUpdateAction,
} from './pages/auth/ProfileUpdate';
import PasswordUpdate, {
  action as updatePasswordAction,
} from './pages/auth/PasswordUpdate';
import Dashboard from './pages/Dashboard';
import ManageGroup, {
  loader as manageGroupLoader,
} from './pages/userGroupMgt/ManageGroup';
import CreateGroup, {
  action as createGroupAction,
} from './pages/userGroupMgt/CreateGroup';
import KYC from './pages/userGroupMgt/KYC';
import PersonalWallet from './pages/wallet/PersonalWallet';
import WalletTransaction from './pages/wallet/WalletTransaction';
import EditGroup, {
  loader as editGroupLoader,
  action as editGroupAction,
} from './pages/userGroupMgt/EditGroup';
import GroupView, {
  loader as groupViewLoader,
} from './pages/userGroupMgt/GroupView';
import CreateGroupRules from './pages/userGroupMgt/CreateGroupRules';
import ViewGroupRules from './pages/userGroupMgt/ViewGroupRules';
import GroupReportLanding, {
  loader as groupReportLanding,
} from './pages/report/GroupReportLanding';
import GroupTransactions, {
  loader as groupTransactionLoader,
} from './pages/report/GroupTransactions';
import GroupStatement, {
  loader as groupStatementLoader,
} from './pages/report/GroupStatement';
import UserManager, {
  loader as userManagerLoader,
  action as userManagerAction,
} from './pages/admin/usersManager/UserManager';
import GroupManager from './pages/admin/groupManager/GroupManager';
import OpenWithdrawals from './pages/admin/withdrawals/OpenWithdrawals';
import ClosedWithdrawals from './pages/admin/withdrawals/ClosedWithdrawals';
import Statements from './pages/report/Statements';
import EditUser, {
  loader as adminEditUserLoader,
  action as adminEditUserAction,
} from './pages/admin/usersManager/EditUser';
import ViewUser, {
  loader as viewUserLoader,
} from './pages/admin/usersManager/ViewUser';
import EditAdminGroup from './pages/admin/groupManager/EditAdminGroup';
import ViewAdminGroup from './pages/admin/groupManager/ViewAdminGroup';
import WithdrawalLanding from './pages/admin/withdrawals/WithdrawalLanding';
import PendingWithdrawals from './pages/admin/withdrawals/PendingWithdrawals';
import KYCReview from './pages/admin/usersManager/KYCReview';
import ReportUser from './pages/userGroupMgt/ReportUser';
import HomeError from './pages/HomeError';
import DashboardError from './pages/DashboardError';
import Contribute, {
  action as contributeAction,
} from './pages/wallet/Contribute';
import PaymentConfirmation, {
  loader as paymentConfirmationLoader,
} from './pages/wallet/PaymentConfirmation';
import TransactionDetails from './pages/wallet/TransactionDetails';
import PersonalTransfer, {
  loader as personalTransferLoader,
  action as personalTransferAction,
} from './pages/wallet/PersonalTransfer';
import TransferLanding from './pages/wallet/TransferLanding';
import AddBeneficiary, {
  action as addBeneficiaryAction,
} from './pages/wallet/AddBeneficiary';
import GroupContribute, {
  loader as groupContributeLoader,
  action as groupContributeAction,
} from './pages/userGroupMgt/GroupContribute';
import GroupPaymentConfirm, {
  loader as groupPaymentConfirmLoader,
} from './pages/userGroupMgt/GroupPaymentConfirm';
import JoinGroup, {
  action as joinGroupAction,
} from './pages/userGroupMgt/JoinGroup';
import MembersList, {
  loader as memberListLoader,
} from './pages/userGroupMgt/MembersList';
import FundHeadLanding, {
  loader as fundHeadLandingLoader,
} from './pages/userGroupMgt/FundHeadLanding';
import CreateFundHead, {
  loader as createFundHeadLoader,
  action as createFundHeaderLoader,
} from './pages/userGroupMgt/CreateFundHead';
import EditFundHead, {
  loader as editFundHeadLoader,
  action as editFundHeadAction,
} from './pages/userGroupMgt/EditFundHead';
import AddGroupBeneficiary from './pages/userGroupMgt/AddGroupBeneficiary';
import MyPledge from './pages/userGroupMgt/MyPledge';
import GroupWithdrawalLanding, {
  loader as groupWithdrawalLandingLoader,
} from './pages/userGroupMgt/GroupWithdrawalLanding';
import GroupWithdrawal, {
  action as groupWithdrawalAction,
} from './pages/userGroupMgt/GroupWithdrawal';
import GroupPendingWithdrawals, {
  loader as groupPendingWithdrawalsLoader,
  action as groupPendingWithdrawalAction,
} from './pages/userGroupMgt/GroupPendingWithdrawals';
import GroupApprovedWithdrawals, {
  loader as groupApprovedWithdrawalLoader,
} from './pages/userGroupMgt/GroupApprovedWithdrawals';
import GroupRejectedWithdrawals, {
  loader as groupRejectWithdrawalLoader,
} from './pages/userGroupMgt/GroupRejectedWithdrawals';
import GroupApprovalAuths, {
  loader as approvalAuthLoader,
  action as approvalAuthAction,
} from './pages/userGroupMgt/GroupApprovalAuths';
import UpdateApprovalAuths, {
  action as updateApprovalAuthsAction,
} from './pages/userGroupMgt/UpdateApprovalAuths';
import GroupContributionReport, {
  loader as groupContributionReportLoader,
} from './pages/report/GroupContributionReport';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingLayout />,
    errorElement: <HomeError />,
    children: [
      { index: true, element: <Home /> },
      { path: 'signup', element: <Register />, action: signUpAction },
      { path: 'login', element: <Login />, action: LoginAction },
      {
        path: 'login/otp',
        element: <OTPValidation />,
        action: OTPValidationAction,
      },
      { path: 'verify-email', element: <VerifyEmail /> },
      {
        path: 'forget-password',
        element: <ResetPasswordLink />,
        action: forgetPasswordAction,
      },
      {
        path: 'reset-password',
        element: <PasswordReset />,
        action: resetPasswordAction,
      },
      {
        path: 'join/:groupName',
        element: <JoinGroup />,
        action: joinGroupAction,
      },
    ],
  },
  {
    path: '/account',
    element: <DashBoardLayout />,
    loader: dashboardLoader,
    id: 'user',
    HydrateFallback: () => null, // to stop the hydration warning in react router dom
    errorElement: <DashboardError />, //come back to this as it's not working yet.
    children: [
      { index: true, element: <Dashboard /> },
      {
        path: 'profile',
        element: <ProfileLayout />,
        children: [
          { index: true, element: <Profile /> },
          {
            path: 'edit-profile',
            element: <ProfileUpdate />,
            action: profileUpdateAction,
          },
          {
            path: 'change-password',
            element: <PasswordUpdate />,
            action: updatePasswordAction,
          },
        ],
      },
      {
        path: 'personal-wallet',
        children: [
          { index: true, element: <PersonalWallet /> },
          {
            path: 'contribute/:userRef',
            element: <Contribute />,
            action: contributeAction,
          },
          {
            path: 'transfer',
            children: [
              { index: true, element: <TransferLanding /> },
              {
                path: 'personal',
                element: <PersonalTransfer />,
                loader: personalTransferLoader,
                action: personalTransferAction,
              },
            ],
          },

          {
            path: 'beneficiary/:userRef',
            element: <AddBeneficiary />,
            action: addBeneficiaryAction,
          },
          {
            path: 'contribute/confirm',
            element: <PaymentConfirmation />,
            loader: paymentConfirmationLoader,
          },
          {
            path: 'transactions',
            children: [
              {
                index: true,
                element: <WalletTransaction />,
              },
              {
                path: ':id',
                element: <TransactionDetails />,
              },
            ],
          },
        ],
      },

      {
        path: 'manage-group',

        children: [
          { index: true, element: <ManageGroup />, loader: manageGroupLoader },
          {
            path: 'create-group',
            element: <CreateGroup />,
            action: createGroupAction,
          },
          {
            path: 'update-group/:groupId',
            element: <EditGroup />,
            loader: editGroupLoader,
            action: editGroupAction,
          },
          {
            path: 'view/:groupId',

            children: [
              { index: true, element: <GroupView />, loader: groupViewLoader },
              {
                path: 'contribute',
                element: <GroupContribute />,
                loader: groupContributeLoader,
                action: groupContributeAction,
              },
              {
                path: 'contribute/confirm',
                element: <GroupPaymentConfirm />,
                loader: groupPaymentConfirmLoader,
              },
              {
                path: 'withdraw',
                children: [
                  {
                    index: true,
                    element: <GroupWithdrawalLanding />,
                    loader: groupWithdrawalLandingLoader,
                  },
                  {
                    path: 'draw',
                    element: <GroupWithdrawal />,
                    action: groupWithdrawalAction,
                  },
                  {
                    path: 'pending',
                    element: <GroupPendingWithdrawals />,
                    loader: groupPendingWithdrawalsLoader,
                    action: groupPendingWithdrawalAction,
                  },
                  {
                    path: 'approved',
                    element: <GroupApprovedWithdrawals />,
                    loader: groupApprovedWithdrawalLoader,
                  },
                  {
                    path: 'rejected',
                    element: <GroupRejectedWithdrawals />,
                    loader: groupRejectWithdrawalLoader,
                  },
                ],
              },

              {
                path: 'members',
                element: <MembersList />,
                loader: memberListLoader,
              },
              {
                path: 'fund-heads',
                children: [
                  {
                    index: true,
                    element: <FundHeadLanding />,
                    loader: fundHeadLandingLoader,
                  },
                  {
                    path: 'create',
                    element: <CreateFundHead />,
                    loader: createFundHeadLoader,
                    action: createFundHeaderLoader,
                  },
                  {
                    path: 'edit/:headId',
                    element: <EditFundHead />,
                    loader: editFundHeadLoader,
                    action: editFundHeadAction,
                  },
                ],
              },
              {
                path: 'approvals',
                children: [
                  {
                    index: true,
                    element: <GroupApprovalAuths />,
                    loader: approvalAuthLoader,
                    action: approvalAuthAction,
                  },
                  {
                    path: ':id',
                    element: <UpdateApprovalAuths />,
                    action: updateApprovalAuthsAction,
                  },
                ],
              },
              { path: 'manage-rules', element: <CreateGroupRules /> },
              { path: 'view-rules', element: <ViewGroupRules /> },
              { path: 'beneficiaries', element: <AddGroupBeneficiary /> },
              {
                path: 'my-pledge',
                children: [
                  { index: true, element: <MyPledge /> },
                  { path: 'create', element: <p>create pledge</p> },
                ],
              },
              {
                path: 'reports',
                children: [
                  {
                    index: true,
                    element: <GroupReportLanding />,
                    loader: groupReportLanding,
                  },
                  {
                    path: 'transaction',
                    element: <GroupTransactions />,
                    loader: groupTransactionLoader,
                  },
                  {
                    path: 'statement',
                    element: <GroupStatement />,
                    loader: groupStatementLoader,
                  },
                  {
                    path: 'contributions',
                    element: <GroupContributionReport />,
                    loader: groupContributionReportLoader,
                  },
                ],
              },
            ],
          },
        ],
      },
      { path: 'kyc', element: <KYC /> },
      { path: 'report-user', element: <ReportUser /> },
      {
        path: 'admin',
        children: [
          { index: true, element: <p>admin</p> },
          {
            path: 'user-manager',
            children: [
              {
                index: true,
                element: <UserManager />,
                loader: userManagerLoader,
                action: userManagerAction,
              },
              {
                path: 'edit/:id',
                element: <EditUser />,
                loader: adminEditUserLoader,
                action: adminEditUserAction,
              },
              {
                path: 'view/:id',
                element: <ViewUser />,
                loader: viewUserLoader,
              },
            ],
          },
          {
            path: 'group-manager',
            children: [
              { index: true, element: <GroupManager /> },
              { path: 'edit/:id', element: <EditAdminGroup /> },
              { path: 'view/:id', element: <ViewAdminGroup /> },
            ],
          },
          {
            path: 'withdrawals',
            children: [
              { index: true, element: <WithdrawalLanding /> },
              { path: 'open', element: <OpenWithdrawals /> },
              { path: 'closed', element: <ClosedWithdrawals /> },
              { path: 'pending', element: <PendingWithdrawals /> },
              { path: 'closed-withdrawals', element: <ClosedWithdrawals /> },
            ],
          },

          { path: 'kyc-review', element: <KYCReview /> },
          { path: 'statement', element: <Statements /> },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
