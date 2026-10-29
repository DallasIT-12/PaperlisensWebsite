'use client';

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

interface CigaretteBoxViewerProps {
    desktopHeight?: string;
    mobileHeight?: string;
    borderRadius?: number;
    variant?: 'red' | 'gold' | 'white';
}

export interface CigaretteBoxViewerHandle {
    getIframe: () => HTMLIFrameElement | null;
}

const CigaretteBoxViewer = forwardRef<CigaretteBoxViewerHandle, CigaretteBoxViewerProps>(({
    desktopHeight = '600px',
    mobileHeight = '75vh',
    borderRadius = 24,
    variant = 'red',
}, ref) => {
    const [loaded, setLoaded] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useImperativeHandle(ref, () => ({
        getIframe: () => iframeRef.current,
    }));

    // BUG 4 FIX: Send variant to iframe via postMessage
    // Also re-send on iframe load in case variant was set before iframe was ready
    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        const send = () => {
            iframe.contentWindow?.postMessage(
                { type: 'setVariant', variant },
                '*'
            );
        };

        // Send immediately if already loaded
        if (loaded) send();

        // Also send on (re)load
        iframe.addEventListener('load', send);
        return () => iframe.removeEventListener('load', send);
    }, [variant, loaded]);

    return (
        <div
            id="cigarette-box-3d-viewer"
            style={{
                position: 'relative',
                width: '100%',
                borderRadius: `${borderRadius}px`,
                overflow: 'hidden',
                background: '#0e0e0e',
                touchAction: 'none',
                overscrollBehavior: 'contain',
            }}
        >
            {!loaded && (
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '20px',
                        background: '#0e0e0e',
                    }}
                >
                    <div
                        style={{
                            width: '80px',
                            height: '120px',
                            borderRadius: '6px',
                            background: 'linear-gradient(145deg, rgba(201,168,76,0.08), rgba(201,168,76,0.03))',
                            border: '1px solid rgba(201,168,76,0.15)',
                            animation: 'skeletonPulse 1.5s ease-in-out infinite',
                        }}
                    />
                    <div
                        style={{
                            width: '160px',
                            height: '2px',
                            borderRadius: '1px',
                            overflow: 'hidden',
                            background: 'rgba(255,255,255,0.07)',
                        }}
                    >
                        <div
                            style={{
                                width: '40%',
                                height: '100%',
                                background: 'linear-gradient(90deg, #c9a84c, #e8c87a)',
                                animation: 'skeletonSlide 1.2s ease-in-out infinite',
                            }}
                        />
                    </div>
                    <span
                        style={{
                            fontSize: '0.6rem',
                            letterSpacing: '0.3em',
                            textTransform: 'uppercase',
                            color: 'rgba(201,168,76,0.5)',
                            fontFamily: "'Montserrat', sans-serif",
                        }}
                    >
                        Memuat 3D Viewer…
                    </span>
                    <style>{`
                        @keyframes skeletonPulse {
                            0%, 100% { opacity: .4; transform: scale(1); }
                            50%      { opacity: 1;  transform: scale(1.04); }
                        }
                        @keyframes skeletonSlide {
                            0%   { transform: translateX(-100%); }
                            100% { transform: translateX(350%); }
                        }
                    `}</style>
                </div>
            )}

            <style>{`
                #cigarette-box-3d-viewer { height: ${desktopHeight}; }
                @media (max-width: 768px) {
                    #cigarette-box-3d-viewer { height: ${mobileHeight}; }
                }
            `}</style>

            <iframe
                ref={iframeRef}
                src="/3d-viewer/cigarette-box.html"
                title="3D Cigarette Box Viewer"
                loading="eager"
                onLoad={() => setLoaded(true)}
                allow="accelerometer; autoplay"
                style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    display: 'block',
                    opacity: loaded ? 1 : 0,
                    transition: 'opacity 0.4s ease',
                }}
            />
        </div>
    );
});

CigaretteBoxViewer.displayName = 'CigaretteBoxViewer';
export default CigaretteBoxViewer;
