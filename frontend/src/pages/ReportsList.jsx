import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ReportCard } from '../components/ReportCard';
import apiClient from '../api/client';

export function ReportsList() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
        <>
            <nav className="nav">
                <div className="container nav-content">
                    <Link to="/dashboard" className="nav-brand">Reporting</Link>
                    <Link to="/dashboard" className="nav-link">← Back</Link>
                </div>
            </nav>

            <div className="page">
                <div className="container">
                    <div className="page-header">
                        <h1 className="page-title">My Reports</h1>
                        <p className="text-muted">View all your submitted reports</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center">
                            <div className="spinner"></div>
                        </div>
                    ) : error ? (
                        <div className="card text-center">
                            <p className="error-text">{error}</p>
                        </div>
                    ) : reports.length === 0 ? (
                        <div className="card text-center">
                            <h3>No Reports Yet</h3>
                            <p className="text-muted mb-md">Start by creating your first report</p>
                            <Link to="/create-report" className="btn btn-primary">
                                Create Report
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-2">
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
            </div>
        </>
    );
}
