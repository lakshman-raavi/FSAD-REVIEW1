// Export utilities for attendance reports

import * as XLSX from 'xlsx';

export const exportAttendanceReport = (activity) => {
    const { name, date, venue, registrations, defaultPoints } = activity;

    const attended = registrations.filter(r => r.attended);
    const absent = registrations.filter(r => !r.attended);

    const wb = XLSX.utils.book_new();

    // Event Info sheet
    const infoData = [
        ['Event Name', name],
        ['Date', date],
        ['Venue', venue],
        ['Default Points', defaultPoints],
        ['Total Registered', registrations.length],
        ['Total Present', attended.length],
        ['Total Absent', absent.length],
        ['Attendance %', registrations.length > 0 ? `${Math.round((attended.length / registrations.length) * 100)}%` : '0%'],
    ];
    const infoSheet = XLSX.utils.aoa_to_sheet(infoData);
    infoSheet['!cols'] = [{ wch: 20 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, infoSheet, 'Event Info');

    // Attended Students sheet
    const attendedHeaders = ['Student ID', 'Student Name', 'Status', 'Points Awarded'];
    const attendedRows = attended.map(r => [r.studentId, r.studentName, 'Present', defaultPoints]);
    const attendedSheet = XLSX.utils.aoa_to_sheet([attendedHeaders, ...attendedRows]);
    attendedSheet['!cols'] = [{ wch: 15 }, { wch: 25 }, { wch: 12 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, attendedSheet, 'Attended Students');

    // Absent Students sheet
    const absentHeaders = ['Student ID', 'Student Name', 'Status', 'Points Awarded'];
    const absentRows = absent.map(r => [r.studentId, r.studentName, 'Absent', 0]);
    const absentSheet = XLSX.utils.aoa_to_sheet([absentHeaders, ...absentRows]);
    absentSheet['!cols'] = [{ wch: 15 }, { wch: 25 }, { wch: 12 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, absentSheet, 'Absent Students');

    // All Students combined sheet
    const allHeaders = ['Student ID', 'Student Name', 'Attendance Status', 'Points Awarded'];
    const allRows = registrations.map(r => [
        r.studentId,
        r.studentName,
        r.attended ? 'Present' : 'Absent',
        r.attended ? defaultPoints : 0,
    ]);
    const allSheet = XLSX.utils.aoa_to_sheet([allHeaders, ...allRows]);
    allSheet['!cols'] = [{ wch: 15 }, { wch: 25 }, { wch: 18 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, allSheet, 'All Students');

    const fileName = `${name.toLowerCase().replace(/\s+/g, '-')}_attendance_report.xlsx`;
    XLSX.writeFile(wb, fileName);
};

export const exportStudentReport = (student, activities) => {
    const registeredActivities = activities.filter(a =>
        a.registrations.some(r => r.studentId === student.studentId)
    );

    const wb = XLSX.utils.book_new();

    // Student summary
    const totalPoints = registeredActivities.reduce((sum, a) => {
        const reg = a.registrations.find(r => r.studentId === student.studentId);
        return sum + (reg?.points || 0);
    }, 0);

    const summaryData = [
        ['Student Name', student.name],
        ['Student ID', student.studentId],
        ['Total Points', totalPoints],
        ['Events Registered', registeredActivities.length],
        ['Events Attended', registeredActivities.filter(a => {
            const r = a.registrations.find(r => r.studentId === student.studentId);
            return r?.attended;
        }).length],
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');

    // Event history
    const historyHeaders = ['Event Name', 'Type', 'Date', 'Venue', 'Status', 'Points'];
    const historyRows = registeredActivities.map(a => {
        const reg = a.registrations.find(r => r.studentId === student.studentId);
        return [a.name, a.type, a.date, a.venue, reg?.attended ? 'Present' : (a.attendanceLocked ? 'Absent' : 'Pending'), reg?.points || 0];
    });
    const historySheet = XLSX.utils.aoa_to_sheet([historyHeaders, ...historyRows]);
    historySheet['!cols'] = [{ wch: 25 }, { wch: 10 }, { wch: 12 }, { wch: 25 }, { wch: 10 }, { wch: 8 }];
    XLSX.utils.book_append_sheet(wb, historySheet, 'Event History');

    const fileName = `${student.name.toLowerCase().replace(/\s+/g, '-')}_activity_report.xlsx`;
    XLSX.writeFile(wb, fileName);
};

export const exportAdminSummary = (activities, users) => {
    const wb = XLSX.utils.book_new();

    // Events summary
    const eventHeaders = ['Event Name', 'Type', 'Date', 'Venue', 'Registered', 'Attended', 'Attendance %', 'Points Each', 'Total Points Distributed'];
    const eventRows = activities.map(a => {
        const attended = a.registrations.filter(r => r.attended).length;
        const pct = a.registrations.length > 0 ? Math.round((attended / a.registrations.length) * 100) : 0;
        return [
            a.name, a.type, a.date, a.venue,
            a.registrations.length, attended, `${pct}%`,
            a.defaultPoints, attended * a.defaultPoints,
        ];
    });
    const eventSheet = XLSX.utils.aoa_to_sheet([eventHeaders, ...eventRows]);
    XLSX.utils.book_append_sheet(wb, eventSheet, 'Events Summary');

    // Students summary
    const studentHeaders = ['Student ID', 'Student Name', 'Events Registered', 'Events Attended', 'Total Points'];
    const studentRows = users.filter(u => u.role === 'student').map(u => {
        const registered = activities.filter(a => a.registrations.some(r => r.studentId === u.studentId));
        const attended = registered.filter(a => a.registrations.find(r => r.studentId === u.studentId)?.attended);
        const points = registered.reduce((sum, a) => {
            const r = a.registrations.find(r => r.studentId === u.studentId);
            return sum + (r?.points || 0);
        }, 0);
        return [u.studentId, u.name, registered.length, attended.length, points];
    });
    const studentSheet = XLSX.utils.aoa_to_sheet([studentHeaders, ...studentRows]);
    XLSX.utils.book_append_sheet(wb, studentSheet, 'Students Summary');

    XLSX.writeFile(wb, 'admin_activity_summary_report.xlsx');
};
