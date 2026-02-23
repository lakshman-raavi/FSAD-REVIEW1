import React from 'react';

const SkeletonLoader = ({ variant = 'card', count = 1, height, width }) => {
    const items = Array.from({ length: count });

    if (variant === 'text') {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: width || '100%' }}>
                {items.map((_, i) => (
                    <div key={i} className="skeleton" style={{ height: height || '0.8rem', borderRadius: '4px' }} />
                ))}
            </div>
        );
    }

    if (variant === 'avatar') {
        return <div className="skeleton" style={{ width: width || '40px', height: height || '40px', borderRadius: '50%' }} />;
    }

    return (
        <div className="skeleton-grid">
            {items.map((_, i) => (
                <div key={i} className="card skeleton" style={{ height: height || '200px', width: width || '100%' }} />
            ))}
            <style>{`
        .skeleton-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.25rem;
          width: 100%;
        }
      `}</style>
        </div>
    );
};

export default SkeletonLoader;
