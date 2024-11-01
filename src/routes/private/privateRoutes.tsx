// src/routes/privateRoutes.js
import { Route } from 'react-router-dom';
import Dashboard from '../../views/private/Dashboard/Dashboard';

const privateRoutes = [
    <Route path="/protected" element={<Dashboard />} />,
];

export default privateRoutes;
