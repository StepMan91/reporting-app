import { useState, useRef } from 'react';

export function MediaCapture({ onCapture, maxDuration = 15 }) {
    const [capturing, setCapturing] = useState(false);
    const [mediaType, setMediaType] = useState('image');
    const [preview, setPreview] = useState(null);
    const [recordingTime, setRecordingTime] = useState(0);

    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
                audio: mediaType === 'video'
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            setCapturing(true);
        } catch (error) {
            alert('Camera access denied. Please enable camera permissions.');
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
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0);

        canvas.toBlob((blob) => {
            const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
            setPreview(URL.createObjectURL(blob));
            onCapture(file);
            stopCamera();
        }, 'image/jpeg', 0.9);
    };

    const startRecording = () => {
        chunksRef.current = [];
        const stream = videoRef.current.srcObject;

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
        <div className="media-capture">
            {!preview ? (
                <>
                    <div className="form-group">
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                            <button
                                type="button"
                                className={`btn ${mediaType === 'image' ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setMediaType('image')}
                            >
                                📷 Photo
                            </button>
                            <button
                                type="button"
                                className={`btn ${mediaType === 'video' ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setMediaType('video')}
                            >
                                🎥 Video
                            </button>
                        </div>
                    </div>

                    {capturing ? (
                        <div style={{ position: 'relative' }}>
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                style={{
                                    width: '100%',
                                    maxHeight: '400px',
                                    borderRadius: 'var(--radius-md)',
                                    backgroundColor: '#000'
                                }}
                            />

                            {mediaType === 'video' && mediaRecorderRef.current?.state === 'recording' && (
                                <div style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    right: '1rem',
                                    background: 'rgba(239, 68, 68, 0.9)',
                                    color: 'white',
                                    padding: '0.5rem 1rem',
                                    borderRadius: 'var(--radius-md)',
                                    fontWeight: '600'
                                }}>
                                    ⏺ {recordingTime}s / {maxDuration}s
                                </div>
                            )}

                            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                                {mediaType === 'image' ? (
                                    <>
                                        <button type="button" className="btn btn-primary" onClick={capturePhoto}>
                                            📸 Take Photo
                                        </button>
                                        <button type="button" className="btn btn-secondary" onClick={stopCamera}>
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        {mediaRecorderRef.current?.state === 'recording' ? (
                                            <button type="button" className="btn btn-danger" onClick={stopRecording}>
                                                ⏹ Stop Recording
                                            </button>
                                        ) : (
                                            <>
                                                <button type="button" className="btn btn-primary" onClick={startRecording}>
                                                    ⏺ Start Recording
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
                        <button type="button" className="btn btn-primary" onClick={startCamera}>
                            {mediaType === 'image' ? '📷 Open Camera' : '🎥 Open Camera'}
                        </button>
                    )}
                </>
            ) : (
                <div>
                    {mediaType === 'image' ? (
                        <img src={preview} alt="Preview" style={{
                            width: '100%',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: '1rem'
                        }} />
                    ) : (
                        <video src={preview} controls style={{
                            width: '100%',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: '1rem'
                        }} />
                    )}
                    <button type="button" className="btn btn-secondary" onClick={retake}>
                        🔄 Retake
                    </button>
                </div>
            )}
        </div>
    );
}
