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
        if (val < 30) return 'var(--success)';
        if (val < 60) return 'var(--warning)';
        return 'var(--error)';
    };

    return (
        <div className="card" onClick={onClick} style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
            <div style={{
                width: '100%',
                height: '200px',
                borderRadius: 'var(--border-radius)',
                overflow: 'hidden',
                marginBottom: '1rem',
                background: 'var(--background)'
            }}>
                {report.media_type === 'image' ? (
                    <img
                        src={report.thumbnail_path ? `/api/${report.thumbnail_path}` : `/api/${report.media_path}`}
                        alt="Report media"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                            // Fallback to original if thumbnail fails
                            if (report.thumbnail_path && e.target.src.includes(report.thumbnail_path)) {
                                e.target.src = `/api/${report.media_path}`;
                            }
                        }}
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
                    color: 'var(--text-muted)',
                    fontSize: '0.875rem',
                    marginBottom: '0.25rem'
                }}>
                    {formatDate(report.created_at)}
                </p>
                <p style={{
                    color: 'var(--secondary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    fontWeight: '500'
                }}>
                    {report.description}
                </p>
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--border)'
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
                    <span style={{ fontSize: '0.75rem', fontWeight: '400', color: 'var(--text-muted)' }}>/ 100</span>
                </div>
            </div>
        </div>
    );
}
