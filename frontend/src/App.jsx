import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { CreateReport } from './pages/CreateReport';
import { ReportsList } from './pages/ReportsList';
import { ReportDetail } from './pages/ReportDetail';
import { Contact } from './pages/Contact';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './hooks/useAuth';
import './index.css';

function Layout({ children }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <Link to="/" className="brand-logo">
                    Mobile Reporting
                </Link>
                {user && (
                    <div className="flex-center gap-md">
                        <span className="text-muted">{user.email}</span>
                        <button
                            onClick={handleLogout}
                            className="btn btn-outline"
                            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </header>
            <main className="main-content">
                {children}
            </main>
            <footer className="text-center p-4 text-muted" style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
                <small>&copy; 2025 Mobile Reporting App</small>
            </footer>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/create-report"
                        element={
                            <ProtectedRoute>
                                <CreateReport />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/reports"
                        element={
                            <ProtectedRoute>
                                <ReportsList />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/reports/:id"
                        element={
                            <ProtectedRoute>
                                <ReportDetail />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/contact"
                        element={
                            <ProtectedRoute>
                                <Contact />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
