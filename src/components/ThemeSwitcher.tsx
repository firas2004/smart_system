import { useEffect, useState } from 'react';
import { Palette } from 'lucide-react';

const themes = [
  { id: 'theme-noir', name: 'Noir (Défaut)', color: '#10b981' },
  { id: 'theme-blanc', name: 'Blanc', color: '#e2e8f0' },
  { id: 'theme-rouge', name: 'Rouge', color: '#ef4444' },
  { id: 'theme-vert', name: 'Vert', color: '#22c55e' },
  { id: 'theme-bleu', name: 'Bleu', color: '#3b82f6' },
  { id: 'theme-jaune', name: 'Jaune', color: '#eab308' },
];

const ThemeSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('theme-noir');

  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') || 'theme-noir';
    setCurrentTheme(savedTheme);
    document.documentElement.className = savedTheme;
  }, []);

  const changeTheme = (themeId: string) => {
    setCurrentTheme(themeId);
    localStorage.setItem('app-theme', themeId);
    document.documentElement.className = themeId;
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="absolute bottom-14 right-0 mb-2 p-3 bg-card border border-border rounded-2xl shadow-xl flex flex-col gap-2 min-w-[150px]">
          <p className="text-xs font-semibold text-muted-foreground px-2 pb-1 border-b border-border">Thème</p>
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => changeTheme(theme.id)}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                currentTheme === theme.id ? 'bg-primary/10 text-primary' : 'hover:bg-secondary text-foreground'
              }`}
            >
              <span 
                className="w-4 h-4 rounded-full border border-border/50 shadow-sm" 
                style={{ backgroundColor: theme.color }}
              />
              {theme.name}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full energy-gradient text-primary-foreground flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
      >
        <Palette className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ThemeSwitcher;
