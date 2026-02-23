import { generateId, addUser, setActivities } from './storage';

const SEEDED_KEY = 'activityhub_seeded';

const demoStudents = [
    { id: generateId(), studentId: 'STU001', name: 'Alice Johnson', email: 'alice@university.edu', password: 'student123', role: 'student', joinedAt: '2024-01-15' },
    { id: generateId(), studentId: 'STU002', name: 'Bob Martinez', email: 'bob@university.edu', password: 'student123', role: 'student', joinedAt: '2024-01-20' },
    { id: generateId(), studentId: 'STU003', name: 'Carol Davis', email: 'carol@university.edu', password: 'student123', role: 'student', joinedAt: '2024-02-01' },
    { id: generateId(), studentId: 'STU004', name: 'David Wilson', email: 'david@university.edu', password: 'student123', role: 'student', joinedAt: '2024-02-10' },
    { id: generateId(), studentId: 'STU005', name: 'Emma Thompson', email: 'emma@university.edu', password: 'student123', role: 'student', joinedAt: '2024-02-15' },
];

const demoActivities = [
    {
        id: generateId(),
        name: 'Annual Science Fair',
        type: 'event',
        date: '2026-03-15',
        time: '10:00',
        venue: 'Main Auditorium',
        description: 'Annual science fair showcasing student projects across departments.',
        defaultPoints: 50,
        attendanceLocked: true,
        createdAt: '2026-01-10',
        registrations: [
            { studentId: 'STU001', studentName: 'Alice Johnson', attended: true, points: 50 },
            { studentId: 'STU002', studentName: 'Bob Martinez', attended: true, points: 50 },
            { studentId: 'STU003', studentName: 'Carol Davis', attended: false, points: 0 },
        ],
    },
    {
        id: generateId(),
        name: 'Basketball Tournament',
        type: 'sport',
        date: '2026-03-20',
        time: '14:00',
        venue: 'Sports Complex',
        description: 'Inter-department basketball tournament. Teams of 5.',
        defaultPoints: 75,
        attendanceLocked: false,
        createdAt: '2026-01-12',
        registrations: [
            { studentId: 'STU001', studentName: 'Alice Johnson', attended: false, points: 0 },
            { studentId: 'STU004', studentName: 'David Wilson', attended: false, points: 0 },
        ],
    },
    {
        id: generateId(),
        name: 'Photography Club Meetup',
        type: 'club',
        date: '2026-04-05',
        time: '16:00',
        venue: 'Room 201, Arts Building',
        description: 'Monthly photography club meetup — beginner tips and portfolio review.',
        defaultPoints: 30,
        attendanceLocked: false,
        createdAt: '2026-01-20',
        registrations: [
            { studentId: 'STU003', studentName: 'Carol Davis', attended: false, points: 0 },
            { studentId: 'STU005', studentName: 'Emma Thompson', attended: false, points: 0 },
        ],
    },
    {
        id: generateId(),
        name: 'Coding Hackathon 2026',
        type: 'event',
        date: '2026-04-20',
        time: '09:00',
        venue: 'Tech Hub, Block C',
        description: '24-hour hackathon. Build something awesome. Food provided!',
        defaultPoints: 100,
        attendanceLocked: false,
        createdAt: '2026-01-25',
        registrations: [],
    },
    {
        id: generateId(),
        name: 'Debate Club — Open Round',
        type: 'club',
        date: '2026-02-10',
        time: '15:00',
        venue: 'Seminar Hall B',
        description: 'Open debate session on current affairs. All welcome.',
        defaultPoints: 40,
        attendanceLocked: true,
        createdAt: '2025-12-15',
        registrations: [
            { studentId: 'STU002', studentName: 'Bob Martinez', attended: true, points: 40 },
            { studentId: 'STU005', studentName: 'Emma Thompson', attended: true, points: 40 },
            { studentId: 'STU001', studentName: 'Alice Johnson', attended: false, points: 0 },
        ],
    },
];

export const seedData = () => {
    if (localStorage.getItem(SEEDED_KEY)) return;
    demoStudents.forEach(student => addUser(student));
    setActivities(demoActivities);
    localStorage.setItem(SEEDED_KEY, 'true');
};
