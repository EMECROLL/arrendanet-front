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
import PagosInquilino from '../../views/private/Pagos/Inquilino/PagosInquilino';
import ContratosInquilino from '../../views/private/Contratos/Inquilino/ContratosInquilino';

const privateRoutes = [
    <Route key="dashboard" path="/dashboard" element={<ProtectedRoute requiredRole={[Roles.ADMINISTRADOR, Roles.DUEÑO, Roles.INQUILINO, Roles.ENCARGADO]} ><Dashboard /></ProtectedRoute>} />,
    <Route key="usuarios" path="/usuarios" element={<ProtectedRoute requiredRole={[Roles.ADMINISTRADOR, Roles.DUEÑO, Roles.ENCARGADO]}><Usuarios /></ProtectedRoute>}  />,
    <Route key="edificios" path="/edificios" element={<ProtectedRoute requiredRole={[Roles.ADMINISTRADOR]}><Edificios /></ProtectedRoute>}  />,
    <Route key="contratos" path="/contratos" element={<ProtectedRoute requiredRole={[Roles.ADMINISTRADOR, Roles.DUEÑO]}><Contratos /></ProtectedRoute>}  />,
    <Route key="consultar-contratos" path="/consultar-contratos" element={<ProtectedRoute requiredRole={[Roles.ADMINISTRADOR, Roles.INQUILINO]}><ContratosInquilino /></ProtectedRoute>}  />,
    <Route key="habitaciones" path="/habitaciones" element={<ProtectedRoute requiredRole={[Roles.ADMINISTRADOR, Roles.DUEÑO, Roles.ENCARGADO]}><Habitaciones /></ProtectedRoute>}  />,
    <Route key="pagos" path="/pagos" element={<ProtectedRoute requiredRole={[Roles.ADMINISTRADOR, Roles.DUEÑO, Roles.ENCARGADO]}><Pagos /></ProtectedRoute>}  />,
    <Route key="consultar-pagos" path="/consultar-pagos" element={<ProtectedRoute requiredRole={[Roles.ADMINISTRADOR, Roles.INQUILINO]}><PagosInquilino /></ProtectedRoute>}  />,
    <Route key="mantenimientos" path="/mantenimientos" element={<ProtectedRoute requiredRole={[Roles.ADMINISTRADOR, Roles.ENCARGADO]}><MantenimientosEncargado /></ProtectedRoute>}  />,
    <Route key="solicitar-mantenimiento" path="/solicitar-mantenimiento" element={<ProtectedRoute requiredRole={[Roles.ADMINISTRADOR, Roles.INQUILINO]}><MantenimientosInquilino /></ProtectedRoute>}  />,
    <Route key="chat" path="/chat" element={<ProtectedRoute requiredRole={[Roles.ADMINISTRADOR, Roles.ENCARGADO, Roles.INQUILINO]}><Chat /></ProtectedRoute>}  />,
];

export default privateRoutes;
