// src/routes/publicRoutes.js
import { Route } from 'react-router-dom';
import NotFound from '../../views/error/NotFound/NotFound';
import Unauthorized from '../../views/error/Unauthorized/Unauthorized';

const errorRoutes = [
    <Route key="404" path="/*" element={<NotFound />} />,
    <Route key="401" path="/unauthorized" element={<Unauthorized />} />,
];

export default errorRoutes;
