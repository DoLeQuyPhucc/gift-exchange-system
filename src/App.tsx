import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, Navigate, Outlet } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import ECommerce from './pages/Dashboard/ECommerce';
import DefaultLayout from './layout/DefaultLayout';
import AuthLayout from './layout/AuthLayout';
import ProductDashboard from './pages/Products/Products';
import NotFound from './pages/NotFound/NotFound';
import Reports from './pages/Reports/Reports';
import Campaign from './pages/Campaign/Campaign';
import CreateCampaign from './pages/Campaign/CreateCampaign';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/auth/signin" replace />;
  }

  // Redirect based on role
  if (role === 'Admin' && window.location.pathname === '/') {
    return <Navigate to="/products" replace />;
  }

  if (role === 'Staff' && window.location.pathname === '/') {
    return <Navigate to="/calendar" replace />;
  }

  return (
    <DefaultLayout>
      <Outlet />
    </DefaultLayout>
  );
};

// Component để kiểm tra Auth routes
const AuthRoute = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (token) {
    // Redirect to appropriate dashboard based on role
    if (role === 'Admin') {
      return <Navigate to="/products" replace />;
    }
    if (role === 'Staff') {
      return <Navigate to="/calendar" replace />;
    }
  }

  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
};

const RoleBasedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const role = localStorage.getItem('role');

  if (!role || !allowedRoles.includes(role)) {
    // Redirect về trang mặc định của role
    if (role === 'Staff') {
      return <Navigate to="/campaigns" replace />;
    }
    if (role === 'Admin') {
      return <Navigate to="/products" replace />;
    }
  }

  return <Outlet />;
};

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthRoute />}>
        <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Signin | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <SignIn />
            </>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <>
              <PageTitle title="Signup | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <SignUp />
            </>
          }
        />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        {/* Admin Only Routes */}
        <Route element={<RoleBasedRoute allowedRoles={['Admin']} />}>
          <Route
            path="/products"
            element={
              <>
                <PageTitle title="Products | Admin Dashboard" />
                <ProductDashboard />
              </>
            }
          />
          <Route
            path="/reports"
            element={
              <>
                <PageTitle title="Reports | Admin Dashboard" />
                <Reports />
              </>
            }
          />

          <Route
            path="/"
            element={
              <>
                <PageTitle title="Dashboard | Admin Dashboard" />
                <ECommerce />
              </>
            }
          />
        </Route>

        {/* Staff Only Routes */}
        <Route element={<RoleBasedRoute allowedRoles={['Staff']} />}>
          <Route
            path="/calendar"
            element={
              <>
                <PageTitle title="Calendar | Staff Dashboard" />
                <Calendar />
              </>
            }
          />
        </Route>

        {/* Admin and Staff Routes */}
        <Route element={<RoleBasedRoute allowedRoles={['Staff', 'Admin']} />}>
          <Route
            path="/campaigns"
            element={
              <>
                <PageTitle title="Campaign | Staff Dashboard" />
                <Campaign />
              </>
            }
          />
          <Route
            path="/create-campaign"
            element={
              <>
                <PageTitle title="Campaign | Staff Dashboard" />
                <CreateCampaign />
              </>
            }
          />
        </Route>
      </Route>

      {/* Not Found Route */}
      <Route
        path="*"
        element={
          <>
            <PageTitle title="404 | Page Not Found" />
            <NotFound />
          </>
        }
      />
    </Routes>
  );
}

export default App;
