import { useState, useEffect } from 'react';
import apiClient from '../api/client';

export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await apiClient.get('/auth/me');
            setUser(response.data);
        } catch (error) {
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
        await apiClient.post('/auth/logout');
        setUser(null);
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
