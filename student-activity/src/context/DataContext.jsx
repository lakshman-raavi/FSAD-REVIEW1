import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
    getActivities, addActivity, updateActivity, deleteActivity,
    getUsers, generateId, addNotification
} from '../utils/storage';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
    const [activities, setActivitiesState] = useState([]);
    const [users, setUsersState] = useState([]);
    const [loading, setLoading] = useState(true);

    const refreshActivities = useCallback(async () => {
        const acts = await getActivities();
        setActivitiesState(acts);
    }, []);

    const refreshUsers = useCallback(async () => {
        const allUsers = await getUsers();
        setUsersState(allUsers.filter(u => u.role === 'student'));
    }, []);

    useEffect(() => {
        const init = async () => {
            await Promise.all([refreshActivities(), refreshUsers()]);
            setLoading(false);
        };
        init();
    }, [refreshActivities, refreshUsers]);

    const createActivity = useCallback(async (data) => {
        const activity = {
            id: generateId(),
            ...data,
            attendanceLocked: false,
            createdAt: new Date().toISOString().split('T')[0],
            registrations: [],
        };
        try {
            await addActivity(activity);
            await refreshActivities();
            return { success: true, activity };
        } catch (e) {
            console.error('Context createActivity error', e);
            // Even if API fails, storage.js updated localStorage, so refresh will show it
            await refreshActivities();
            return { success: true, activity, warning: 'Saved locally (offline mode)' };
        }
    }, [refreshActivities]);

    const editActivity = useCallback(async (id, updates) => {
        try {
            const updated = await updateActivity(id, updates);
            await refreshActivities();
            return { success: true, activity: updated };
        } catch (e) {
            console.error('Context editActivity error', e);
            await refreshActivities();
            return { success: true, warning: 'Updated locally (offline mode)' };
        }
    }, [refreshActivities]);

    const removeActivity = useCallback(async (id) => {
        try {
            await deleteActivity(id);
            await refreshActivities();
            return { success: true };
        } catch (e) {
            console.error('Context removeActivity error', e);
            await refreshActivities();
            return { success: true, warning: 'Removed locally (offline mode)' };
        }
    }, [refreshActivities]);

    const registerForActivity = useCallback(async (activityId, student) => {
        const act = activities.find(a => a.id === activityId);
        if (!act) return { success: false, error: 'Event not found' };
        if (act.attendanceLocked) return { success: false, error: 'Registration closed — attendance already finalized' };
        if (act.registrations.find(r => r.studentId === student.studentId))
            return { success: false, error: 'Already registered for this event' };

        const newReg = {
            studentId: student.studentId,
            studentName: student.name,
            attended: false,
            points: 0,
        };

        const updatedRegs = [...act.registrations, newReg];

        // Optimistic update
        setActivitiesState(prev => prev.map(a => a.id === activityId ? { ...a, registrations: updatedRegs } : a));

        const updated = await updateActivity(activityId, { registrations: updatedRegs });

        addNotification(student.studentId, {
            type: 'registration',
            message: `You've successfully registered for "${act.name}" on ${act.date}.`,
            activityId,
            activityName: act.name,
        });

        return { success: true, activity: updated };
    }, [activities]);

    const unregister = useCallback(async (activityId, studentId) => {
        const act = activities.find(a => a.id === activityId);
        if (!act) return { success: false, error: 'Event not found' };
        if (act.attendanceLocked) return { success: false, error: 'Cannot unregister after attendance is finalized' };

        const updatedRegs = act.registrations.filter(r => r.studentId !== studentId);

        // Optimistic update
        setActivitiesState(prev => prev.map(a => a.id === activityId ? { ...a, registrations: updatedRegs } : a));

        const updated = await updateActivity(activityId, { registrations: updatedRegs });

        return { success: true, activity: updated };
    }, [activities]);

    const finalizeAttendance = useCallback(async (activityId, attendanceMap) => {
        const act = activities.find(a => a.id === activityId);
        if (!act) return { success: false, error: 'Event not found' };
        if (act.attendanceLocked) return { success: false, error: 'Attendance already locked' };

        const updatedRegs = act.registrations.map(reg => ({
            ...reg,
            studentName: reg.studentName || reg.name, // Normalize to studentName
            attended: attendanceMap[reg.studentId] ?? false,
            points: (attendanceMap[reg.studentId] ?? false) ? act.defaultPoints : 0,
        }));

        // Optimistic update
        setActivitiesState(prev => prev.map(a => a.id === activityId ? { ...a, registrations: updatedRegs, attendanceLocked: true } : a));

        await updateActivity(activityId, { registrations: updatedRegs, attendanceLocked: true });

        updatedRegs.forEach(reg => {
            addNotification(reg.studentId, {
                type: reg.attended ? 'points' : 'attendance',
                message: reg.attended
                    ? `You attended "${act.name}" and earned ${act.defaultPoints} points! 🎉`
                    : `Attendance finalized for "${act.name}". You were marked absent.`,
                activityId,
                activityName: act.name,
            });
        });

        // Skip refreshActivities() here as it might return stale data on Vercel
        // The optimistic update above is sufficient and trusted.
        return { success: true };
    }, [activities]);

    const reopenAttendance = useCallback(async (activityId) => {
        const act = activities.find(a => a.id === activityId);
        if (!act) return { success: false, error: 'Event not found' };

        const updatedRegs = act.registrations.map(r => ({ ...r, attended: false, points: 0 }));

        // Optimistic update
        setActivitiesState(prev => prev.map(a => a.id === activityId ? { ...a, registrations: updatedRegs, attendanceLocked: false } : a));

        await updateActivity(activityId, { registrations: updatedRegs, attendanceLocked: false });
        // Skip refreshActivities() to preserve local state
        return { success: true };
    }, [activities]);

    return (
        <DataContext.Provider value={{
            activities, users, loading, refreshActivities,
            createActivity, editActivity, removeActivity,
            registerForActivity, unregister,
            finalizeAttendance, reopenAttendance,
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useDataContext = () => {
    const ctx = useContext(DataContext);
    if (!ctx) throw new Error('useDataContext must be used inside DataProvider');
    return ctx;
};
