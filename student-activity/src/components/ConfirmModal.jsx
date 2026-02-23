import { AlertTriangle } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', danger = false }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" role="dialog" aria-modal="true">
            <div className="modal modal-sm animate-scale-in">
                <div className="modal-body" style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{
                        width: 56, height: 56, borderRadius: '50%',
                        background: danger ? '#fee2e2' : '#dbeafe',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1.25rem',
                    }}>
                        <AlertTriangle size={24} color={danger ? '#ef4444' : '#3b82f6'} />
                    </div>
                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>{title}</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{message}</p>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                        <button className="btn btn-secondary" onClick={onClose}>{cancelText}</button>
                        <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={() => { onConfirm(); onClose(); }}>
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
