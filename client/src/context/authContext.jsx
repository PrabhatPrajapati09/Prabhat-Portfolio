import {useState, createContext, useEffect, useContext} from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAdmin = () => {
    return useContext(AuthContext);
}

export const AdminProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [devMode, setDevMode] = useState(false);
    const [token , setToken] = useState(localStorage.getItem('adminToken'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyToken = async () => {
            if(!token){
                setIsAdmin(false);
                setLoading(false);
                setDevMode(false);
                return;
            }
            try {
                const response = await api.get('/admin/verify');
                if(response.data.valid){
                    setIsAdmin(true);
                } else {
                    logout();
                }
            } catch (error) {
                console.error("Error verifying token:", error.message);
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, [token]);

    const login = async (email, secretKey) => {
        try {
            const response = await api.post('/admin/login',  { email, secretKey })
            const token = response.data.token;

            localStorage.setItem('adminToken', token);
            setToken(token);
            setIsAdmin(true);
            setDevMode(true);

            return { success: true, message: response?.data?.message};
        } catch (error) {
            return { success: false, message: error.response?.data?.message };
        }
    }

    const logout = () => {
        localStorage.removeItem('adminToken');
        setToken(null);
        setIsAdmin(false);
        setDevMode(false);
    }

    const toggleDevMode = () => {
        setDevMode(!devMode);
    }

    return (
        <AuthContext.Provider value={{ isAdmin, devMode, login, logout, toggleDevMode, loading, token }}>
            {children}
        </AuthContext.Provider>
    )
};

export default AdminProvider