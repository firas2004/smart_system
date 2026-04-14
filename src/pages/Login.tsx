import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Zap, Mail, Lock, User, Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/dashboard');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast({
          title: 'Compte créé !',
          description: 'Vérifiez votre email pour confirmer votre inscription.',
        });
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: 'Erreur',
        description: error?.message || 'Une erreur inattendue s\'est produite. Vérifiez votre connexion internet.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-[-10%] w-96 h-96 rounded-full bg-cyan-500/15 blur-[150px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-96 h-96 rounded-full bg-purple-500/15 blur-[150px]" />
      </div>

      <Link to="/" className="absolute top-8 left-8 w-11 h-11 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center hover:bg-cyan-500/30 hover:border-cyan-500 transition-all z-20 shadow-lg shadow-cyan-500/20">
        <ArrowLeft className="w-5 h-5 text-cyan-400" />
      </Link>
      
      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Logo Section */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center mx-auto shadow-2xl shadow-cyan-500/40">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black neon-text">SMART ENERGY</h1>
            <p className="text-sm text-cyan-300/60 mt-1">Système Intelligent d'Optimisation Énergétique</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="modal-glass p-8 space-y-6 border-t-2 border-cyan-500/50">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {isLogin ? 'Bienvenue' : 'Rejoignez-nous'}
            </h2>
            <p className="text-cyan-300/60 text-sm mt-1">
              {isLogin ? 'Accédez à votre tableau de bord' : 'Créez votre compte pour commencer'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-xs font-semibold text-cyan-400 block mb-2">Nom complet</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500/50" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ahmed Ben Ali"
                    required
                    className="input-glow pl-12 pr-4"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-cyan-400 block mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500/50" />
                <input
                  type="text"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="ahmed@example.com"
                  required
                  className="input-glow pl-12 pr-4"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-cyan-400 block mb-2">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500/50" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-glow pl-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-500/50 hover:text-cyan-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-neon-primary w-full justify-center mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Chargement...
                </>
              ) : (
                isLogin ? 'Se connecter' : 'Créer le compte'
              )}
            </button>
          </form>

          {/* Toggle Auth Mode */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cyan-500/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-cyan-300/60">ou</span>
            </div>
          </div>

          <p className="text-center text-cyan-300/70 text-sm">
            {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-cyan-400 font-bold ml-2 hover:text-cyan-300 hover:glow-cyan transition-all underline-neon"
            >
              {isLogin ? "S'inscrire" : "Se connecter"}
            </button>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="glass-card p-4 border-cyan-500/30">
          <p className="text-xs text-cyan-400 font-semibold mb-2">Démo rapide:</p>
          <div className="space-y-1 text-xs text-cyan-300/70">
            <p>👤 Admin: <code className="bg-cyan-500/10 px-2 py-0.5 rounded">admin</code> / <code className="bg-cyan-500/10 px-2 py-0.5 rounded">admin</code></p>
            <p>👥 Client: <code className="bg-cyan-500/10 px-2 py-0.5 rounded">client</code> / <code className="bg-cyan-500/10 px-2 py-0.5 rounded">client</code></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
