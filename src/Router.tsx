import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { UserProfile, CitizenTab, WorkerTab, AdminTab } from './types';

// Lazy load pages for better performance
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const CitizenPortal = React.lazy(() => import('./pages/CitizenPortal'));
const WorkerPortal = React.lazy(() => import('./pages/WorkerPortal'));
const AdminPortal = React.lazy(() => import('./pages/AdminPortal'));
const FAQContact = React.lazy(() => import('./pages/FAQContact'));
const SmartCityOS = React.lazy(() => import('./pages/SmartCityOS'));

interface ProtectedRouteProps {
  user: UserProfile | null;
  allowedRoles?: UserProfile['role'][];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, allowedRoles }) => {
  if (!user) {
    // If user is not logged in, redirect to landing page
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user does not have the required role, redirect to their default dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

interface AppRouterProps {
  user: UserProfile | null;
  addNotification: (notif: { title: string; desc: string; type: 'info' | 'warn' | 'success' }) => void;
  handleEarnPoints: (amount: number) => void;
  citizenTab: CitizenTab;
  setCitizenTab: (tab: CitizenTab) => void;
  workerTab: WorkerTab;
  setWorkerTab: (tab: WorkerTab) => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  faqInitialView: 'faq' | 'about' | 'privacy' | 'terms';
}

const AppRouter: React.FC<AppRouterProps> = ({
  user,
  addNotification,
  handleEarnPoints,
  citizenTab, setCitizenTab,
  workerTab, setWorkerTab,
  adminTab, setAdminTab,
  faqInitialView
}) => {

  const renderDashboard = () => {
    if (!user) return <Navigate to="/" replace />;

    switch (user.role) {
      case 'citizen':
        return <CitizenPortal
          user={user}
          bins={[]}
          reports={[]}
          onEarnPoints={handleEarnPoints}
          onAddReport={() => {}}
          activeTab={citizenTab}
          onTabChange={setCitizenTab}
        />;
      case 'worker':
        return <WorkerPortal
          tasks={[]}
          onCompleteTask={() => {}}
          bins={[]}
          activeTab={workerTab}
          onTabChange={setWorkerTab}
        />;
      case 'supervisor':
      case 'admin':
        return <AdminPortal
          bins={[]}
          reports={[]}
          tasks={[]}
          onDispatchReport={() => {}}
          onDismissReport={() => {}}
          onAddBin={() => {}}
          onDeleteBin={() => {}}
          activeSubTab={adminTab}
          onSubTabChange={setAdminTab}
        />;
      default:
        return <Navigate to="/" replace />;
    }
  };

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<LandingPage onLaunchPortal={() => { }} onNavigate={() => { }} />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute user={user} />}>
          <Route path="/dashboard" element={renderDashboard()} />
        </Route>

        {/* Admin-Only Routes */}
        <Route element={<ProtectedRoute user={user} allowedRoles={['admin', 'supervisor']} />}>
          <Route path="/command" element={<SmartCityOS />} />
        </Route>

        {/* Static Pages */}
        <Route path="/faq" element={<FAQContact initialView="faq" />} />
        <Route path="/about" element={<FAQContact initialView="about" />} />
        <Route path="/privacy" element={<FAQContact initialView="privacy" />} />
        <Route path="/terms" element={<FAQContact initialView="terms" />} />

        {/* 404 Not Found */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </React.Suspense>
  );
};

export default AppRouter;