// src/AppRouter.js
import { Routes } from 'react-router-dom';
import publicRoutes from './routes/public/publicRoutes';
import privateRoutes from './routes/private/privateRoutes';
import authRoutes from './routes/auth/authRoutes';
import errorRoutes from './routes/error/errorRoutes';

function AppRouter() {
    return (
        <Routes>
            {/* RUTAS DE AUTENTICACIÓN */}
            {authRoutes}

            {/* RUTAS PUBLICAS */}
            {publicRoutes}

            {/* RUTAS PROTEGIDAS */}
            {privateRoutes}

            {/* RUTA PARA ERRORES */}
            {errorRoutes}
        </Routes>
    );
}

export default AppRouter;
