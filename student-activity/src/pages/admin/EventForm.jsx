import { useState, useEffect } from 'react';
import { useDataContext } from '../../context/DataContext.jsx';
import toast from 'react-hot-toast';

const TYPES = ['event', 'sport', 'club', 'workshop', 'seminar', 'cultural', 'volunteering', 'competition'];

const Field = ({ label, name, children, required: req, errors }) => (
    <div className="form-group">
        <label className="form-label">{label}{req && <span>*</span>}</label>
        {children}
        {errors[name] && <span className="form-error">{errors[name]}</span>}
    </div>
);

const EventForm = ({ activity, onClose }) => {

    if (preview) {
        return (
            <div>
                <div style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 10, border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                        <span className={`event-type-tag event-type-${form.type}`}>{form.type}</span>
                        <span className="badge badge-primary">{form.defaultPoints} pts</span>
                    </div>
                    <h3 style={{ marginBottom: '0.5rem' }}>{form.name || 'Event Name'}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        <div>📅 {form.date || '—'} at {form.time || '—'}</div>
                        <div>📍 {form.venue || '—'}</div>
                    </div>
                    <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>{form.description || '—'}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button className="btn btn-secondary" onClick={() => setPreview(false)}>← Edit</button>
                    <button className="btn btn-primary" onClick={handleSubmit}>{isEdit ? 'Save Changes' : 'Create Event'}</button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
                <Field label="Event Name" name="name" required errors={errors}>
                    <input className={`form-control ${errors.name ? 'error' : ''}`} value={form.name} onChange={set('name')} placeholder="e.g. Science Fair 2026" />
                </Field>

                <Field label="Event Type" name="type" required errors={errors}>
                    <select className="form-control" value={form.type} onChange={set('type')}>
                        {TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                    </select>
                </Field>

                <Field label="Date" name="date" required errors={errors}>
                    <input className={`form-control ${errors.date ? 'error' : ''}`} type="date"
                        value={form.date} onChange={set('date')} min={isEdit ? undefined : today} />
                </Field>

                <Field label="Time" name="time" required errors={errors}>
                    <input className={`form-control ${errors.time ? 'error' : ''}`} type="time" value={form.time} onChange={set('time')} />
                </Field>

                <Field label="Venue" name="venue" required errors={errors}>
                    <input className={`form-control ${errors.venue ? 'error' : ''}`} value={form.venue} onChange={set('venue')} placeholder="e.g. Main Auditorium" />
                </Field>

                <Field label="Default Points" name="defaultPoints" required errors={errors}>
                    <input className={`form-control ${errors.defaultPoints ? 'error' : ''}`}
                        type="number" min="1" max="1000" value={form.defaultPoints} onChange={set('defaultPoints')} />
                    <span className="form-hint">Points auto-awarded to each attendee</span>
                </Field>
            </div>

            <div className="form-group" style={{ marginTop: '1rem' }}>
                <label className="form-label">Description <span>*</span></label>
                <textarea className={`form-control ${errors.description ? 'error' : ''}`}
                    value={form.description} onChange={set('description')}
                    placeholder="Describe the event..." style={{ minHeight: 90 }} />
                {errors.description && <span className="form-error">{errors.description}</span>}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                <button type="button" className="btn btn-secondary" onClick={() => {
                    const errs = validate();
                    if (Object.keys(errs).length) { setErrors(errs); return; }
                    setPreview(true);
                }}>Preview</button>
                <button type="submit" className="btn btn-primary">{isEdit ? 'Save Changes' : 'Create Event'}</button>
            </div>
        </form>
    );
};

export default EventForm;
