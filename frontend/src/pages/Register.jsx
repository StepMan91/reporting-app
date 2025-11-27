import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

export function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError(t('passwords_do_not_match'));
            return;
        }

        setLoading(true);

        try {
            await register(email, password);
            setShowSuccessModal(true);
        } catch (err) {
            setError(err.response?.data?.detail || t('error'));
        } finally {
            setLoading(false);
        }
    };

    const handleContinue = () => {
        navigate('/login');
    };

    return (
        <div className="flex-center" style={{ minHeight: '80vh' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <div className="text-center mb-4">
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                    <h2 style={{ color: 'var(--primary)', fontWeight: '700' }}>{t('create_account')}</h2>
                    <p className="text-muted">{t('join_us_today')}</p>
                </div>

                {error && (
                    <div style={{
                        background: '#ffebee',
                        color: '#c62828',
                        padding: '0.75rem',
                        borderRadius: '4px',
                        marginBottom: '1rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">{t('email_address')}</label>
                        <input
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">{t('password')}</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">{t('confirm_password')}</label>
                        <input
                            type="password"
                            className="form-input"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100 mt-4"
                        disabled={loading}
                    >
                        {loading ? t('loading') : t('sign_up')}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <p className="text-muted">
                        {t('already_have_account')} <Link to="/login">{t('sign_in_here')}</Link>
                    </p>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="card" style={{ maxWidth: '400px', width: '90%', textAlign: 'center' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                        <h3 style={{ color: 'var(--success)', marginBottom: '1rem' }}>{t('registration_successful')}</h3>
                        <p className="text-muted mb-4">{t('account_created_success')}</p>
                        <button
                            onClick={handleContinue}
                            className="btn btn-primary w-100"
                        >
                            {t('continue')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
