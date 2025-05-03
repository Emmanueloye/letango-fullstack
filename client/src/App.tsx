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
import ManageGroup from './pages/userGroupMgt/ManageGroup';
import CreateGroup from './pages/userGroupMgt/CreateGroup';
import KYC from './pages/userGroupMgt/KYC';
import PersonalWallet from './pages/wallet/PersonalWallet';
import WalletTransaction, {
  action as walletTransactionAction,
} from './pages/wallet/WalletTransaction';
import TransactionFlow from './pages/wallet/TransactionFlow';
import EditGroup from './pages/userGroupMgt/EditGroup';
import GroupView from './pages/userGroupMgt/GroupView';
import CreateGroupRules from './pages/userGroupMgt/CreateGroupRules';
import ViewGroupRules from './pages/userGroupMgt/ViewGroupRules';
import BeneficiaryDetails from './pages/userGroupMgt/BeneficiaryDetails';
import GroupReportLanding from './pages/report/GroupReportLanding';
import GroupTransactions from './pages/report/GroupTransactions';
import GroupStatement from './pages/report/GroupStatement';
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
                action: walletTransactionAction,
              },
              {
                path: ':id',
                element: <TransactionDetails />,
              },
            ],
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
