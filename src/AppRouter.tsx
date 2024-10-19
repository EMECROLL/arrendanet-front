import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/protected-route/ProtectedRoute';
import { useAuth } from './AuthContext';
import Ejemplo from './views/publicRoutes/Ejemplo/Ejemplo';

function AppRouter() {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            {/* RUTAS PUBLICAS */}
            {/* <Route path="/" element={<Ejemplo />} /> */}

            {/* RUTAS PROTEGIDAS DEL ADMIN */}
            <Route 
                path='/protected' 
                element={<ProtectedRoute element={<Ejemplo />} />} 
            />

            {/* RUTA NO ENCONTRADA */}
            <Route path='/*' element={<div>No encontrado</div>} />
        </Routes>
    );
}

export default AppRouter;
