import { useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';

export function Contact() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);

        try {
            await apiClient.post('/contact/', {
                name,
                email,
                message
            });

            setSuccess(true);
            setName('');
            setEmail('');
            setMessage('');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <nav className="nav">
                <div className="container nav-content">
                    <Link to="/dashboard" className="nav-brand">Reporting</Link>
                    <Link to="/dashboard" className="nav-link">← Back</Link>
                </div>
            </nav>

            <div className="page">
                <div className="container" style={{ maxWidth: '600px' }}>
                    <div className="page-header">
                        <h1 className="page-title">Contact Admin</h1>
                        <p className="text-muted">Send a message to the administrator</p>
                    </div>

                    <div className="card">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    placeholder="Your name"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="your@email.com"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Message</label>
                                <textarea
                                    className="form-textarea"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                    placeholder="What would you like to say?"
                                    style={{ minHeight: '150px' }}
                                />
                            </div>

                            {success && (
                                <div style={{
                                    padding: '1rem',
                                    background: 'rgba(16, 185, 129, 0.1)',
                                    border: '1px solid var(--success)',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'var(--success)',
                                    marginBottom: 'var(--spacing-md)'
                                }}>
                                    ✓ Message sent successfully! We'll get back to you soon.
                                </div>
                            )}

                            {error && (
                                <div className="error-text mb-md">{error}</div>
                            )}

                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%' }}
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
