// src/routes/publicRoutes.js
import { Route } from 'react-router-dom';
import Home from '../../views/public/Home/Home';
import Ejemplo from '../../views/public/Ejemplo/Ejemplo';

const publicRoutes = [
    <Route path="/" element={<Home />} />,
    <Route path="/ejemplo" element={<Ejemplo />} />
];

export default publicRoutes;
