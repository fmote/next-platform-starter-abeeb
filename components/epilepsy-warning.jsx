'use client';

import { useEffect, useState } from 'react';

export function EpilepsyWarning() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const hasSeenWarning = localStorage.getItem('epilepsy-warning-seen');
        if (!hasSeenWarning) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('epilepsy-warning-seen', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
            <div className="relative max-w-2xl mx-4 p-8 bg-gradient-to-br from-purple-900/90 to-black border-2 border-purple-500 rounded-2xl shadow-2xl animate-pulse-slow">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent rounded-2xl blur-xl" />
                <div className="relative z-10">
                    <div className="flex items-center justify-center mb-6">
                        <div className="p-4 bg-red-500/20 rounded-full border-2 border-red-500">
                            <svg
                                className="w-12 h-12 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>
                    </div>
                    
                    <h2 className="text-3xl font-bold text-center mb-4 text-white bg-clip-text">
                        ⚠️ PHOTOSENSITIVE SEIZURE WARNING
                    </h2>
                    
                    <div className="space-y-4 text-gray-200 mb-8">
                        <p className="text-center text-lg">
                            This website contains <strong className="text-purple-300">flashing lights, strobe effects, and rapidly changing visuals</strong> that react to music.
                        </p>
                        
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                            <p className="text-sm">
                                <strong className="text-red-400">Warning:</strong> A very small percentage of people may experience a seizure when exposed to certain visual stimuli, including flashing lights or patterns. This may occur even if they have never had a seizure before.
                            </p>
                        </div>
                        
                        <p className="text-center text-sm">
                            If you or anyone in your family has an epileptic condition or has experienced seizures, please consult a doctor before entering this site.
                        </p>
                        
                        <p className="text-center text-sm text-gray-400">
                            By clicking "I Understand", you acknowledge this warning and agree to proceed at your own risk.
                        </p>
                    </div>
                    
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => window.history.back()}
                            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                        >
                            Go Back
                        </button>
                        <button
                            onClick={handleAccept}
                            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-500/50"
                        >
                            I Understand, Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
