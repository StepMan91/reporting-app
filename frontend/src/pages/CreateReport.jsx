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
    const [error, setError] = useState('');

    const { location } = useGeolocation();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const wordCount = description.trim().split(/\s+/).filter(Boolean).length;
    const isWordCountValid = wordCount > 0 && wordCount <= 150;

    const handleCapture = (file, cameraInfo) => {
        setMediaFile(file);
        setCameraUsed(cameraInfo);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!mediaFile) {
            setError('Please capture a photo or video');
            return;
        }

        if (!isWordCountValid) {
            setError('Description must be between 1 and 150 words');
            return;
        }

        if (behaviorRating === 0) {
            setError('Please provide a behavior rating');
            ```javascript
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
    const [error, setError] = useState('');

    const { location } = useGeolocation();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const wordCount = description.trim().split(/\s+/).filter(Boolean).length;
    const isWordCountValid = wordCount > 0 && wordCount <= 150;

    const handleCapture = (file, cameraInfo) => {
        setMediaFile(file);
        setCameraUsed(cameraInfo);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!mediaFile) {
            setError('Please capture a photo or video');
            return;
        }

        if (!isWordCountValid) {
            setError('Description must be between 1 and 150 words');
            return;
        }

        if (behaviorRating === 0) {
            setError('Please provide a behavior rating');
            return;
        }

        setError('');
        setLoading(true);

        try {
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

            await apiClient.post('/reports/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            navigate('/reports');
        } catch (err) {
            setError(err.response?.data?.detail || t('error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-center flex-column">
            <div style={{ width: '100%', maxWidth: '800px' }}>
                <nav className="mb-4">
                    <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                        <span>←</span> {t('dashboard')}
                    </Link>
                </nav>

                <div className="card">
                    <div className="text-center mb-4">
                        <h2 style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }}>{t('create_report')}</h2>
                        <p className="text-muted">Document the incident with details</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Media (Photo or Video)</label>
                            <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--border-radius)', padding: '1rem', background: 'var(--background)' }}>
                                <MediaCapture onCapture={handleCapture} maxDuration={15} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-textarea"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe what happened..."
                                required
                                rows="4"
                            />
                            <div style={{ textAlign: 'right', marginTop: '0.5rem', fontSize: '0.875rem' }}>
                                <span style={{ color: wordCount > 150 ? 'var(--error)' : 'var(--text-muted)' }}>
                                    {wordCount} / 150 words
                                </span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Behavior Rating</label>
                            <div style={{ background: 'var(--background)', padding: '1rem', borderRadius: 'var(--border-radius)', textAlign: 'center' }}>
                                <StarRating value={behaviorRating} onChange={setBehaviorRating} />
                            </div>
                            {behaviorRating === 0 && (
                                <div style={{ color: 'var(--error)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Please rate the behavior</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Severity Index: {severityIndex}</label>
                            <div style={{ background: 'var(--background)', padding: '1rem', borderRadius: 'var(--border-radius)' }}>
                                <SeveritySlider value={severityIndex} onChange={setSeverityIndex} />
                            </div>
                        </div>

                        {location && (
                            <div className="mb-4 text-center">
                                <span style={{ 
                                    background: 'var(--background)', 
                                    padding: '0.5rem 1rem', 
                                    borderRadius: '20px', 
                                    fontSize: '0.875rem',
                                    color: 'var(--text-muted)'
                                }}>
                                    📍 {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                                </span>
                            </div>
                        )}

                        {error && (
                            <div style={{ 
                                background: '#ffebee', 
                                color: '#c62828', 
                                padding: '1rem', 
                                borderRadius: 'var(--border-radius)', 
                                marginBottom: '1.5rem',
                                textAlign: 'center'
                            }}>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={loading}
                            style={{ padding: '1rem' }}
                        >
                            {loading ? t('loading') : 'Submit Report'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
```
