'use client';

import { createContext, useContext, useRef, useState } from 'react';

const AudioVisualizerContext = createContext();

export function AudioVisualizerProvider({ children }) {
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceRef = useRef(null);
    const [isActive, setIsActive] = useState(false);

    const connectAudioElement = (audioElement) => {
        try {
            if (sourceRef.current) {
                if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
                    audioContextRef.current.resume();
                }
                return true;
            }

            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }

            if (audioContextRef.current.state === 'suspended') {
                audioContextRef.current.resume();
            }

            if (!analyserRef.current) {
                analyserRef.current = audioContextRef.current.createAnalyser();
                analyserRef.current.fftSize = 512;
            }

            sourceRef.current = audioContextRef.current.createMediaElementSource(audioElement);
            sourceRef.current.connect(analyserRef.current);
            analyserRef.current.connect(audioContextRef.current.destination);

            setIsActive(true);
            return true;
        } catch (error) {
            console.error('Error connecting audio element:', error);
            return false;
        }
    };

    const disconnectAudio = () => {
        if (sourceRef.current) {
            try {
                sourceRef.current.disconnect();
            } catch (e) {
                console.error('Error disconnecting audio:', e);
            }
        }
        setIsActive(false);
    };

    const getAnalyser = () => analyserRef.current;

    return (
        <AudioVisualizerContext.Provider
            value={{
                connectAudioElement,
                disconnectAudio,
                getAnalyser,
                isActive,
            }}
        >
            {children}
        </AudioVisualizerContext.Provider>
    );
}

export function useAudioVisualizer() {
    const context = useContext(AudioVisualizerContext);
    if (!context) {
        throw new Error('useAudioVisualizer must be used within AudioVisualizerProvider');
    }
    return context;
}
