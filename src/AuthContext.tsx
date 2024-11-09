import { jwtDecode } from 'jwt-decode';
import CryptoJS from 'crypto-js';
import { createContext, useContext, useEffect, useState } from 'react';
import { AccountService } from './services/account/AccountService';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;
const encryptJWT = (token) => {
    return CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
};

const decryptJWT = (encryptedToken) => {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const accountService = new AccountService();
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => { 
            const encryptedToken = localStorage.getItem('token'); 
            if (encryptedToken) {
                const token = decryptJWT(encryptedToken);                
                const decoded = jwtDecode(token);                
                const response = await accountService.validateToken(token);
                
                if(response.success){
                    setIsAuthenticated(true);
                    setUser(decoded);
                } else {
                    setIsAuthenticated(false);
                }              
            } else {
                setIsAuthenticated(false);
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (credentials) => {
        try {            
            const response = await accountService.login(credentials);
            if(response.success){
                const token = response.token;
                const encryptedToken = encryptJWT(token);
                localStorage.setItem('token', encryptedToken);
                setIsAuthenticated(true);
                setUser(jwtDecode(token));
            }
            return response;
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
        navigate('/login');
    };
    const userRole = user ? user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] : null;
        
    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, loading, user, userRole}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
