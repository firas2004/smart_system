import { Canvas } from '@react-three/fiber';
import { SmartCityScene } from '@/components/three/SmartCityScene';
import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { StatsSection } from '@/components/sections/StatsSection';
import { HowItWorksSection } from '@/components/sections/HowItWorksSection';
import { CTASection } from '@/components/sections/CTASection';
import { Link } from 'react-router-dom';

const WelcomePage = () => {
    return (
        <div className="bg-[#020817] min-h-screen text-white font-sans overflow-x-hidden selection:bg-[#00d4ff]/30 relative">
            
            {/* Top Navigation Overlay */}
            <div className="fixed top-0 left-0 w-full p-6 z-50 flex justify-between items-center pointer-events-none">
                <div className="text-xl font-bold tracking-widest text-white drop-shadow-[0_0_10px_rgba(0,212,255,0.8)] pointer-events-auto" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    NEXUS AI
                </div>
                <Link to="/login" className="px-6 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/20 text-sm font-bold tracking-wide transition-all pointer-events-auto">
                    Login
                </Link>
            </div>

            {/* Fixed 3D Canvas Background */}
            <div className="fixed inset-0 z-0 w-full h-full pointer-events-none">
                <Canvas 
                    shadows 
                    camera={{ position: [0, 12, 22], fov: 60 }}
                    gl={{ 
                        toneMapping: 4, /* ACESFilmicToneMapping */
                        toneMappingExposure: 1.2,
                        antialias: true
                    }}
                    style={{ background: '#020817' }}
                >
                    <SmartCityScene />
                </Canvas>
            </div>

            {/* Scroll Container (500vh to fit 5 sections) */}
            <div id="welcome-scroll-container" className="relative z-10 w-full">
                <HeroSection />
                <FeaturesSection />
                <StatsSection />
                <HowItWorksSection />
                <CTASection />
            </div>

        </div>
    );
};

export default WelcomePage;
