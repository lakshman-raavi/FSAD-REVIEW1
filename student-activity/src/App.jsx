import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import { DataProvider } from './context/DataContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';

// Lazy pages
const LandingPage = lazy(() => import('./pages/LandingPage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout.jsx'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'));
const Events = lazy(() => import('./pages/admin/Events.jsx'));
const AdminCalendarView = lazy(() => import('./pages/admin/AdminCalendarView.jsx'));
const AttendanceManager = lazy(() => import('./pages/admin/AttendanceManager.jsx'));
const Reports = lazy(() => import('./pages/admin/Reports.jsx'));
const Students = lazy(() => import('./pages/admin/Students.jsx'));
const Settings = lazy(() => import('./pages/admin/Settings.jsx'));
const StudentLayout = lazy(() => import('./layouts/StudentLayout.jsx'));
const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard.jsx'));
const EventBrowser = lazy(() => import('./pages/student/EventBrowser.jsx'));
const StudentProfile = lazy(() => import('./pages/student/StudentProfile.jsx'));
const StudentCalendarView = lazy(() => import('./pages/student/StudentCalendarView.jsx'));

const Loader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100%', background: 'var(--bg-primary)' }}>
    <div style={{ textAlign: 'center' }}>
      <div className="spinner dark" style={{ width: 40, height: 40, borderWidth: 3 }}></div>
      <p style={{ marginTop: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Loading ActivityHub...</p>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <DataProvider>
            <BrowserRouter>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3500,
                  style: { background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '10px', boxShadow: 'var(--shadow-lg)', fontSize: '0.875rem' },
                  success: { iconTheme: { primary: '#10b981', secondary: 'white' } },
                  error: { iconTheme: { primary: '#ef4444', secondary: 'white' } },
                }}
              />
              <Suspense fallback={<Loader />}>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />

                  {/* Admin Routes */}
                  <Route path="/admin" element={
                    <ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>
                  }>
                    <Route index element={<AdminDashboard />} />
                    <Route path="events" element={<Events />} />
                    <Route path="calendar" element={<AdminCalendarView />} />
                    <Route path="attendance/:eventId" element={<AttendanceManager />} />
                    <Route path="attendance-view" element={<Events attendanceMode={true} />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="students" element={<Students />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>

                  {/* Student Routes */}
                  <Route path="/student" element={
                    <ProtectedRoute role="student"><StudentLayout /></ProtectedRoute>
                  }>
                    <Route index element={<StudentDashboard />} />
                    <Route path="events" element={<EventBrowser />} />
                    <Route path="profile" element={<StudentProfile />} />
                    <Route path="calendar" element={<StudentCalendarView />} />
                  </Route>

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
              <ScrollToTop />
            </BrowserRouter>
          </DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
