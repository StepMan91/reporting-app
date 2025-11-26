import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ReportCard } from '../components/ReportCard';
import apiClient from '../api/client';
import { useTranslation } from 'react-i18next';

export function ReportsList() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        date_from: '',
        date_to: '',
        rating_min: '',
        rating_max: '',
        severity_min: '',
        severity_max: ''
    });
    const [sort, setSort] = useState({
        by: 'created_at',
        order: 'desc'
    });
    const [pagination, setPagination] = useState({
        skip: 0,
        limit: 10
    });
    const { t } = useTranslation();

    const navigate = useNavigate();

    useEffect(() => {
        fetchReports();
    }, [pagination.skip, pagination.limit, sort, filters]); // Re-fetch when these change

    const fetchReports = async () => {
        setLoading(true);
        try {
            const params = {
                skip: pagination.skip,
                limit: pagination.limit,
                sort_by: sort.by,
                sort_order: sort.order,
                ...filters
            };
            // Remove empty filters
            Object.keys(params).forEach(key => {
                if (params[key] === '' || params[key] === null) {
                    delete params[key];
                }
            });

            const response = await apiClient.get('/reports/', { params });
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

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setPagination(prev => ({ ...prev, skip: 0 })); // Reset to first page on filter change
    };

    const handleSortChange = (e) => {
        const { name, value } = e.target;
        setSort(prev => ({ ...prev, [name]: value }));
    };

    const handleLimitChange = (e) => {
        setPagination(prev => ({ ...prev, limit: parseInt(e.target.value), skip: 0 }));
    };

    const handlePageChange = (direction) => {
        setPagination(prev => ({
            ...prev,
            skip: direction === 'next' ? prev.skip + prev.limit : Math.max(0, prev.skip - prev.limit)
        }));
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

            {/* Filters and Controls */}
            <div className="card mb-4">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>

                    {/* Date Range */}
                    <div className="form-group">
                        <label className="form-label">Date From</label>
                        <input type="date" name="date_from" className="form-input" value={filters.date_from} onChange={handleFilterChange} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Date To</label>
                        <input type="date" name="date_to" className="form-input" value={filters.date_to} onChange={handleFilterChange} />
                    </div>

                    {/* Rating */}
                    <div className="form-group">
                        <label className="form-label">Min Rating (1-5)</label>
                        <input type="number" name="rating_min" className="form-input" min="1" max="5" value={filters.rating_min} onChange={handleFilterChange} />
                    </div>

                    {/* Severity */}
                    <div className="form-group">
                        <label className="form-label">Severity Range (0-100)</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input type="number" name="severity_min" className="form-input" placeholder="Min" min="0" max="100" value={filters.severity_min} onChange={handleFilterChange} />
                            <input type="number" name="severity_max" className="form-input" placeholder="Max" min="0" max="100" value={filters.severity_max} onChange={handleFilterChange} />
                        </div>
                    </div>

                    {/* Sort */}
                    <div className="form-group">
                        <label className="form-label">Sort By</label>
                        <select name="by" className="form-input" value={sort.by} onChange={handleSortChange}>
                            <option value="created_at">Date</option>
                            <option value="behavior_rating">Rating</option>
                            <option value="severity_index">Severity</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Order</label>
                        <select name="order" className="form-input" value={sort.order} onChange={handleSortChange}>
                            <option value="desc">Desc</option>
                            <option value="asc">Asc</option>
                        </select>
                    </div>

                    {/* Items per page */}
                    <div className="form-group">
                        <label className="form-label">Items per page</label>
                        <select className="form-input" value={pagination.limit} onChange={handleLimitChange}>
                            <option value="10">10</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                </div>
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
                    <h3 style={{ marginBottom: '1rem' }}>No Reports Found</h3>
                    <p className="text-muted mb-4">Try adjusting your filters or create a new report</p>
                    <Link to="/create-report" className="btn btn-primary">
                        Create Report
                    </Link>
                </div>
            ) : (
                <>
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

                    {/* Pagination Controls */}
                    <div className="flex-center gap-md mt-4">
                        <button
                            className="btn btn-outline"
                            onClick={() => handlePageChange('prev')}
                            disabled={pagination.skip === 0}
                        >
                            Previous
                        </button>
                        <span className="text-muted">
                            Page {Math.floor(pagination.skip / pagination.limit) + 1}
                        </span>
                        <button
                            className="btn btn-outline"
                            onClick={() => handlePageChange('next')}
                            disabled={reports.length < pagination.limit}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
