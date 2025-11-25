import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { CreateReport } from './pages/CreateReport';
import { ReportsList } from './pages/ReportsList';
import { ReportDetail } from './pages/ReportDetail';
import { Contact } from './pages/Contact';
import { ProtectedRoute } from './components/ProtectedRoute';
import './index.css';

import { useAuth } from './hooks/useAuth';
import { Link } from 'react-router-dom';

function Layout({ children }) {
    const { user, logout } = useAuth();

    return (
        <div className="d-flex flex-column min-vh-100">
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
                <div className="container">
                    <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
                        <img src="/logo.svg" alt="Logo" width="32" height="32" className="d-inline-block align-text-top" />
                        <span className="fw-bold">Reporting App</span>
                    </Link>

                    {user && (
                        <div className="d-flex align-items-center gap-3">
                            <span className="text-white d-none d-md-block">{user.email}</span>
                            <button
                                onClick={logout}
                                className="btn btn-outline-light btn-sm"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            <main className="flex-grow-1 bg-light py-4">
                {children}
            </main>

            <footer className="bg-dark text-white py-4 mt-auto">
                <div className="container text-center">
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                        <img src="/logo.svg" alt="Logo" width="24" height="24" />
                        <span className="h5 mb-0">Reporting App</span>
                    </div>
                    <p className="mb-0 text-white-50">
                        &copy; {new Date().getFullYear()} Bastien Caspani. All rights reserved.
                    </p>
                </div>
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
