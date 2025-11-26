export function SeveritySlider({ value, onChange }) {
    const getSeverityColor = (val) => {
        if (val < 30) return 'var(--success)';
        if (val < 60) return 'var(--warning)';
        return 'var(--error)';
    };

    return (
        <div className="severity-slider">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Severity Index</span>
                <span style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: getSeverityColor(value)
                }}>
                    {value}
                </span>
            </div>

            <input
                type="range"
                min="0"
                max="100"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '4px',
                    outline: 'none',
                    background: `linear-gradient(to right, 
            var(--success) 0%, 
            var(--warning) 50%, 
            var(--error) 100%)`,
                    cursor: 'pointer',
                    WebkitAppearance: 'none',
                }}
            />

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '0.5rem',
                fontSize: '0.75rem',
                color: 'var(--text-muted)'
            }}>
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
            </div>

            <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          border: 3px solid ${getSeverityColor(value)};
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          border: 3px solid ${getSeverityColor(value)};
        }
      `}</style>
        </div>
    );
}
