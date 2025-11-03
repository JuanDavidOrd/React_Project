import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UsersList from './features/users/UsersList';
import UserEdit from './features/users/UserEdit';
import ProfilesList from './features/profiles/ProfilesList';
import ProfileEdit from './features/profiles/ProfileEdit';
import SessionsList from './features/sessions/SessionsList';
import SessionEdit from './features/sessions/SessionEdit';
import UserRolesList from './features/user-roles/UserRolesList';
import UserRoleEdit from './features/user-roles/UserRoleEdit';
import AddressesList from './features/addresses/AddressesList';
import DigitalSignaturesList from './features/digital-signatures/DigitalSignaturesList';
import DevicesList from './features/devices/DevicesList';
import PasswordsList from './features/passwords/PasswordsList';
import SecurityQuestionsList from './features/security-questions/SecurityQuestionsList';
import AnswersList from './features/answers/AnswersList';
import RolesList from './features/roles/RolesList';
import PermissionsList from './features/permissions/PermissionsList';
import RolePermissionsList from './features/role-permissions/RolePermissionsList';
import PermissionEdit from './features/permissions/PermissionEdit';
import RoleEdit from './features/roles/RoleEdit';
import DeviceEdit from './features/devices/DeviceEdit';
import AddressEdit from './features/addresses/AddressEdit';
import SecurityQuestionEdit from './features/security-questions/SecurityQuestionEdit';
import AnswerEdit from './features/answers/AnswerEdit';
import PasswordEdit from './features/passwords/PasswordEdit';
import RolePermissionEdit from './features/role-permissions/RolePermissionEdit';
import DigitalSignatureEdit from './features/digital-signatures/DigitalSignatureEdit';
import ProfileView from './features/profiles/ProfileView';
import ProfileUpdateMock from './features/profiles/ProfileUpdateMock';
import AddressCreateMock from './features/addresses/AddressCreateMock';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <UsersList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/:id"
        element={
          <ProtectedRoute>
            <UserEdit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profiles"
        element={
          <ProtectedRoute>
            <ProfilesList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profiles/:id"
        element={
          <ProtectedRoute>
            <ProfileEdit />
          </ProtectedRoute>
        }
      />
      <Route path="/profile/:id" element={<ProtectedRoute><ProfileView /></ProtectedRoute>} />
      <Route path="/profile/update/:id" element={<ProtectedRoute><ProfileUpdateMock /></ProtectedRoute>} />
      <Route
        path="/sessions"
        element={
          <ProtectedRoute>
            <SessionsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sessions/:id"
        element={
          <ProtectedRoute>
            <SessionEdit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-roles"
        element={
          <ProtectedRoute>
            <UserRolesList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-roles/:id"
        element={
          <ProtectedRoute>
            <UserRoleEdit />
          </ProtectedRoute>
        }
      />
      <Route path="/addresses" element={<ProtectedRoute><AddressesList /></ProtectedRoute>} />
      <Route path="/addresses/create" element={<ProtectedRoute><AddressCreateMock /></ProtectedRoute>} />
      <Route path="/addresses/:id" element={<ProtectedRoute><AddressEdit /></ProtectedRoute>} />
      <Route path="/digital-signatures" element={<ProtectedRoute><DigitalSignaturesList /></ProtectedRoute>} />
      <Route path="/digital-signatures/:id" element={<ProtectedRoute><DigitalSignatureEdit /></ProtectedRoute>} />
      <Route path="/devices" element={<ProtectedRoute><DevicesList /></ProtectedRoute>} />
      <Route path="/devices/:id" element={<ProtectedRoute><DeviceEdit /></ProtectedRoute>} />
      <Route path="/passwords" element={<ProtectedRoute><PasswordsList /></ProtectedRoute>} />
      <Route path="/passwords/:id" element={<ProtectedRoute><PasswordEdit /></ProtectedRoute>} />
      <Route path="/security-questions" element={<ProtectedRoute><SecurityQuestionsList /></ProtectedRoute>} />
      <Route path="/security-questions/:id" element={<ProtectedRoute><SecurityQuestionEdit /></ProtectedRoute>} />
      <Route path="/answers" element={<ProtectedRoute><AnswersList /></ProtectedRoute>} />
      <Route path="/answers/:id" element={<ProtectedRoute><AnswerEdit /></ProtectedRoute>} />
      <Route path="/roles" element={<ProtectedRoute><RolesList /></ProtectedRoute>} />
      <Route path="/roles/:id" element={<ProtectedRoute><RoleEdit /></ProtectedRoute>} />
      <Route path="/permissions" element={<ProtectedRoute><PermissionsList /></ProtectedRoute>} />
      <Route path="/permissions/:id" element={<ProtectedRoute><PermissionEdit /></ProtectedRoute>} />
      <Route path="/role-permissions" element={<ProtectedRoute><RolePermissionsList /></ProtectedRoute>} />
      <Route path="/role-permissions/:id" element={<ProtectedRoute><RolePermissionEdit /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
