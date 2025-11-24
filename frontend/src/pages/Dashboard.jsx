import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function Dashboard() {
    const { user, logout } = useAuth();

    const menuItems = [
        {
            title: 'Create Report',
            description: 'Document a new incident',
            icon: '📝',
            link: '/create-report',
            color: 'var(--accent-gradient)'
        },
        {
            title: 'My Reports',
            description: 'View your previous reports',
            icon: '📊',
            link: '/reports',
            color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
        },
        {
            title: 'Contact',
            description: 'Get in touch with admin',
            icon: '💬',
            link: '/contact',
            color: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
        }
    ];

    return (
        <>
            <nav className="nav">
                <div className="container nav-content">
                    <div className="nav-brand">Reporting</div>
                    <div className="nav-links">
                        <span className="text-muted">{user?.email}</span>
                        <button onClick={logout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="page">
                <div className="container">
                    <div className="page-header text-center">
                        <h1 className="page-title">Dashboard</h1>
                        <p className="text-muted">Welcome back! What would you like to do?</p>
                    </div>

                    <div className="grid grid-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.title}
                                to={item.link}
                                style={{ textDecoration: 'none' }}
                            >
                                <div className="card" style={{ height: '100%' }}>
                                    <div
                                        style={{
                                            fontSize: '3rem',
                                            marginBottom: '1rem',
                                            background: item.color,
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: 'var(--radius-md)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        {item.icon}
                                    </div>
                                    <h3 style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                                    <p className="text-muted">{item.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
