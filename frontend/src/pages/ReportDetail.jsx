import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { StarRating } from '../components/StarRating';
import apiClient from '../api/client';

export function ReportDetail() {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleting, setDeleting] = useState(false);

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
        if (val < 30) return '#10b981';
        if (val < 60) return '#f59e0b';
        return '#ef4444';
    };

    if (loading) {
        return (
            <div className="page flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="page">
                <div className="container">
                    <div className="card text-center">
                        <p className="error-text">{error || 'Report not found'}</p>
                        <Link to="/reports" className="btn btn-primary mt-md">
                            Back to Reports
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <nav className="nav">
                <div className="container nav-content">
                    <Link to="/dashboard" className="nav-brand">Reporting</Link>
                    <Link to="/reports" className="nav-link">← Back to Reports</Link>
                </div>
            </nav>

            <div className="page">
                <div className="container" style={{ maxWidth: '800px' }}>
                    <div className="card">
                        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                            {report.media_type === 'image' ? (
                                <img
                                    src={`/api/${report.media_path}`}
                                    alt="Report media"
                                    style={{
                                        width: '100%',
                                        borderRadius: 'var(--radius-md)',
                                        maxHeight: '500px',
                                        objectFit: 'cover'
                                    }}
                                />
                            ) : (
                                <video
                                    src={`/api/${report.media_path}`}
                                    controls
                                    style={{
                                        width: '100%',
                                        borderRadius: 'var(--radius-md)',
                                        maxHeight: '500px'
                                    }}
                                />
                            )}
                        </div>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 'var(--spacing-md)',
                            paddingBottom: 'var(--spacing-md)',
                            borderBottom: '1px solid var(--bg-tertiary)'
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
                            <h3 style={{ color: 'var(--text-primary)' }}>Description</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                                {report.description}
                            </p>
                        </div>

                        <div className="form-group">
                            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                                Behavior Rating
                            </h4>
                            <StarRating value={report.behavior_rating} readonly />
                        </div>

                        <div className="form-group">
                            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
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
                                <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                                    Location
                                </h4>
                                <p className="text-muted">
                                    📍 {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
                                </p>
                                <a
                                    href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-secondary mt-sm"
                                >
                                    View on Map
                                </a>
                            </div>
                        )}

                        {report.device_info && (
                            <div className="form-group">
                                <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
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
        </>
    );
}
