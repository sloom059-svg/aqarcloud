import React from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ProtectedRoute from '@/components/ProtectedRoute';

import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Dashboard from '@/pages/Dashboard';
import AddProperty from '@/pages/AddProperty';
import EditProperty from '@/pages/EditProperty';
import PropertyDetail from '@/pages/PropertyDetail';
import Profile from '@/pages/Profile';
import AgentProfile from '@/pages/AgentProfile';
import AppLayout from '@/components/layout/AppLayout';
import CompleteProfile from '@/pages/CompleteProfile';
import CheckProfile from '@/pages/CheckProfile';
import VenueDashboard from '@/pages/VenueDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import VenueForm from '@/pages/VenueForm';
import VenueWizard from '@/pages/VenueWizard';
import VenueBookings from '@/pages/VenueBookings';
import VenuePublicPage from '@/pages/VenuePublicPage';

const AuthenticatedApp = () => {
  const { user, isAuthenticated, isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // توجيه فوري: عضو داخل بدون ملف مكتمل → فورم الإكمال
  React.useEffect(() => {
    if (isLoadingAuth || !isAuthenticated || !user) return;
    const path = window.location.pathname;
    const publicPaths = ['/login','/register','/forgot-password','/reset-password','/complete-profile','/check-profile'];
    const isPublicView = publicPaths.includes(path) || path.startsWith('/agent/') || path.startsWith('/property/') || path.startsWith('/place/');
    if (!user.office_name && !isPublicView) {
      window.location.replace('/complete-profile');
    }
  }, [user, isAuthenticated, isLoadingAuth]);

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    }
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Public pages */}
      <Route path="/check-profile" element={<CheckProfile />} />
      <Route path="/complete-profile" element={<CompleteProfile />} />
      <Route path="/agent/:id" element={<AgentProfile />} />
      <Route path="/property/:id" element={<PropertyDetail />} />
      <Route path="/place/:slug" element={<VenuePublicPage />} />

      {/* Protected pages */}
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-property" element={<AddProperty />} />
          <Route path="/edit-property/:id" element={<EditProperty />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        {/* Venue routes - no AppLayout */}
        <Route path="/venue" element={<VenueDashboard />} />
        <Route path="/venue/add" element={<VenueWizard />} />
        <Route path="/venue/edit/:id" element={<VenueForm />} />
        <Route path="/venue/bookings/:id" element={<VenueBookings />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
