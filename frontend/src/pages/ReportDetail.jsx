import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { StarRating } from '../components/StarRating';
import apiClient from '../api/client';
import { useTranslation } from 'react-i18next';

export function ReportDetail() {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleting, setDeleting] = useState(false);
    const { t } = useTranslation();

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchReport();
    }, [id]);

    const fetchReport = async () => {
        try {
            const response = await apiClient.get(`/reports/${id}`);
            setReport(response.data);
        } catch (err) {
            setError('Failed to load report');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this report?')) {
            return;
        }

        setDeleting(true);
        try {
            await apiClient.delete(`/reports/${id}`);
            navigate('/reports');
        } catch (err) {
            alert('Failed to delete report');
            setDeleting(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getSeverityColor = (val) => {
        if (val < 30) return 'var(--success)';
        if (val < 60) return 'var(--warning)';
        return 'var(--error)';
    };

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '50vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="flex-center flex-column">
                <div className="card text-center" style={{ maxWidth: '400px' }}>
                    <p style={{ color: 'var(--error)', marginBottom: '1rem' }}>{error || 'Report not found'}</p>
                    <Link to="/reports" className="btn btn-primary">
                        Back to Reports
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-column gap-lg">
            <nav className="mb-4">
                <Link to="/reports" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                    <span>←</span> {t('back_to_reports')}
                </Link>
            </nav>

            <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                <div className="card">
                    <div style={{
                        width: '100%',
                        borderRadius: 'var(--border-radius)',
                        overflow: 'hidden',
                        marginBottom: '1.5rem',
                        background: 'var(--background)',
                        border: '1px solid var(--border)'
                    }}>
                        {report.media_type === 'image' ? (
                            <div>
                                <img
                                    src={report.thumbnail_path ? `/api/${report.thumbnail_path}` : `/api/${report.media_path}`}
                                    alt="Report media"
                                    style={{ width: '100%', maxHeight: '500px', objectFit: 'contain', display: 'block' }}
                                    onError={(e) => {
                                        if (report.thumbnail_path && e.target.src.includes(report.thumbnail_path)) {
                                            e.target.src = `/api/${report.media_path}`;
                                        }
                                    }}
                                />
                                <div style={{ padding: '1rem', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
                                    <a
                                        href={`/api/${report.media_path}`}
                                        download
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-outline"
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                                    >
                                        📥 Download High-Res Image
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <video
                                src={`/api/${report.media_path}`}
                                controls
                                style={{ width: '100%', maxHeight: '500px' }}
                            />
                        )}
                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1.5rem',
                        paddingBottom: '1rem',
                        borderBottom: '1px solid var(--border)'
                    }}>
                        <span className="text-muted">{formatDate(report.created_at)}</span>
                        <button
                            onClick={handleDelete}
                            className="btn btn-danger"
                            disabled={deleting}
                        >
                            {deleting ? 'Deleting...' : '🗑 Delete'}
                        </button>
                    </div>

                    <div className="form-group">
                        <h3 style={{ color: 'var(--secondary)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Description</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                            {report.description}
                        </p>
                    </div>

                    <div className="form-group">
                        <h4 style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }}>
                            Behavior Rating
                        </h4>
                        <StarRating value={report.behavior_rating} readonly />
                    </div>

                    <div className="form-group">
                        <h4 style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }}>
                            Severity Index
                        </h4>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            fontSize: '2rem',
                            fontWeight: '700',
                            color: getSeverityColor(report.severity_index)
                        }}>
                            {report.severity_index}
                            <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 100</span>
                        </div>
                    </div>

                    {report.latitude && report.longitude && (
                        <div className="form-group">
                            <h4 style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }}>
                                Location
                            </h4>
                            <p className="text-muted" style={{ marginBottom: '0.5rem' }}>
                                📍 {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
                            </p>
                            <a
                                href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline"
                                style={{ display: 'inline-block' }}
                            >
                                View on Map
                            </a>
                        </div>
                    )}

                    {report.device_info && (
                        <div className="form-group" style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                            <h4 style={{ color: 'var(--secondary)', marginBottom: '0.5rem', fontSize: '1rem' }}>
                                Device Info
                            </h4>
                            <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                                {report.device_info}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
