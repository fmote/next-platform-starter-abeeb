'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from 'components/card';
import { useAudioVisualizer } from 'components/audio-visualizer-context';

export default function RadioPage() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.7);
    const [nowPlaying, setNowPlaying] = useState(null);
    const [error, setError] = useState(null);
    const audioRef = useRef(null);
    const { connectAudioElement, disconnectAudio } = useAudioVisualizer();
    const isConnectedRef = useRef(false);

    useEffect(() => {
        fetchNowPlaying();
        const interval = setInterval(fetchNowPlaying, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const fetchNowPlaying = async () => {
        try {
            const response = await fetch('https://radio.ledd.live/api/nowplaying/ledd.fm');
            const data = await response.json();
            setNowPlaying(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch now playing information');
        }
    };

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                if (!isConnectedRef.current) {
                    const connected = connectAudioElement(audioRef.current);
                    if (connected) {
                        isConnectedRef.current = true;
                    }
                }
                audioRef.current.play().then(() => {
                    setIsPlaying(true);
                }).catch((error) => {
                    console.error('Error playing audio:', error);
                    setError('Failed to play audio. Please try again.');
                });
            }
        }
    };

    const handleVolumeChange = (e) => {
        setVolume(parseFloat(e.target.value));
    };

    const albumArt = nowPlaying?.now_playing?.song?.art;

    return (
        <div className="min-h-screen">
            <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-12">
                <section className="text-center pt-8">
                    <h1 className="mb-4 bg-gradient-to-r from-primary via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        Ledd.FM
                    </h1>
                    <p className="text-lg text-neutral-400">
                        Live streaming radio
                    </p>
                </section>

                <section className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/20 to-blue-500/20 blur-3xl -z-10" />
                    
                    <div className="bg-neutral-900/80 backdrop-blur-xl rounded-2xl border border-neutral-800 overflow-hidden shadow-2xl">
                        <div className="relative">
                            {albumArt ? (
                                <div className="relative h-64 sm:h-96 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-900" />
                                    <img 
                                        src={albumArt} 
                                        alt="Album Art"
                                        className="w-full h-full object-cover transition-all duration-700"
                                    />
                                </div>
                            ) : (
                                <div className="h-64 sm:h-96 bg-gradient-to-br from-primary/30 via-purple-500/30 to-blue-500/30 flex items-center justify-center">
                                    <div className="w-32 h-32 rounded-full bg-neutral-800/50 backdrop-blur flex items-center justify-center">
                                        <svg className="w-16 h-16 text-neutral-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                                        </svg>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 sm:p-8">
                            <audio
                                ref={audioRef}
                                src="https://radio.ledd.live/listen/ledd.fm/radio.mp3"
                                preload="none"
                            />

                            {nowPlaying?.now_playing?.song && (
                                <div className="mb-6 text-center">
                                    <h2 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
                                        {nowPlaying.now_playing.song.title || 'Unknown Title'}
                                    </h2>
                                    <p className="text-lg text-neutral-400">
                                        {nowPlaying.now_playing.song.artist || 'Unknown Artist'}
                                    </p>
                                </div>
                            )}

                            <div className="flex flex-col items-center gap-6">
                                <button
                                    onClick={togglePlay}
                                    className="group relative w-20 h-20 rounded-full bg-gradient-to-br from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-500/90 shadow-lg shadow-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/60"
                                >
                                    {isPlaying ? (
                                        <svg className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-neutral-900" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-neutral-900" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>

                                <div className="w-full max-w-md">
                                    <div className="flex items-center gap-4">
                                        <svg className="w-5 h-5 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                                        </svg>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.01"
                                            value={volume}
                                            onChange={handleVolumeChange}
                                            className="flex-1 h-2 bg-neutral-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-primary/50 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                                        />
                                        <span className="text-sm text-neutral-400 w-12 text-right font-medium">
                                            {Math.round(volume * 100)}%
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 text-sm">
                                    {nowPlaying?.listeners && (
                                        <div className="flex items-center gap-2 px-4 py-2 bg-neutral-800/50 rounded-full border border-neutral-700">
                                            <svg className="w-4 h-4 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                            </svg>
                                            <span className="text-neutral-300 font-medium">
                                                {nowPlaying.listeners.current || 0}
                                            </span>
                                        </div>
                                    )}

                                    {nowPlaying?.live?.is_live && (
                                        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full border border-red-500/50">
                                            <span className="relative flex h-3 w-3">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                            </span>
                                            <span className="text-red-400 font-bold text-xs uppercase tracking-wider">
                                                Live
                                            </span>
                                            {nowPlaying.live.streamer_name && (
                                                <span className="text-neutral-300">
                                                    {nowPlaying.live.streamer_name}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {error && (
                    <section>
                        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 text-center">
                            {error}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
