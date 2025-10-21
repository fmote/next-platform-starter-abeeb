import '../styles/globals.css';
import { Footer } from '../components/footer';
import { Header } from '../components/header';
import { AnimatedBackground } from '../components/animated-background';
import { EpilepsyWarning } from '../components/epilepsy-warning';
import { AudioVisualizerProvider } from '../components/audio-visualizer-context';

export const metadata = {
    title: {
        template: '%s | Netlify',
        default: 'Netlify Starter'
    }
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.svg" sizes="any" />
            </head>
            <body className="antialiased text-white bg-black">
                <AudioVisualizerProvider>
                    <EpilepsyWarning />
                    <AnimatedBackground />
                    <div className="flex flex-col min-h-screen px-6 sm:px-12 relative z-10">
                        <div className="flex flex-col w-full max-w-5xl mx-auto grow">
                            <Header />
                            <main className="grow">{children}</main>
                            <Footer />
                        </div>
                    </div>
                </AudioVisualizerProvider>
            </body>
        </html>
    );
}
