import { motion } from 'framer-motion';

const features = [
  { icon: '⚡', title: 'Real-time Monitoring', desc: 'Sub-second telemetry for all nodes.' },
  { icon: '🤖', title: 'AI Predictions', desc: 'LSTM-powered load forecasting.' },
  { icon: '🔌', title: 'Auto Control', desc: 'Dynamic load shedding & grid balancing.' },
  { icon: '🚨', title: 'Smart Alerts', desc: 'Isolation Forest anomaly detection.' }
];

export const FeaturesSection = () => {
  return (
    <section className="h-screen flex items-center justify-center px-6 relative z-10">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pointer-events-auto">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-8 hover:border-[#00d4ff] hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all duration-300 group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{f.icon}</div>
            <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>{f.title}</h3>
            <p className="text-gray-400 text-sm">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
