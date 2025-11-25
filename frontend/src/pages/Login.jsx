import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import anime from 'animejs/lib/anime.es.js';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const logoRef = useRef(null);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            // window.alert(t('success')); // Removed alert for smoother flow
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || t('error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5 d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
            <div className="col-md-6 col-lg-4">
                <div className="card-zen p-4">
                    <div className="text-center mb-4">
                        <div ref={logoRef} className="mb-3">
                            <img src="/logo.svg" alt="Logo" width="64" height="64" />
                        </div>
                        <h1 className="h3 mb-3 fw-normal text-accent-2">{t('welcome_back')}</h1>
                        <p className="text-accent-1">{t('sign_in_text')}</p>
                    </div>

                    {error && (
                        <div className="alert alert-danger bg-danger text-white border-0" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label text-accent-1">{t('email')}</label>
                            <input
                                type="email"
                                className="form-control form-control-zen"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                placeholder="name@example.com"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label text-accent-1">{t('password')}</label>
                            <input
                                type="password"
                                className="form-control form-control-zen"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary-zen w-100 py-2 mb-3"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2 spinner-border-zen" role="status" aria-hidden="true"></span>
                                    {t('loading')}
                                </>
                            ) : (
                                t('login')
                            )}
                        </button>

                        <div className="text-center">
                            <p className="mb-0 text-accent-1">
                                {t('no_account')}{' '}
                                <Link to="/register" className="text-accent-3 fw-bold text-decoration-none">
                                    {t('register_here')}
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
