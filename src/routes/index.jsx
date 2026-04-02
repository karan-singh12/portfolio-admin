import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PublicRoute from '@/components/auth/PublicRoute';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Lazy load pages
const Login = lazy(() => import('@/pages/auth/Login'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard'));

// Settings
const Settings = lazy(() => import('@/pages/settings/Settings'));
const Profile = lazy(() => import('@/pages/settings/Profile'));

// Blog Management
const BlogList = lazy(() => import('@/pages/blogs/BlogList'));
const BlogAdd = lazy(() => import('@/pages/blogs/BlogAdd'));
const BlogEdit = lazy(() => import('@/pages/blogs/BlogEdit'));

// DSA Problems
const DSAList = lazy(() => import('@/pages/dsa/DSAList'));
const DSAAdd = lazy(() => import('@/pages/dsa/DSAAdd'));
const DSAEdit = lazy(() => import('@/pages/dsa/DSAEdit'));

// Job Experience
const ExperienceList = lazy(() => import('@/pages/experience/ExperienceList'));
const ExperienceAdd = lazy(() => import('@/pages/experience/ExperienceAdd'));
const ExperienceEdit = lazy(() => import('@/pages/experience/ExperienceEdit'));

// Projects
const ProjectList = lazy(() => import('@/pages/projects/ProjectList'));
const ProjectAdd = lazy(() => import('@/pages/projects/ProjectAdd'));
const ProjectEdit = lazy(() => import('@/pages/projects/ProjectEdit'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Settings */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Blog Management */}
        <Route
          path="/blogs"
          element={
            <ProtectedRoute>
              <BlogList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/blogs/add"
          element={
            <ProtectedRoute>
              <BlogAdd />
            </ProtectedRoute>
          }
        />
        <Route
          path="/blogs/edit/:id"
          element={
            <ProtectedRoute>
              <BlogEdit />
            </ProtectedRoute>
          }
        />

        {/* DSA Problems */}
        <Route
          path="/dsa"
          element={
            <ProtectedRoute>
              <DSAList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dsa/add"
          element={
            <ProtectedRoute>
              <DSAAdd />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dsa/edit/:id"
          element={
            <ProtectedRoute>
              <DSAEdit />
            </ProtectedRoute>
          }
        />

        {/* Job Experience */}
        <Route
          path="/experience"
          element={
            <ProtectedRoute>
              <ExperienceList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/experience/add"
          element={
            <ProtectedRoute>
              <ExperienceAdd />
            </ProtectedRoute>
          }
        />
        <Route
          path="/experience/edit/:id"
          element={
            <ProtectedRoute>
              <ExperienceEdit />
            </ProtectedRoute>
          }
        />

        {/* Project Management */}
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <ProjectList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/add"
          element={
            <ProtectedRoute>
              <ProjectAdd />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/edit/:id"
          element={
            <ProtectedRoute>
              <ProjectEdit />
            </ProtectedRoute>
          }
        />

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;

