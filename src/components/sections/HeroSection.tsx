import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const HeroSection = () => {
  return (
    <section className="h-screen flex flex-col justify-center items-center px-6 relative z-10 pointer-events-none">
      <div className="text-center max-w-4xl space-y-6 pointer-events-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0 }}
          className="inline-flex items-center gap-2 mb-4 bg-black/40 border border-green-500/30 px-4 py-2 rounded-full backdrop-blur-md"
        >
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-green-400 text-xs font-bold tracking-widest uppercase">Live Monitoring Active</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-5xl md:text-7xl font-bold text-white font-orbitron"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          Smart Energy AIoT
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-[#00d4ff] text-xl md:text-2xl tracking-widest font-light"
        >
          Intelligent Building Energy Optimization
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
        >
          <Link to="/login" className="px-8 py-4 bg-[#00d4ff] hover:bg-[#00b0d4] text-black font-bold rounded-lg transition-colors w-full sm:w-auto tracking-wider text-center block">
            Get Started
          </Link>
          <Link to="/login" className="px-8 py-4 bg-transparent border-2 border-[#00d4ff] text-[#00d4ff] hover:bg-[#00d4ff]/10 font-bold rounded-lg transition-colors w-full sm:w-auto tracking-wider text-center block">
            View Dashboard
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
