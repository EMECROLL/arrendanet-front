// src/routes/publicRoutes.js
import { Route } from 'react-router-dom';
import NotFound from '../../views/error/NotFound/NotFound';
import Unauthorized from '../../views/error/Unauthorized/Unauthorized';

const errorRoutes = [
    <Route path="/*" element={<NotFound />} />,
    <Route path="/unauthorized" element={<Unauthorized />} />,
];

export default errorRoutes;
