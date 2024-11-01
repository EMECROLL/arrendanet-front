// src/AppRouter.js
import { Route, Routes } from 'react-router-dom';
import { useAuth } from './AuthContext';
import publicRoutes from './routes/public/publicRoutes';
import privateRoutes from './routes/private/privateRoutes';
import authRoutes from './routes/auth/authRoutes';

function AppRouter() {
    const { isAuthenticated } = useAuth();
    return (
        <Routes>
            {/* RUTAS DE AUTENTICACIÓN */}
            {authRoutes}

            {/* RUTAS PUBLICAS */}
            {publicRoutes}

            {/* RUTAS PROTEGIDAS */}
            {isAuthenticated && privateRoutes}

            {/* RUTA NO ENCONTRADA */}
            <Route path='/*' element={<div>No encontrado</div>} />
        </Routes>
    );
}

export default AppRouter;
