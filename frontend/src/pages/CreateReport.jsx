import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MediaCapture } from '../components/MediaCapture';
import { StarRating } from '../components/StarRating';
import { SeveritySlider } from '../components/SeveritySlider';
import { useGeolocation } from '../hooks/useGeolocation';
import { useTranslation } from 'react-i18next';
import apiClient from '../api/client';

export function CreateReport() {
    const [mediaFile, setMediaFile] = useState(null);
    const [cameraUsed, setCameraUsed] = useState(null);
    const [description, setDescription] = useState('');
    const [behaviorRating, setBehaviorRating] = useState(0);
    const [severityIndex, setSeverityIndex] = useState(50);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const { t } = useTranslation();

    const navigate = useNavigate();
    const { location, error: locationError } = useGeolocation();

    const handleCapture = (file, camera) => {
        setMediaFile(file);
        setCameraUsed(camera);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setUploadProgress(0);

        if (!mediaFile) {
            setError('Please capture a photo or video');
            return;
        }

        if (!description.trim()) {
            setError('Please provide a description');
            return;
        }

        const wordCount = description.trim().split(/\s+/).length;
        if (wordCount > 150) {
            setError('Description must be between 1 and 150 words');
            return;
        }

        if (behaviorRating === 0) {
            setError('Please provide a behavior rating');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('media', mediaFile);
        formData.append('description', description);
        formData.append('behavior_rating', behaviorRating);
        formData.append('severity_index', severityIndex);

        if (cameraUsed) {
            formData.append('camera_used', cameraUsed);
        }

        if (location) {
            formData.append('latitude', location.latitude);
            formData.append('longitude', location.longitude);
        }

        // Add device info
        const deviceInfo = `${navigator.platform} - ${navigator.userAgent}`;
        formData.append('device_info', deviceInfo);

        try {
            await apiClient.post('/reports/', formData, {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                },
            });
            setShowSuccessModal(true);
        } catch (err) {
            console.error('Report submission error:', err);
            let errorMessage = err.response?.data?.detail || 'Failed to create report. Please try again.';

            // Parse Pydantic validation errors
            if (Array.isArray(errorMessage)) {
                errorMessage = errorMessage.map(e => {
                    const field = e.loc[e.loc.length - 1];
                    return `${field}: ${e.msg}`;
                }).join('\n');
            } else if (typeof errorMessage === 'object') {
                errorMessage = JSON.stringify(errorMessage);
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    const handleSuccessContinue = () => {
        navigate('/dashboard');
    };

    return (
        <div className="flex-column gap-lg">
            <nav className="mb-4">
                <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                    <span>←</span> {t('dashboard')}
                </Link>
            </nav>

            <div className="text-center mb-4">
                <h2 style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }}>{t('create_new_report')}</h2>
                <p className="text-muted">Document safety observations</p>
            </div>

            <div className="flex-center">
                <div className="card" style={{ width: '100%', maxWidth: '600px' }}>
                    {error && (
                        <div style={{
                            background: '#ffebee',
                            color: '#c62828',
                            padding: '0.75rem',
                            borderRadius: '4px',
                            marginBottom: '1rem',
                            borderRadius: '4px',
                            marginBottom: '1rem',
                            textAlign: 'left',
                            whiteSpace: 'pre-wrap'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">{t('media_evidence')}</label>
                            <MediaCapture onCapture={handleCapture} />
                            {mediaFile && (
                                <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--success)' }}>
                                    ✅ Media captured
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">{t('description')} (Max 150 words)</label>
                            <textarea
                                className="form-textarea"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe what you observed..."
                                rows={4}
                            />
                            <div className="text-right text-muted" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                                {description.trim().split(/\s+/).filter(w => w).length} / 150 words
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Observed Behavior Rating (1-5 Stars)</label>
                            <StarRating
                                value={behaviorRating}
                                onChange={setBehaviorRating}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">{t('severity_index')}</label>
                            <SeveritySlider
                                value={severityIndex}
                                onChange={setSeverityIndex}
                            />
                        </div>

                        {locationError && (
                            <div className="text-muted mb-4" style={{ fontSize: '0.875rem', color: 'var(--warning)' }}>
                                ⚠️ Location unavailable: {typeof locationError === 'object' ? locationError.message || JSON.stringify(locationError) : locationError}
                            </div>
                        )}

                        {loading && (
                            <div className="mb-4">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                    <span>Uploading...</span>
                                    <span>{uploadProgress}%</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${uploadProgress}%`,
                                        height: '100%',
                                        background: 'var(--primary)',
                                        transition: 'width 0.3s ease'
                                    }} />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={loading}
                            style={{ padding: '1rem', fontSize: '1.1rem', fontWeight: 'bold' }}
                        >
                            {loading ? t('submitting') : '🚀 Send Report'}
                        </button>
                    </form>
                </div>
            </div>

            {showSuccessModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div className="card" style={{ maxWidth: '400px', width: '90%', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--success)' }}>Report Submitted Successfully</h3>
                        <p className="text-muted mb-4">Thank you for your contribution to safety.</p>
                        <button
                            onClick={handleSuccessContinue}
                            className="btn btn-primary w-100"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
