import { useState, useEffect } from 'react';
import apiClient from '../api/client';

export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            // Set default header for all requests
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const response = await apiClient.get('/auth/me');
            setUser(response.data);
        } catch (error) {
            localStorage.removeItem('token');
            delete apiClient.defaults.headers.common['Authorization'];
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);

        const response = await apiClient.post('/auth/login', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        const { access_token } = response.data;
        localStorage.setItem('token', access_token);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

        await checkAuth();
        return response.data;
    };

    const register = async (email, password) => {
        const response = await apiClient.post('/auth/register', {
            email,
            password,
        });
        return response.data;
    };

    const logout = async () => {
        try {
            // Optional: call backend logout if needed
            // await apiClient.post('/auth/logout'); 
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem('token');
            delete apiClient.defaults.headers.common['Authorization'];
            setUser(null);
        }
    };

    return {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
    };
}
