import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ReportCard } from '../components/ReportCard';
import apiClient from '../api/client';
import { useTranslation } from 'react-i18next';

export function ReportsList() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { t } = useTranslation();

    const navigate = useNavigate();

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const response = await apiClient.get('/reports/');
            setReports(response.data);
        } catch (err) {
            setError('Failed to load reports');
        } finally {
            setLoading(false);
        }
    };

    const handleReportClick = (reportId) => {
        navigate(`/reports/${reportId}`);
    };

    return (
        <div className="flex-column gap-lg">
            <nav className="mb-4">
                <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                    <span>←</span> {t('dashboard')}
                </Link>
            </nav>

            <div className="text-center mb-4">
                <h2 style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }}>{t('my_reports')}</h2>
                <p className="text-muted">View all your submitted reports</p>
            </div>

            {loading ? (
                <div className="flex-center" style={{ padding: '2rem' }}>
                    <div className="spinner"></div>
                </div>
            ) : error ? (
                <div className="card text-center" style={{ color: 'var(--error)' }}>
                    <p>{error}</p>
                </div>
            ) : reports.length === 0 ? (
                <div className="card text-center" style={{ padding: '3rem 1rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                    <h3 style={{ marginBottom: '1rem' }}>No Reports Yet</h3>
                    <p className="text-muted mb-4">Start by creating your first report</p>
                    <Link to="/create-report" className="btn btn-primary">
                        Create Report
                    </Link>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {reports.map((report) => (
                        <ReportCard
                            key={report.id}
                            report={report}
                            onClick={() => handleReportClick(report.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
