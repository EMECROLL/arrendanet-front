// src/routes/privateRoutes.js
import { Route } from 'react-router-dom';
import Dashboard from '../../views/private/Dashboard/Dashboard';
import Usuarios from '../../views/private/Usuarios/Usuarios';
import Edificios from '../../views/private/Editifios/Edificios';
import Contratos from '../../views/private/Contratos/Contratos';
import Habitaciones from '../../views/private/Habitaciones/Habitaciones';
import Pagos from '../../views/private/Pagos/Pagos';

const privateRoutes = [
    <Route path="/dashboard" element={<Dashboard />} />,
    <Route path="/usuarios" element={<Usuarios />} />,
    <Route path="/edificios" element={<Edificios />} />,
    <Route path="/contratos" element={<Contratos />} />,
    <Route path="/habitaciones" element={<Habitaciones />} />,
    <Route path="/pagos" element={<Pagos />} />,
];

export default privateRoutes;
