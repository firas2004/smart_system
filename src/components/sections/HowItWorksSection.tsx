import { motion } from 'framer-motion';

const steps = [
  { id: 1, title: 'Sensors', text: 'IoT nodes collect raw telemetry.' },
  { id: 2, title: 'MQTT', text: 'Low-latency brokers queue data.' },
  { id: 3, title: 'AI Engine', text: 'LSTMs & Forest trees analyze.' },
  { id: 4, title: 'Dashboard', text: 'Admin gets real-time insights.' }
];

export const HowItWorksSection = () => {
  return (
    <section className="h-screen flex flex-col items-center justify-center px-6 relative z-10 pointer-events-none">
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 pointer-events-auto"
        >
            <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Orbitron', sans-serif" }}>How It Works</h2>
            <p className="text-[#00d4ff] tracking-widest">End-to-End Enterprise Flow</p>
        </motion.div>

        <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-8 pointer-events-auto relative">
            {/* Dashed Line */}
            <div className="hidden md:block absolute top-[50px] left-0 w-full border-t-2 border-dashed border-white/20 z-0" />
            
            {steps.map((s, i) => (
                <motion.div 
                    key={s.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 }}
                    className="relative z-10 flex flex-col items-center max-w-[200px] text-center bg-black/40 p-6 rounded-xl backdrop-blur-md border border-white/5"
                >
                    <div className="w-16 h-16 rounded-full bg-[#020817] border-2 border-[#7c3aed] flex items-center justify-center text-xl font-bold text-white mb-4 shadow-[0_0_15px_rgba(124,58,237,0.5)]">
                        {s.id}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>{s.title}</h3>
                    <p className="text-sm text-gray-400">{s.text}</p>
                </motion.div>
            ))}
        </div>
    </section>
  );
};
