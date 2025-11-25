import { useState, useRef } from 'react';

export function MediaCapture({ onCapture, maxDuration = 15 }) {
    const [capturing, setCapturing] = useState(false);
    const [mediaType, setMediaType] = useState('image');
    const [preview, setPreview] = useState(null);
    const [recordingTime, setRecordingTime] = useState(0);
    const [error, setError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);

    const startCamera = async () => {
        setError('');
        try {
            let stream;
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' },
                    audio: mediaType === 'video'
                });
            } catch (err) {
                console.warn('Environment camera failed, trying user camera', err);
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'user' },
                    audio: mediaType === 'video'
                });
            }

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                // Explicitly play to ensure live view on some devices
                try {
                    await videoRef.current.play();
                } catch (playErr) {
                    console.error('Video play error:', playErr);
                }
            }

            setCapturing(true);
        } catch (error) {
            console.error('Camera error:', error);
            setError('Could not access camera. Please ensure you have granted permissions and are using HTTPS or localhost.');
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setCapturing(false);
    };

    const capturePhoto = () => {
        if (!videoRef.current) return;

        // Ensure video has dimensions
        if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
            setError('Camera is not ready yet. Please wait a moment.');
            return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');

        // Draw whatever is on the video element, even if black
        ctx.drawImage(videoRef.current, 0, 0);

        canvas.toBlob((blob) => {
            if (!blob) {
                setError('Failed to capture image.');
                return;
            }
            const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
            setPreview(URL.createObjectURL(blob));
            onCapture(file);
            stopCamera();
            setShowSuccessModal(true);
            setTimeout(() => setShowSuccessModal(false), 2000);
        }, 'image/jpeg', 0.9);
    };

    const startRecording = () => {
        chunksRef.current = [];
        const stream = videoRef.current.srcObject;

        if (!stream) {
            setError('No camera stream available.');
            return;
        }

        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = (e) => {
            if (e.data.size > 0) {
                chunksRef.current.push(e.data);
            }
        };

        mediaRecorderRef.current.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'video/webm' });
            const file = new File([blob], 'video.webm', { type: 'video/webm' });
            setPreview(URL.createObjectURL(blob));
            onCapture(file);
            stopCamera();
            setRecordingTime(0);
            clearInterval(timerRef.current);
            setShowSuccessModal(true);
            setTimeout(() => setShowSuccessModal(false), 2000);
        };

        mediaRecorderRef.current.start();

        // Start timer
        timerRef.current = setInterval(() => {
            setRecordingTime(prev => {
                const newTime = prev + 1;
                if (newTime >= maxDuration) {
                    stopRecording();
                }
                return newTime;
            });
        }, 1000);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
    };

    const retake = () => {
        setPreview(null);
        onCapture(null);
    };

    return (
        <div className="media-capture position-relative">
            {error && (
                <div className="alert alert-danger mb-3">{error}</div>
            )}

            {showSuccessModal && (
                <div className="position-absolute top-50 start-50 translate-middle bg-success text-white p-3 rounded shadow" style={{ zIndex: 1000 }}>
                    <div className="d-flex align-items-center gap-2">
                        <span style={{ fontSize: '1.5rem' }}>✅</span>
                        <div>
                            <strong>Captured!</strong>
                            <div className="small">Media saved successfully.</div>
                        </div>
                    </div>
                </div>
            )}

            {!preview ? (
                <>
                    <div className="mb-3 d-flex gap-2 justify-content-center">
                        <button
                            type="button"
                            className={`btn ${mediaType === 'image' ? 'btn-primary-zen' : 'btn-outline-secondary'}`}
                            onClick={() => setMediaType('image')}
                        >
                            📷 Photo
                        </button>
                        <button
                            type="button"
                            className={`btn ${mediaType === 'video' ? 'btn-primary-zen' : 'btn-outline-secondary'}`}
                            onClick={() => setMediaType('video')}
                        >
                            🎥 Video
                        </button>
                    </div>

                    {capturing ? (
                        <div className="position-relative">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-100 rounded bg-black"
                                style={{ maxHeight: '400px', minHeight: '200px' }}
                            />

                            {mediaType === 'video' && mediaRecorderRef.current?.state === 'recording' && (
                                <div className="position-absolute top-0 end-0 m-3 badge bg-danger p-2">
                                    ⏺ {recordingTime}s / {maxDuration}s
                                </div>
                            )}

                            <div className="mt-3 d-flex gap-2 justify-content-center">
                                {mediaType === 'image' ? (
                                    <>
                                        <button type="button" className="btn btn-primary-zen" onClick={capturePhoto}>
                                            📸 Snap
                                        </button>
                                        <button type="button" className="btn btn-secondary" onClick={stopCamera}>
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        {mediaRecorderRef.current?.state === 'recording' ? (
                                            <button type="button" className="btn btn-danger" onClick={stopRecording}>
                                                ⏹ Stop
                                            </button>
                                        ) : (
                                            <>
                                                <button type="button" className="btn btn-primary-zen" onClick={startRecording}>
                                                    ⏺ Record
                                                </button>
                                                <button type="button" className="btn btn-secondary" onClick={stopCamera}>
                                                    Cancel
                                                </button>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    ) : (
                        <button type="button" className="btn btn-primary-zen w-100" onClick={startCamera}>
                            {mediaType === 'image' ? '📷 Open Camera' : '🎥 Open Camera'}
                        </button>
                    )}
                </>
            ) : (
                <div className="text-center">
                    {mediaType === 'image' ? (
                        <img src={preview} alt="Preview" className="img-fluid rounded mb-3" />
                    ) : (
                        <video src={preview} controls className="w-100 rounded mb-3" />
                    )}
                    <button type="button" className="btn btn-secondary" onClick={retake}>
                        🔄 Retake
                    </button>
                </div>
            )}
        </div>
    );
}
