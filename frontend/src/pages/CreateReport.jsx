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
        <div className="container">
            <nav className="mb-4">
                <Link to="/dashboard" className="text-accent-1 text-decoration-none">
                    ← {t('dashboard')}
                </Link>
            </nav>

            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card-zen p-4">
                        <div className="text-center mb-4">
                            <h1 className="h3 mb-2 text-accent-2">{t('create_report')}</h1>
                            <p className="text-accent-1">Document the incident with details</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="form-label text-accent-1">Media (Photo or Video)</label>
                                <MediaCapture onCapture={handleCapture} maxDuration={15} />
                            </div>

                            <div className="mb-4">
                                <label className="form-label text-accent-1">Description</label>
                                <textarea
                                    className="form-control form-control-zen"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe what happened..."
                                    required
                                    rows="4"
                                />
                                <div className="d-flex justify-content-end mt-1">
                                    <span
                                        className="small"
                                        style={{
                                            color: wordCount > 150 ? 'var(--error)' : 'var(--accent-1)'
                                        }}
                                    >
                                        {wordCount} / 150 words
                                    </span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label text-accent-1">Behavior Rating</label>
                                <div className="bg-zen-secondary p-3 rounded text-center">
                                    <StarRating value={behaviorRating} onChange={setBehaviorRating} />
                                </div>
                                {behaviorRating === 0 && (
                                    <div className="text-danger small mt-1">Please rate the behavior</div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="form-label text-accent-1">Severity Index: {severityIndex}</label>
                                <div className="bg-zen-secondary p-3 rounded">
                                    <SeveritySlider value={severityIndex} onChange={setSeverityIndex} />
                                </div>
                            </div>

                            {location && (
                                <div className="mb-4 text-center">
                                    <span className="badge bg-zen-secondary text-accent-1">
                                        📍 {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                                    </span>
                                </div>
                            )}

                            {error && (
                                <div className="alert alert-danger bg-danger text-white border-0 mb-4">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn btn-primary-zen w-100 py-3"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2 spinner-border-zen" role="status" aria-hidden="true"></span>
                                        {t('loading')}
                                    </>
                                ) : (
                                    'Submit Report'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
