import { motion, animate, useMotionValue, useTransform } from 'framer-motion';
import { useEffect } from 'react';

const AnimatedCounter = ({ from, to, duration, suffix = '' }: { from: number, to: number, duration: number, suffix?: string }) => {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString() + suffix);

  useEffect(() => {
    const controls = animate(count, to, { duration: duration, ease: "easeOut" });
    return controls.stop;
  }, [count, to, duration]);

  return <motion.span>{rounded}</motion.span>;
};

export const StatsSection = () => {
  return (
    <section className="h-screen flex items-center justify-center px-6 relative z-10 pointer-events-none">
      <div className="w-full max-w-5xl rounded-3xl bg-black/30 backdrop-blur-xl border border-white/10 p-12 pointer-events-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center"
        >
          <div className="space-y-2">
            <h4 className="text-gray-400 text-sm tracking-widest uppercase">Current Power Load</h4>
            <div className="text-5xl md:text-6xl font-bold text-[#00d4ff]" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              <AnimatedCounter from={0} to={2450} duration={2} suffix=" W" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-gray-400 text-sm tracking-widest uppercase">AI Accuracy</h4>
            <div className="text-5xl md:text-6xl font-bold text-[#7c3aed]" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              <AnimatedCounter from={0} to={87} duration={2.5} suffix="%" />
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-gray-400 text-sm tracking-widest uppercase">Energy Saved</h4>
            <div className="text-5xl md:text-6xl font-bold text-green-400" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              <AnimatedCounter from={0} to={35} duration={3} suffix="%" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
