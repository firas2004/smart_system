import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Zap, Shield, BarChart3, ArrowRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navbar */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl energy-gradient flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">Smart Energy AIoT</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="px-5 py-2.5 rounded-xl font-medium hover:bg-secondary transition-colors">
            Se connecter
          </Link>
          <Link to="/login" className="px-5 py-2.5 rounded-xl energy-gradient text-primary-foreground font-medium hover:opacity-90 transition-opacity">
            Commencer
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-20 pb-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-7xl font-bold tracking-tight"
          >
            L'énergie intelligente pour vos <span className="text-primary">bâtiments</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Optimisez votre consommation, réduisez vos coûts et gérez vos appareils en temps réel grâce à notre plateforme AIoT.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center gap-4 pt-4"
          >
            <Link to="/login" className="px-8 py-4 rounded-xl energy-gradient text-primary-foreground font-medium text-lg hover:opacity-90 transition-opacity flex items-center gap-2">
              Accéder au Dashboard <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-card p-8 text-center space-y-4"
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <BarChart3 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold">Analyses Détaillées</h3>
            <p className="text-muted-foreground">Suivez votre consommation en temps réel avec des graphiques interactifs.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-card p-8 text-center space-y-4"
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold">Contrôle à Distance</h3>
            <p className="text-muted-foreground">Gérez tous vos appareils connectés depuis une seule interface.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="glass-card p-8 text-center space-y-4"
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold">Sécurité Maximale</h3>
            <p className="text-muted-foreground">Vos données sont protégées avec les meilleurs standards de sécurité.</p>
          </motion.div>
        </div>
      </main>

      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
      </div>
    </div>
  );
};

export default Landing;
