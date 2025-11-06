import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

import UsersList from './features/users/UsersList';
import UserEdit from './features/users/UserEdit';

import ProfilesList from './features/profiles/ProfilesList';
import ProfileEdit from './features/profiles/ProfileEdit';
import ProfileView from './features/profiles/ProfileView';
import ProfileUpdateMock from './features/profiles/ProfileUpdateMock';

import SessionsList from './features/sessions/SessionsList';
import SessionEdit from './features/sessions/SessionEdit';

import UserRolesList from './features/user-roles/UserRolesList';
import UserRoleEdit from './features/user-roles/UserRoleEdit';

import AddressesList from './features/addresses/AddressesList';
import AddressEdit from './features/addresses/AddressEdit';
import AddressCreateMock from './features/addresses/AddressCreateMock';

import DevicesList from './features/devices/DevicesList';
import DeviceEdit from './features/devices/DeviceEdit';

import PasswordsList from './features/passwords/PasswordsList';
import PasswordEdit from './features/passwords/PasswordEdit';

import SecurityQuestionsList from './features/security-questions/SecurityQuestionsList';
import SecurityQuestionEdit from './features/security-questions/SecurityQuestionEdit';

import AnswersList from './features/answers/AnswersList';
import AnswerEdit from './features/answers/AnswerEdit';

import RolesList from './features/roles/RolesList';
import RoleEdit from './features/roles/RoleEdit';

import PermissionsList from './features/permissions/PermissionsList';
import PermissionEdit from './features/permissions/PermissionEdit';

import RolePermissionsList from './features/role-permissions/RolePermissionsList';
import RolePermissionEdit from './features/role-permissions/RolePermissionEdit';

import DigitalSignaturesList from './features/digital-signatures/DigitalSignaturesList';
import DigitalSignatureEdit from './features/digital-signatures/DigitalSignatureEdit';

function App() {
  return (
    <Routes>
      {/* Público */}
      <Route path="/login" element={<Login />} />

      {/* Home */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Usuarios */}
      <Route
        path="/users"
        element={<ProtectedRoute><UsersList /></ProtectedRoute>}
      />
      <Route
        path="/users/:id"
        element={<ProtectedRoute><UserEdit /></ProtectedRoute>}
      />

      {/* Perfiles */}
      <Route path="/profiles" element={<ProtectedRoute><ProfilesList /></ProtectedRoute>} />
      <Route path="/profiles/:id" element={<ProtectedRoute><ProfileEdit /></ProtectedRoute>} />
      <Route path="/profile/:id" element={<ProtectedRoute><ProfileView /></ProtectedRoute>} />
      <Route path="/profile/update/:id" element={<ProtectedRoute><ProfileUpdateMock /></ProtectedRoute>} />

      {/* Sesiones */}
      <Route path="/sessions" element={<ProtectedRoute><SessionsList /></ProtectedRoute>} />
      <Route path="/sessions/:id" element={<ProtectedRoute><SessionEdit /></ProtectedRoute>} />

      {/* Roles de usuario */}
      <Route path="/user-roles" element={<ProtectedRoute><UserRolesList /></ProtectedRoute>} />
      <Route path="/user-roles/:id" element={<ProtectedRoute><UserRoleEdit /></ProtectedRoute>} />

      {/* Direcciones */}
      <Route path="/addresses" element={<ProtectedRoute><AddressesList /></ProtectedRoute>} />
      <Route path="/addresses/create" element={<ProtectedRoute><AddressCreateMock /></ProtectedRoute>} />
      <Route path="/addresses/:id" element={<ProtectedRoute><AddressEdit /></ProtectedRoute>} />

      {/* Firmas digitales (IMPORTANTE: /new antes de /:id) */}
      <Route path="/digital-signatures" element={<ProtectedRoute><DigitalSignaturesList /></ProtectedRoute>} />
      <Route path="/digital-signatures/new" element={<ProtectedRoute><DigitalSignatureEdit /></ProtectedRoute>} />
      <Route path="/digital-signatures/:id" element={<ProtectedRoute><DigitalSignatureEdit /></ProtectedRoute>} />

      {/* Dispositivos */}
      <Route path="/devices" element={<ProtectedRoute><DevicesList /></ProtectedRoute>} />
      <Route path="/devices/:id" element={<ProtectedRoute><DeviceEdit /></ProtectedRoute>} />

      {/* Contraseñas */}
      <Route path="/passwords" element={<ProtectedRoute><PasswordsList /></ProtectedRoute>} />
      <Route path="/passwords/:id" element={<ProtectedRoute><PasswordEdit /></ProtectedRoute>} />

      {/* Preguntas y respuestas de seguridad */}
      <Route path="/security-questions" element={<ProtectedRoute><SecurityQuestionsList /></ProtectedRoute>} />
      <Route path="/security-questions/:id" element={<ProtectedRoute><SecurityQuestionEdit /></ProtectedRoute>} />
      <Route path="/answers" element={<ProtectedRoute><AnswersList /></ProtectedRoute>} />
      <Route path="/answers/:id" element={<ProtectedRoute><AnswerEdit /></ProtectedRoute>} />

      {/* Roles / Permisos */}
      <Route path="/roles" element={<ProtectedRoute><RolesList /></ProtectedRoute>} />
      <Route path="/roles/:id" element={<ProtectedRoute><RoleEdit /></ProtectedRoute>} />
      <Route path="/permissions" element={<ProtectedRoute><PermissionsList /></ProtectedRoute>} />
      <Route path="/permissions/:id" element={<ProtectedRoute><PermissionEdit /></ProtectedRoute>} />
      <Route path="/role-permissions" element={<ProtectedRoute><RolePermissionsList /></ProtectedRoute>} />
      <Route path="/role-permissions/:id" element={<ProtectedRoute><RolePermissionEdit /></ProtectedRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
