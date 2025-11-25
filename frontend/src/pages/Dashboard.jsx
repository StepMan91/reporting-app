import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

export function Dashboard() {
    const { user } = useAuth();
    const { t } = useTranslation();

    const getFirstName = (email) => {
        if (!email) return 'User';
        const namePart = email.split('@')[0];
        const firstName = namePart.split('.')[0];
        return firstName.charAt(0).toUpperCase() + firstName.slice(1);
    };

    const menuItems = [
        {
            title: t('create_report'),
            description: 'Document a new incident',
            icon: '�',
            link: '/create-report',
            color: 'var(--accent-3)'
        },
        {
            title: t('reports'),
            description: 'View your previous reports',
            icon: '📊',
            link: '/reports',
            color: 'var(--accent-2)'
        },
        {
            title: t('contact'),
            description: 'Get in touch with admin',
            icon: '💬',
            link: '/contact',
            color: 'var(--accent-1)'
        }
    ];

    return (
        <div className="container">
            <div className="text-center mb-5">
                <h1 className="display-4 fw-bold text-accent-2">
                    {t('welcome')}, {getFirstName(user?.email)}!
                </h1>
                <p className="lead text-accent-1">What would you like to do today?</p>
            </div>

            <div className="row g-4">
                {menuItems.map((item) => (
                    <div key={item.title} className="col-md-4">
                        <Link to={item.link} className="text-decoration-none">
                            <div className="card-zen h-100 p-4 text-center transition-transform hover-scale">
                                <div
                                    className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                                    style={{
                                        width: '80px',
                                        height: '80px',
                                        backgroundColor: item.color,
                                        fontSize: '2.5rem'
                                    }}
                                >
                                    {item.icon}
                                </div>
                                <h3 className="h4 mb-2 text-white">{item.title}</h3>
                                <p className="text-white-50 mb-0">{item.description}</p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
