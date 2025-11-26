import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
// import anime from 'animejs';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const logoRef = useRef(null);

    /*
    useEffect(() => {
        // Anime.js animation for the logo
        anime({
            targets: logoRef.current,
            translateY: [-20, 0],
            opacity: [0, 1],
            duration: 1500,
            easing: 'easeOutElastic(1, .8)',
            delay: 200
        });
    }, []);
    */

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(t('invalid_credentials'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-center" style={{ minHeight: '80vh' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <div className="text-center mb-4">
                    <div
                        ref={logoRef}
                        style={{
                            fontSize: '3rem',
                            marginBottom: '1rem',
                            display: 'inline-block'
                        }}
                    >
                        🏭
                    </div>
                    <h2 style={{ color: 'var(--primary)', fontWeight: '700' }}>{t('welcome_back')}</h2>
                    <p className="text-muted">{t('sign_in_to_continue')}</p>
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

                    <button
                        type="submit"
                        className="btn btn-primary w-100 mt-4"
                        disabled={loading}
                    >
                        {loading ? t('loading') : t('sign_in')}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <p className="text-muted">
                        {t('dont_have_account')} <Link to="/register">{t('register_here')}</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
