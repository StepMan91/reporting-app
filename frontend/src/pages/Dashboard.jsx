import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

export function Dashboard() {
    const { user } = useAuth();
    const { t } = useTranslation();

    // Extract first name from email (e.g., "bastien.caspani@web.com" -> "Bastien")
    const firstName = user?.email
        ? user.email.split('@')[0].split('.')[0].charAt(0).toUpperCase() + user.email.split('@')[0].split('.')[0].slice(1)
        : 'User';

    return (
        <div className="flex-column gap-lg">
            <div className="text-center mb-4">
                <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--secondary)' }}>
                    {t('welcome_user', { name: firstName })}
                </h1>
                <p className="text-muted" style={{ fontSize: '1.2rem' }}>
                    {t('dashboard_subtitle')}
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem'
            }}>
                {/* Create Report Card */}
                <div className="card text-center" style={{ transition: 'transform 0.2s' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>{t('create_new_report')}</h3>
                    <p className="text-muted mb-4">
                        Document incidents with photos, videos, and detailed descriptions.
                    </p>
                    <Link to="/create-report" className="btn btn-primary w-100">
                        {t('start_report')}
                    </Link>
                </div>

                {/* View Reports Card */}
                <div className="card text-center" style={{ transition: 'transform 0.2s' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📊</div>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>{t('view_history')}</h3>
                    <p className="text-muted mb-4">
                        Access your past reports, check status, and review details.
                    </p>
                    <Link to="/reports" className="btn btn-outline w-100">
                        {t('view_reports')}
                    </Link>
                </div>

                {/* Contact Card */}
                <div className="card text-center" style={{ transition: 'transform 0.2s' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📞</div>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>{t('contact_support')}</h3>
                    <p className="text-muted mb-4">
                        Need help? Get in touch with our support team.
                    </p>
                    <Link to="/contact" className="btn btn-secondary w-100">
                        {t('contact_us')}
                    </Link>
                </div>
            </div>
        </div>
    );
}
