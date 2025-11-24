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

function App() {
    return (
        <BrowserRouter>
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
        </BrowserRouter>
    );
}

export default App;
