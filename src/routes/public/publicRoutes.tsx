// src/routes/publicRoutes.js
import { Route } from 'react-router-dom';
import Home from '../../views/public/Home/Home';
import Ejemplo from '../../views/public/Ejemplo/Ejemplo';
import Legal from '../../views/public/Legal/Legal';
import SobreNostros from '../../views/public/SobreNosotros/SobreNostros';
import Ayuda from '../../views/public/Ayuda/Ayuda';

const publicRoutes = [
    <Route path="/" element={<Home />} />,
    <Route path="/sobre-nosotros" element={<SobreNostros />} />,
    <Route path="/contacto" element={<Ayuda />} />,
    <Route path="/legal" element={<Legal />} />,
    <Route path="/ejemplo" element={<Ejemplo />} />
];

export default publicRoutes;
