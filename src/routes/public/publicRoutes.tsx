// src/routes/publicRoutes.js
import { Route } from 'react-router-dom';
import Home from '../../views/public/Home/Home';
import Ejemplo from '../../views/public/Ejemplo/Ejemplo';
import Legal from '../../views/public/Legal/Legal';
import SobreNostros from '../../views/public/SobreNosotros/SobreNostros';
import Ayuda from '../../views/public/Ayuda/Ayuda';

const publicRoutes = [
    <Route key="home" path="/" element={<Home />} />,
    <Route key="sobre-nosotros" path="/sobre-nosotros" element={<SobreNostros />} />,
    <Route key="contacto" path="/contacto" element={<Ayuda />} />,
    <Route key="legal" path="/legal" element={<Legal />} />,
    <Route key="ejemplo" path="/ejemplo" element={<Ejemplo />} />,
];

export default publicRoutes;
