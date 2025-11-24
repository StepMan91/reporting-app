import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MediaCapture } from '../components/MediaCapture';
import { StarRating } from '../components/StarRating';
import { SeveritySlider } from '../components/SeveritySlider';
import { useGeolocation } from '../hooks/useGeolocation';
import apiClient from '../api/client';

export function CreateReport() {
    const [mediaFile, setMediaFile] = useState(null);
    const [description, setDescription] = useState('');
    const [behaviorRating, setBehaviorRating] = useState(0);
    const [severityIndex, setSeverityIndex] = useState(50);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { location } = useGeolocation();
    const navigate = useNavigate();

    const wordCount = description.trim().split(/\s+/).filter(Boolean).length;
    const isWordCountValid = wordCount > 0 && wordCount <= 150;

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
            setError(err.response?.data?.detail || 'Failed to create report. Please try again.');
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
                        <h1 className="page-title">Create Report</h1>
                        <p className="text-muted">Document the incident with details</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="card">
                            <div className="form-group">
                                <label className="form-label">Media (Photo or Video)</label>
                                <MediaCapture onCapture={setMediaFile} maxDuration={15} />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-textarea"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe what happened..."
                                    required
                                />
                                <span
                                    className="helper-text"
                                    style={{
                                        color: wordCount > 150 ? 'var(--error)' : 'var(--text-muted)'
                                    }}
                                >
                                    {wordCount} / 150 words
                                </span>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Behavior Rating</label>
                                <StarRating value={behaviorRating} onChange={setBehaviorRating} />
                                {behaviorRating === 0 && (
                                    <span className="helper-text">Please rate the behavior</span>
                                )}
                            </div>

                            <div className="form-group">
                                <SeveritySlider value={severityIndex} onChange={setSeverityIndex} />
                            </div>

                            {location && (
                                <div className="form-group">
                                    <span className="helper-text">
                                        📍 Location: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                                    </span>
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
                                {loading ? 'Submitting...' : 'Submit Report'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
