import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import LandingLayout from './layouts/LandingLayout';
import Register, { action as signUpAction } from './pages/auth/Register';
import Login, { action as LoginAction } from './pages/auth/Login';
import VerifyEmail from './pages/auth/VerifyEmail';
import OTPValidation, {
  action as OTPValidationAction,
} from './pages/auth/OTPValidation';
import DashBoardLayout from './layouts/DashBoardLayout';
import Profile from './pages/auth/Profile';
import ProfileLayout from './layouts/ProfileLayout';
import ProfileUpdate from './pages/auth/ProfileUpdate';
import PasswordUpdate from './pages/auth/PasswordUpdate';
import ResetPasswordLink from './pages/auth/ResetPasswordLink';
import PasswordReset from './pages/auth/PasswordReset';
import Dashboard from './pages/Dashboard';
import ManageGroup from './pages/userGroupMgt/ManageGroup';
import CreateGroup from './pages/userGroupMgt/CreateGroup';
import KYC from './pages/userGroupMgt/KYC';
import PersonalWallet from './pages/wallet/PersonalWallet';
import WalletTransaction from './pages/wallet/WalletTransaction';
import TransactionFlow from './pages/wallet/TransactionFlow';
import EditGroup from './pages/userGroupMgt/EditGroup';
import GroupView from './pages/userGroupMgt/GroupView';
import CreateGroupRules from './pages/userGroupMgt/CreateGroupRules';
import ViewGroupRules from './pages/userGroupMgt/ViewGroupRules';
import BeneficiaryDetails from './pages/userGroupMgt/BeneficiaryDetails';
import GroupReportLanding from './pages/report/GroupReportLanding';
import GroupTransactions from './pages/report/GroupTransactions';
import GroupStatement from './pages/report/GroupStatement';
import UserManager from './pages/admin/usersManager/UserManager';
import GroupManager from './pages/admin/groupManager/GroupManager';
import OpenWithdrawals from './pages/admin/withdrawals/OpenWithdrawals';
import ClosedWithdrawals from './pages/admin/withdrawals/ClosedWithdrawals';
import Statements from './pages/report/Statements';
import EditUser from './pages/admin/usersManager/EditUser';
import ViewUser from './pages/admin/usersManager/ViewUser';
import EditAdminGroup from './pages/admin/groupManager/EditAdminGroup';
import ViewAdminGroup from './pages/admin/groupManager/ViewAdminGroup';
import WithdrawalLanding from './pages/admin/withdrawals/WithdrawalLanding';
import PendingWithdrawals from './pages/admin/withdrawals/PendingWithdrawals';
import KYCReview from './pages/admin/usersManager/KYCReview';
import ReportUser from './pages/userGroupMgt/ReportUser';
import HomeError from './pages/HomeError';
import DashboardError from './pages/DashboardError';

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
      { path: 'forget-password', element: <ResetPasswordLink /> },
      { path: 'reset-password', element: <PasswordReset /> },
    ],
  },
  {
    path: '/account',
    element: <DashBoardLayout />,
    errorElement: <DashboardError />, //come back to this as it's not working yet.
    children: [
      { index: true, element: <Dashboard /> },
      {
        path: 'profile',
        element: <ProfileLayout />,
        children: [
          { index: true, element: <Profile /> },
          { path: 'edit-profile', element: <ProfileUpdate /> },
          { path: 'change-password', element: <PasswordUpdate /> },
        ],
      },
      {
        path: 'personal-wallet',
        children: [
          { index: true, element: <PersonalWallet /> },
          {
            path: 'transactions',
            element: <WalletTransaction />,
          },
          { path: 'inflows', element: <TransactionFlow /> },
          { path: 'outflows', element: <TransactionFlow /> },
        ],
      },
      {
        path: 'manage-group',

        children: [
          { index: true, element: <ManageGroup /> },
          { path: 'create-group', element: <CreateGroup /> },
          { path: 'update-group/:groupId', element: <EditGroup /> },
          {
            path: 'view/:groupId',

            children: [
              { index: true, element: <GroupView /> },
              { path: 'manage-rules', element: <CreateGroupRules /> },
              { path: 'view-rules', element: <ViewGroupRules /> },
              { path: 'beneficiaries', element: <BeneficiaryDetails /> },
              {
                path: 'reports',
                children: [
                  { index: true, element: <GroupReportLanding /> },
                  { path: 'transaction', element: <GroupTransactions /> },
                  { path: 'statement', element: <GroupStatement /> },
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
              { index: true, element: <UserManager /> },
              { path: 'edit/:id', element: <EditUser /> },
              {
                path: 'view/:id',
                element: <ViewUser />,
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
            ],
          },
          { path: 'closed-withdrawals', element: <ClosedWithdrawals /> },
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
