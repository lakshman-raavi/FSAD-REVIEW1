import { useCallback } from 'react';
import { getActivities, updateActivity, addNotification } from '../utils/storage';

export const useAttendance = () => {
    const markAttendance = useCallback((activityId, attendanceMap) => {
        // attendanceMap: { studentId: boolean }
        const activities = getActivities();
        const activity = activities.find(a => a.id === activityId);
        if (!activity) return { success: false, error: 'Activity not found' };
        if (activity.attendanceLocked) return { success: false, error: 'Attendance is already locked' };

        const updatedRegistrations = activity.registrations.map(reg => ({
            ...reg,
            attended: attendanceMap[reg.studentId] ?? reg.attended,
            points: (attendanceMap[reg.studentId] ?? reg.attended) ? activity.defaultPoints : 0,
        }));

        const updated = updateActivity(activityId, { registrations: updatedRegistrations });
        return { success: true, activity: updated };
    }, []);

    const finalizeAttendance = useCallback((activityId, attendanceMap) => {
        const activities = getActivities();
        const activity = activities.find(a => a.id === activityId);
        if (!activity) return { success: false, error: 'Activity not found' };
        if (activity.attendanceLocked) return { success: false, error: 'Attendance already locked' };

        const updatedRegistrations = activity.registrations.map(reg => ({
            ...reg,
            attended: attendanceMap[reg.studentId] ?? reg.attended,
            points: (attendanceMap[reg.studentId] ?? reg.attended) ? activity.defaultPoints : 0,
        }));

        const updated = updateActivity(activityId, {
            registrations: updatedRegistrations,
            attendanceLocked: true,
        });

        // Notify students
        updatedRegistrations.forEach(reg => {
            const msg = reg.attended
                ? `Attendance marked for "${activity.name}". You earned ${activity.defaultPoints} points!`
                : `Attendance finalized for "${activity.name}". You were marked absent.`;
            addNotification(reg.studentId, {
                type: reg.attended ? 'points' : 'attendance',
                message: msg,
                activityId,
                activityName: activity.name,
            });
        });

        return { success: true, activity: updated };
    }, []);

    const reopenAttendance = useCallback((activityId) => {
        const activities = getActivities();
        const activity = activities.find(a => a.id === activityId);
        if (!activity) return { success: false, error: 'Activity not found' };

        const updatedRegistrations = activity.registrations.map(reg => ({
            ...reg,
            attended: false,
            points: 0,
        }));

        const updated = updateActivity(activityId, {
            registrations: updatedRegistrations,
            attendanceLocked: false,
        });
        return { success: true, activity: updated };
    }, []);

    return { markAttendance, finalizeAttendance, reopenAttendance };
};
