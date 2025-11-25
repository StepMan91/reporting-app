import { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function MediaCapture({ onCapture, maxDuration = 15 }) {
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [mediaType, setMediaType] = useState(null); // 'image' or 'video'
    const [error, setError] = useState(null);
    const [recordingTime, setRecordingTime] = useState(0);
    const [cameraMode, setCameraMode] = useState('user'); // 'user' (front) or 'environment' (rear)
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [videoReady, setVideoReady] = useState(false);
    const { t } = useTranslation();

    const startCamera = async () => {
        try {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: cameraMode,
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: true
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                // Explicitly play the video to ensure it starts on mobile devices
                try {
                    await videoRef.current.play();
                    setVideoReady(true);
                } catch (playError) {
                    console.error("Error playing video stream:", playError);
                    setError("Could not start video preview. Please check permissions.");
                }
            }
            setError(null);
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError("Could not access camera. Please ensure you have granted permissions.");

            // Fallback to any available camera if specific mode fails
            if (cameraMode === 'environment') {
                setCameraMode('user');
            }
        }
    };

    useEffect(() => {
        startCamera();
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, [cameraMode]);

    useEffect(() => {
        let interval;
        if (isRecording) {
            interval = setInterval(() => {
                setRecordingTime(prev => {
                    if (prev >= maxDuration) {
                        stopRecording();
                        return prev;
                    }
                    return prev + 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    const toggleCamera = () => {
        setCameraMode(prev => prev === 'user' ? 'environment' : 'user');
    };

    const capturePhoto = () => {
        if (!videoReady || !videoRef.current) return;

        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0);

        canvas.toBlob((blob) => {
            const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
            setMediaType('image');
            onCapture(file, cameraMode === 'user' ? 'front' : 'rear');
            setShowSuccessModal(true);
        }, 'image/jpeg', 0.8);
    };

    const startRecording = () => {
        if (!videoRef.current || !videoRef.current.srcObject) return;

        const stream = videoRef.current.srcObject;
        const mediaRecorder = new MediaRecorder(stream);
        const chunks = [];

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            const file = new File([blob], "capture.webm", { type: "video/webm" });
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
            setMediaType('video');
            onCapture(file, cameraMode === 'user' ? 'front' : 'rear');
            setShowSuccessModal(true);
        };

        mediaRecorder.start();
        mediaRecorderRef.current = mediaRecorder;
        setIsRecording(true);
        setRecordingTime(0);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setMediaType(file.type.startsWith('video') ? 'video' : 'image');
            onCapture(file, 'upload');
            setShowSuccessModal(true);
        }
    };

    const retake = () => {
        setPreviewUrl(null);
        setMediaType(null);
        setRecordingTime(0);
        setShowSuccessModal(false);
        startCamera();
    };

    return (
        <div className="media-capture">
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

            <div style={{
                position: 'relative',
                background: '#000',
                borderRadius: 'var(--border-radius)',
                overflow: 'hidden',
                aspectRatio: '16/9',
                marginBottom: '1rem'
            }}>
                {!previewUrl ? (
                    <>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onLoadedMetadata={() => setVideoReady(true)}
                        />
                        {isRecording && (
                            <div style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'rgba(220, 53, 69, 0.8)',
                                color: 'white',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '20px',
                                fontSize: '0.875rem',
                                fontWeight: 'bold'
                            }}>
                                {recordingTime}s / {maxDuration}s
                            </div>
                        )}
                    </>
                ) : (
                    mediaType === 'image' ? (
                        <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                        <video src={previewUrl} controls style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    )
                )}
            </div>

            {!previewUrl ? (
                <div className="flex-column gap-md">
                    <div className="flex-center gap-md">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={toggleCamera}
                            title="Switch Camera"
                        >
                            🔄 Flip
                        </button>

                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={capturePhoto}
                            disabled={!videoReady}
                        >
                            📸 {t('photo')}
                        </button>

                        <button
                            type="button"
                            className={`btn ${isRecording ? 'btn-danger' : 'btn-primary'}`}
                            onClick={isRecording ? stopRecording : startRecording}
                            disabled={!videoReady}
                        >
                            {isRecording ? '⏹ Stop' : `🎥 ${t('video')}`}
                        </button>

                        <label className="btn btn-secondary" style={{ cursor: 'pointer', margin: 0 }}>
                            📁 Upload
                            <input
                                type="file"
                                accept="image/*,video/*"
                                style={{ display: 'none' }}
                                onChange={handleFileUpload}
                            />
                        </label>
                    </div>
                </div>
            ) : (
                <div className="text-center">
                    <button type="button" className="btn btn-outline" onClick={retake}>
                        🔄 {t('retake')}
                    </button>
                </div>
            )}

            {/* Success Modal Overlay */}
            {showSuccessModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'var(--surface)',
                        padding: '2rem',
                        borderRadius: 'var(--border-radius)',
                        textAlign: 'center',
                        maxWidth: '90%',
                        width: '300px'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--success)' }}>Captured!</h3>
                        <p className="text-muted mb-4">Media ready for report.</p>
                        <button
                            type="button"
                            className="btn btn-primary w-100"
                            onClick={() => setShowSuccessModal(false)}
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
