'use client';

import { useEffect, useRef } from 'react';
import { useAudioVisualizer } from './audio-visualizer-context';

export function AnimatedBackground() {
    const canvasRef = useRef(null);
    const dataArrayRef = useRef(null);
    const { getAnalyser, isActive } = useAudioVisualizer();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.baseSize = Math.random() * 3 + 1;
                this.size = this.baseSize;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.baseOpacity = Math.random() * 0.5 + 0.3;
                this.opacity = this.baseOpacity;
                this.hue = 270 + Math.random() * 30;
            }

            update(audioIntensity = 0) {
                const boost = 1 + audioIntensity * 3;
                this.speedX = (Math.random() * 0.5 - 0.25) * boost;
                this.speedY = (Math.random() * 0.5 - 0.25) * boost;
                
                this.x += this.speedX;
                this.y += this.speedY;

                this.size = this.baseSize * (1 + audioIntensity * 2);
                this.opacity = Math.min(1, this.baseOpacity * (1 + audioIntensity * 2));

                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }

            draw() {
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
                gradient.addColorStop(0, `hsla(${this.hue}, 100%, 70%, ${this.opacity})`);
                gradient.addColorStop(1, `hsla(${this.hue}, 100%, 50%, 0)`);
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const init = () => {
            particles = [];
            const numberOfParticles = Math.floor((canvas.width * canvas.height) / 12000);
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push(new Particle());
            }
        };

        const connectParticles = (audioIntensity = 0) => {
            const maxDistance = 150 + audioIntensity * 100;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        const opacity = (1 - distance / maxDistance) * (0.3 + audioIntensity * 0.7);
                        const hue = 270 + audioIntensity * 30;
                        ctx.strokeStyle = `hsla(${hue}, 100%, 60%, ${opacity})`;
                        ctx.lineWidth = 1 + audioIntensity * 2;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const getAudioIntensity = () => {
            const analyser = getAnalyser();
            if (!analyser || !isActive) return 0;
            
            if (!dataArrayRef.current) {
                dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
            }
            
            analyser.getByteFrequencyData(dataArrayRef.current);
            
            const bass = dataArrayRef.current.slice(0, 50).reduce((a, b) => a + b, 0) / 50 / 255;
            const mid = dataArrayRef.current.slice(50, 150).reduce((a, b) => a + b, 0) / 100 / 255;
            const treble = dataArrayRef.current.slice(150, 255).reduce((a, b) => a + b, 0) / 105 / 255;
            
            return (bass * 0.5 + mid * 0.3 + treble * 0.2);
        };

        const animate = () => {
            const audioIntensity = getAudioIntensity();
            
            ctx.fillStyle = `rgba(0, 0, 0, ${0.15 - audioIntensity * 0.1})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach((particle) => {
                particle.update(audioIntensity);
                particle.draw();
            });

            connectParticles(audioIntensity);

            animationFrameId = requestAnimationFrame(animate);
        };

        init();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [getAnalyser, isActive]);

    return (
        <>
            <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full"
                />
            </div>
            
            {isActive && (
                <div className="fixed bottom-6 right-6 z-50 px-4 py-2 bg-purple-900/80 backdrop-blur-sm text-purple-200 rounded-full text-sm font-medium border border-purple-500/50 flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                    </span>
                    Audio Visualizer Active
                </div>
            )}
        </>
    );
}
