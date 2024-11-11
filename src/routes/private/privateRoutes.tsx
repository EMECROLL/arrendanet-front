// src/routes/privateRoutes.js
import Dashboard from '../../views/private/Dashboard/Dashboard';
import Usuarios from '../../views/private/Usuarios/Usuarios';
import Edificios from '../../views/private/Editifios/Edificios';
import Contratos from '../../views/private/Contratos/Contratos';
import Habitaciones from '../../views/private/Habitaciones/Habitaciones';
import Pagos from '../../views/private/Pagos/Pagos';
import ProtectedRoute from '../../components/protected-route/ProtectedRoute';
import { Route } from 'react-router-dom';
import { Roles } from '../../common/enums/enums';
import Chat from '../../views/private/Chat/Chat';
import MantenimientosEncargado from '../../views/private/Mantenimientos/Encargado/MantenimientosEncargado';
import MantenimientosInquilino from '../../views/private/Mantenimientos/Inquilino/MantenimientosInquilino';

const privateRoutes = [
    <Route path="/dashboard" element={<ProtectedRoute requiredRole={[Roles.ADMINISTRADOR, Roles.DUEÑO]} ><Dashboard /></ProtectedRoute>} />,
    <Route path="/usuarios" element={<ProtectedRoute requiredRole={[Roles.ADMINISTRADOR, Roles.DUEÑO]}><Usuarios /></ProtectedRoute>}  />,
    <Route path="/edificios" element={<ProtectedRoute requiredRole={[Roles.ADMINISTRADOR, Roles.DUEÑO]}><Edificios /></ProtectedRoute>}  />,
    <Route path="/contratos" element={<ProtectedRoute requiredRole={[Roles.ADMINISTRADOR, Roles.DUEÑO]}><Contratos /></ProtectedRoute>}  />,
    <Route path="/habitaciones" element={<ProtectedRoute requiredRole={[Roles.ADMINISTRADOR, Roles.DUEÑO]}><Habitaciones /></ProtectedRoute>}  />,
    <Route path="/pagos" element={<ProtectedRoute requiredRole={[Roles.ADMINISTRADOR, Roles.DUEÑO]}><Pagos /></ProtectedRoute>}  />,
    <Route path="/mantenimientos" element={<ProtectedRoute requiredRole={[Roles.ADMINISTRADOR, Roles.ENCARGADO]}><MantenimientosEncargado /></ProtectedRoute>}  />,
    <Route path="/solicitar-mantenimiento" element={<ProtectedRoute requiredRole={[Roles.ADMINISTRADOR, Roles.INQUILINO]}><MantenimientosInquilino /></ProtectedRoute>}  />,
    <Route path="/chat" element={<ProtectedRoute requiredRole={[Roles.ADMINISTRADOR, Roles.ENCARGADO, Roles.INQUILINO]}><Chat /></ProtectedRoute>}  />,
];

export default privateRoutes;
