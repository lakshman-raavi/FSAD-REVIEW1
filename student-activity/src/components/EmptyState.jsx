const EmptyState = ({ icon = '📭', title = 'Nothing here yet', message = '', action }) => (
    <div className="empty-state">
        <div className="empty-state-icon">{icon}</div>
        <h3>{title}</h3>
        {message && <p>{message}</p>}
        {action && <div style={{ marginTop: '1rem' }}>{action}</div>}
    </div>
);

export default EmptyState;
