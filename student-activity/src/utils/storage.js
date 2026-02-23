// Centralized localStorage utility

const PREFIX = 'activityhub_';

export const storage = {
    get: (key, fallback = null) => {
        try {
            const val = localStorage.getItem(PREFIX + key);
            return val !== null ? JSON.parse(val) : fallback;
        } catch {
            return fallback;
        }
    },
    set: (key, value) => {
        try {
            localStorage.setItem(PREFIX + key, JSON.stringify(value));
        } catch (e) {
            console.error('localStorage set error', e);
        }
    },
    remove: (key) => {
        localStorage.removeItem(PREFIX + key);
    },
    clear: () => {
        Object.keys(localStorage)
            .filter(k => k.startsWith(PREFIX))
            .forEach(k => localStorage.removeItem(k));
    },
};

// Activity operations (NOW ASYNC)
export const getActivities = async () => {
    try {
        const res = await fetch('/api/activities');
        if (!res.ok) throw new Error('API Error');
        return await res.json();
    } catch (e) {
        console.error('API getActivities error, falling back', e);
        return storage.get('activities', []);
    }
};

export const setActivities = (activities) => storage.set('activities', activities); // Restored for seedData

export const addActivity = async (activity) => {
    try {
        const res = await fetch('/api/activities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(activity)
        });
        return await res.json();
    } catch (e) {
        console.error('API addActivity error', e);
    }
};

export const updateActivity = async (id, updates) => {
    try {
        const res = await fetch(`/api/activities/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        return await res.json();
    } catch (e) {
        console.error('API updateActivity error', e);
    }
};

export const deleteActivity = async (id) => {
    try {
        await fetch(`/api/activities/${id}`, { method: 'DELETE' });
    } catch (e) {
        console.error('API deleteActivity error', e);
    }
};

export const getActivity = (id) => storage.get('activities', []).find(a => a.id === id) || null; // Restored

// User operations (NOW ASYNC)
export const getUsers = async () => {
    try {
        const res = await fetch('/api/users');
        if (!res.ok) throw new Error('API Error');
        return await res.json();
    } catch (e) {
        return storage.get('users', []);
    }
};

export const setUsers = (users) => storage.set('users', users); // Restored

export const addUser = async (user) => {
    try {
        await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
    } catch (e) {
        console.warn('API addUser error', e);
    }
};

export const getUserById = (id) => storage.get('users', []).find(u => u.id === id) || null; // Restored
export const getUserByStudentId = (studentId) => storage.get('users', []).find(u => u.studentId === studentId) || null; // Restored

// Current user session
export const getCurrentUser = () => storage.get('currentUser', null);
export const setCurrentUser = (user) => storage.set('currentUser', user);
export const clearCurrentUser = () => storage.remove('currentUser');

// Notifications
export const getNotifications = (userId) => storage.get(`notifications_${userId}`, []);
export const addNotification = (userId, notification) => {
    const notifs = getNotifications(userId);
    notifs.unshift({ ...notification, id: Date.now(), read: false, createdAt: new Date().toISOString() });
    storage.set(`notifications_${userId}`, notifs.slice(0, 50));
};
export const markNotificationRead = (userId, notifId) => {
    const notifs = getNotifications(userId);
    const idx = notifs.findIndex(n => n.id === notifId);
    if (idx !== -1) notifs[idx].read = true;
    storage.set(`notifications_${userId}`, notifs);
};
export const markAllNotificationsRead = (userId) => {
    const notifs = getNotifications(userId).map(n => ({ ...n, read: true }));
    storage.set(`notifications_${userId}`, notifs);
};

// Theme
export const getTheme = () => storage.get('theme', 'light');
export const setTheme = (theme) => storage.set('theme', theme);

// Generate unique ID
export const generateId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
