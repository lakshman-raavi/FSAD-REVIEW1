import { useState, useCallback } from 'react';
import { getCurrentUser, setCurrentUser, clearCurrentUser, getUsers, addUser, generateId } from '../utils/storage';

export const useAuth = () => {
    const [user, setUser] = useState(() => getCurrentUser());

    const login = useCallback((credentials, role) => {
        if (role === 'admin') {
            if (credentials.username === 'admin' && credentials.password === 'admin123') {
                const adminUser = { id: 'admin', name: 'Administrator', role: 'admin', username: 'admin' };
                setCurrentUser(adminUser);
                setUser(adminUser);
                return { success: true, user: adminUser };
            }
            return { success: false, error: 'Invalid admin credentials' };
        }

        if (role === 'student') {
            const users = getUsers();
            const found = users.find(u =>
                (u.studentId === credentials.studentId || u.email === credentials.studentId) &&
                u.password === credentials.password
            );
            if (found) {
                setCurrentUser(found);
                setUser(found);
                return { success: true, user: found };
            }
            return { success: false, error: 'Invalid student ID or password' };
        }

        return { success: false, error: 'Unknown role' };
    }, []);

    const register = useCallback((data) => {
        const users = getUsers();
        if (users.find(u => u.studentId === data.studentId)) {
            return { success: false, error: 'Student ID already registered' };
        }
        if (users.find(u => u.email === data.email)) {
            return { success: false, error: 'Email already registered' };
        }
        const newUser = {
            id: generateId(),
            studentId: data.studentId,
            name: data.name,
            email: data.email,
            password: data.password,
            role: 'student',
            joinedAt: new Date().toISOString().split('T')[0],
        };
        addUser(newUser);
        setCurrentUser(newUser);
        setUser(newUser);
        return { success: true, user: newUser };
    }, []);

    const logout = useCallback(() => {
        clearCurrentUser();
        setUser(null);
    }, []);

    return { user, login, logout, register, isAdmin: user?.role === 'admin', isStudent: user?.role === 'student' };
};
