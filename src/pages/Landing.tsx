import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Zap, Shield, BarChart3, ArrowRight, Sparkles, Cpu, LineChart } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navbar */}
      <nav className="container mx-auto px-6 py-5 flex justify-between items-center relative z-10 border-b border-cyan-500/20 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/50">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-lg font-black neon-text">SMART ENERGY</div>
            <div className="text-xs text-cyan-400/70">AIoT Platform</div>
          </div>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="px-6 py-2 rounded-full font-medium text-cyan-300/80 hover:text-cyan-400 transition-all border border-cyan-500/30 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20">
            Connectez-vous
          </Link>
          <Link to="/login" className="btn-neon-primary">
            Commencer <ArrowRight className="w-4 h-4 inline-block ml-2" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-32 pb-32 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center space-y-8"
          >
            <div className="inline-block">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/50 bg-cyan-500/10 w-fit mx-auto mb-4">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-semibold text-cyan-400">Technologie IA de demain</span>
              </div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black leading-tight tracking-tighter">
              L'énergie intelligente<br />
              <span className="neon-text">redéfinie</span>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-xl md:text-2xl text-cyan-200/70 max-w-3xl mx-auto leading-relaxed"
            >
              Optimisez votre consommation énergétique avec notre plateforme AIoT nouvelle génération. Contrôle en temps réel, apprentissage automatique et économies garanties.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex justify-center gap-4 pt-8 flex-wrap"
            >
              <Link to="/login" className="btn-neon-primary">
                Accédez au Dashboard <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="px-8 py-3 rounded-full font-bold border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500 transition-all shadow-lg hover:shadow-cyan-500/20">
                Voir la Démo
              </button>
            </motion.div>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid md:grid-cols-3 gap-6 mt-32"
          >
            <div className="glass-card p-8 text-center space-y-2">
              <div className="text-4xl font-black neon-text">40%</div>
              <p className="text-cyan-300/70">Réduction moyenne des coûts</p>
            </div>
            <div className="glass-card p-8 text-center space-y-2">
              <div className="text-4xl font-black neon-text">24/7</div>
              <p className="text-cyan-300/70">Surveillance en temps réel</p>
            </div>
            <div className="glass-card p-8 text-center space-y-2">
              <div className="text-4xl font-black neon-text">500+</div>
              <p className="text-cyan-300/70">Bâtiments gérés</p>
            </div>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-40">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="card-accent-top p-8 space-y-4 hover:scale-105 transition-transform"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/40">
                <LineChart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Analyses Détaillées</h3>
              <p className="text-cyan-300/70 leading-relaxed">Visualisez votre consommation en temps réel avec des graphiques interactifs et des insights actionnables alimentés par l'IA.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="card-accent-top p-8 space-y-4 hover:scale-105 transition-transform"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/40">
                <Cpu className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Contrôle Intelligent</h3>
              <p className="text-cyan-300/70 leading-relaxed">Gérez tous vos appareils depuis une interface unifiée. Automatisez vos scénarios et économisez de l'énergie intelligemment.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="card-accent-top p-8 space-y-4 hover:scale-105 transition-transform"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center shadow-lg shadow-cyan-500/40">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Sécurité Maximale</h3>
              <p className="text-cyan-300/70 leading-relaxed">Vos données sont chiffrées et protégées avec les meilleurs standards de sécurité. Conformité RGPD garantie.</p>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Floating Elements Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] left-[-5%] w-96 h-96 rounded-full bg-cyan-500/20 blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-[10%] right-[-5%] w-96 h-96 rounded-full bg-purple-500/20 blur-[150px] animate-pulse-slow" />
        <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan-500/10 blur-[150px]" />
      </div>
    </div>
  );
};

export default Landing;
