import { useState } from 'react';

export function StarRating({ value, onChange, readonly = false }) {
    const [hoverValue, setHoverValue] = useState(0);

    const handleClick = (rating) => {
        if (!readonly && onChange) {
            onChange(rating);
        }
    };

    return (
        <div className="flex gap-sm">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    className="star-button"
                    onClick={() => handleClick(star)}
                    onMouseEnter={() => !readonly && setHoverValue(star)}
                    onMouseLeave={() => !readonly && setHoverValue(0)}
                    disabled={readonly}
                    style={{
                        fontSize: '2rem',
                        background: 'none',
                        border: 'none',
                        cursor: readonly ? 'default' : 'pointer',
                        color: star <= (hoverValue || value) ? 'var(--warning)' : 'var(--text-muted)',
                        transition: 'color 150ms',
                        padding: '0.25rem',
                    }}
                >
                    ★
                </button>
            ))}
        </div>
    );
}
