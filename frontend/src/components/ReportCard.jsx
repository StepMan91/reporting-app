import { StarRating } from './StarRating';

export function ReportCard({ report, onClick }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getSeverityColor = (val) => {
        if (val < 30) return '#10b981';
        if (val < 60) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <div className="card" onClick={onClick} style={{ cursor: 'pointer' }}>
            <div style={{
                width: '100%',
                height: '200px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                marginBottom: '1rem',
                background: 'var(--bg-tertiary)'
            }}>
                {report.media_type === 'image' ? (
                    <img
                        src={`/api/${report.media_path}`}
                        alt="Report media"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    <video
                        src={`/api/${report.media_path}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                )}
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
                <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.875rem',
                    marginBottom: '0.25rem'
                }}>
                    {formatDate(report.created_at)}
                </p>
                <p style={{
                    color: 'var(--text-primary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                }}>
                    {report.description}
                </p>
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--bg-tertiary)'
            }}>
                <StarRating value={report.behavior_rating} readonly />
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: getSeverityColor(report.severity_index)
                }}>
                    {report.severity_index}
                    <span style={{ fontSize: '0.75rem', fontWeight: '400' }}>/ 100</span>
                </div>
            </div>
        </div>
    );
}
