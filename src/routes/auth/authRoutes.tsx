// src/routes/privateRoutes.js
import { Route } from 'react-router-dom';
import SignUp from '../../views/auth/SignUp/SignUp';
import Login from '../../views/auth/Login/Login';

const authRoutes = [
    <Route path="/login" element={<Login />} />,
    <Route path="/sign-up" element={<SignUp />} />,
];

export default authRoutes;
