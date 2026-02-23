import { useState, useMemo } from 'react';
import {
    startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay,
    isSameMonth, addMonths, subMonths, isToday, startOfWeek, endOfWeek
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Star, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDataContext } from '../context/DataContext.jsx';
import EmptyState from './EmptyState.jsx';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarView = ({ isAdmin = false }) => {
    const { activities } = useDataContext();
    const navigate = useNavigate();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calStart = startOfWeek(monthStart);
    const calEnd = endOfWeek(monthEnd);
    const days = eachDayOfInterval({ start: calStart, end: calEnd });

    const eventsByDate = useMemo(() => {
        const map = {};
        activities.forEach(a => {
            const key = a.date;
            if (!map[key]) map[key] = [];
            map[key].push(a);
        });
        return map;
    }, [activities]);

    const selectedEvents = useMemo(() => {
        const key = format(selectedDate, 'yyyy-MM-dd');
        return eventsByDate[key] || [];
    }, [selectedDate, eventsByDate]);

    const today = new Date();

    return (
        <div className="page-content">
            <div className="page-header">
                <h1>Calendar</h1>
                <p>Browse events by date</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1.5rem' }} className="calendar-layout">
                {/* Calendar widget */}
                <div className="card">
                    <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <button className="btn btn-ghost btn-icon" onClick={() => setCurrentMonth(m => subMonths(m, 1))} aria-label="Previous month">
                            <ChevronLeft size={18} />
                        </button>
                        <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1.05rem' }}>
                            {format(currentMonth, 'MMMM yyyy')}
                        </h3>
                        <button className="btn btn-ghost btn-icon" onClick={() => setCurrentMonth(m => addMonths(m, 1))} aria-label="Next month">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                    <div className="card-body">
                        {/* Weekday headers */}
                        <div className="calendar-grid" style={{ marginBottom: '0.5rem' }}>
                            {WEEKDAYS.map(d => (
                                <div key={d} className="calendar-header-day">{d}</div>
                            ))}
                        </div>

                        {/* Day cells */}
                        <div className="calendar-grid">
                            {days.map(day => {
                                const key = format(day, 'yyyy-MM-dd');
                                const hasEvents = !!eventsByDate[key]?.length;
                                const isSelected = isSameDay(day, selectedDate);
                                const isCurrentMonth = isSameMonth(day, currentMonth);
                                const todayDay = isToday(day);

                                return (
                                    <button
                                        key={key}
                                        className={`calendar-day ${todayDay && !isSelected ? 'today' : ''} ${isSelected ? 'selected' : ''} ${!isCurrentMonth ? 'other-month' : ''} ${hasEvents && !isSelected ? 'has-events' : ''}`}
                                        onClick={() => setSelectedDate(day)}
                                        aria-label={`${format(day, 'MMMM d, yyyy')}${hasEvents ? `, ${eventsByDate[key].length} event(s)` : ''}`}
                                        style={{ border: 'none', fontFamily: 'inherit', cursor: 'pointer', background: 'none', position: 'relative' }}
                                    >
                                        <span style={{ fontWeight: isSelected || todayDay ? 700 : 400 }}>{format(day, 'd')}</span>
                                        {hasEvents && (
                                            <div style={{
                                                display: 'flex', gap: '2px', justifyContent: 'center', marginTop: '2px', flexWrap: 'wrap'
                                            }}>
                                                {eventsByDate[key].slice(0, 3).map((ev, i) => (
                                                    <div key={i} style={{
                                                        width: 5, height: 5, borderRadius: '50%',
                                                        background: ev.attendanceLocked ? '#10b981' : (ev.date < format(today, 'yyyy-MM-dd') ? '#f59e0b' : '#6366f1'),
                                                    }} />
                                                ))}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {[['#6366f1', 'Upcoming'], ['#f59e0b', 'Past'], ['#10b981', 'Finalized']].map(([color, label]) => (
                                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                                    {label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Events for selected date */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <Calendar size={18} color="var(--primary)" />
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>
                            {isSameDay(selectedDate, today) ? 'Today' : format(selectedDate, 'MMMM d, yyyy')}
                        </h3>
                        {selectedEvents.length > 0 && (
                            <span className="badge badge-primary">{selectedEvents.length}</span>
                        )}
                    </div>

                    {selectedEvents.length === 0 ? (
                        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📅</div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No events on this date</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                            {selectedEvents.map(ev => {
                                const isPast = ev.date < format(today, 'yyyy-MM-dd');
                                return (
                                    <div key={ev.id} className="card" style={{ padding: '1.25rem', borderLeft: `4px solid ${ev.attendanceLocked ? '#10b981' : isPast ? '#f59e0b' : '#6366f1'}` }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <span className={`event-type-tag event-type-${ev.type}`}>{ev.type}</span>
                                            {ev.attendanceLocked && <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Finalized</span>}
                                            {!ev.attendanceLocked && isPast && <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>Pending</span>}
                                        </div>
                                        <h4 style={{ margin: '0 0 0.5rem', fontWeight: 700 }}>{ev.name}</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={12} />{ev.venue}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Users size={12} />{ev.registrations.length} registered</div>
                                        </div>

                                        {isAdmin && (
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    className={`btn btn-sm ${ev.attendanceLocked ? 'btn-secondary' : 'btn-primary'}`}
                                                    onClick={() => navigate(ev.attendanceLocked ? `/admin/events` : `/admin/attendance/${ev.id}`)}
                                                    style={{ flex: 1 }}
                                                >
                                                    {ev.attendanceLocked ? 'View Info' : 'Take Attendance'}
                                                </button>
                                                {!ev.attendanceLocked && (
                                                    <button className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/events')} title="Edit">
                                                        Edit
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        .calendar-layout { grid-template-columns: 1fr 380px; }
        @media (max-width: 900px) { .calendar-layout { grid-template-columns: 1fr; } }
      `}</style>
        </div>
    );
};

export default CalendarView;
