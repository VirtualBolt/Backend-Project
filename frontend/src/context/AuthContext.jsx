import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('jwt_token');
            if (token) {
                try {
                    const res = await api.get('/auth/profile');
                    setUser({ ...res.data, token });
                } catch (err) {
                    localStorage.removeItem('jwt_token');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { access_token, user: userData } = response.data;
            localStorage.setItem('jwt_token', access_token);
            setUser({ ...userData, token: access_token });
            navigate('/');
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data || error.message };
        }
    };

    const register = async (name, email, password) => {
        try {
            await api.post('/auth/register', { name, email, password });
            // Login automatically after registration
            return await login(email, password);
        } catch (error) {
            return { success: false, error: error.response?.data || error.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('jwt_token');
        setUser(null);
        navigate('/login');
    };

    if (loading) {
        return <div className="loader-container"><div className="loader"></div></div>;
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
