import { CheckCircle2, Circle, Clock, Zap } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  status: 'pending' | 'completed';
  dueDate?: string;
}

const mockTasks: Task[] = [
  { id: '1', title: 'Vérifier les capteurs du bâtiment A', status: 'pending', dueDate: "Aujourd'hui" },
  { id: '2', title: 'Mettre à jour le firmware des climatiseurs', status: 'completed', dueDate: 'Hier' },
  { id: '3', title: 'Analyser le rapport de surconsommation', status: 'pending', dueDate: 'Demain' },
  { id: '4', title: 'Remplacer le filtre du purificateur', status: 'pending', dueDate: 'Dans 3 jours' },
];

const TaskList = () => {
  const completedCount = mockTasks.filter(t => t.status === 'completed').length;
  const totalCount = mockTasks.length;
  const progressPercent = (completedCount / totalCount) * 100;

  return (
    <div className="glass-card p-6 space-y-6">
      {/* Header with progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-cyan-300 flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            Liste des Tâches
          </h2>
          <span className="text-xs bg-cyan-500/20 px-3 py-1 rounded-full text-cyan-400 font-bold">
            {completedCount}/{totalCount}
          </span>
        </div>
        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-700/50 rounded-full overflow-hidden border border-cyan-500/30">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-500 rounded-full shadow-lg shadow-cyan-500/50"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Tasks list */}
      <div className="space-y-2">
        {mockTasks.map((task, index) => (
          <div 
            key={task.id} 
            className="group flex items-start justify-between p-4 rounded-lg border border-cyan-500/20 bg-gradient-to-r hover:from-cyan-500/10 hover:to-purple-500/10 transition-all duration-300 hover:border-cyan-500/50"
          >
            <div className="flex items-start gap-3 flex-1">
              <div className="mt-1 flex-shrink-0">
                {task.status === 'completed' ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400 animate-pulse" />
                ) : (
                  <Circle className="w-5 h-5 text-cyan-400/60 group-hover:text-cyan-400 transition-colors" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold transition-all ${
                  task.status === 'completed' 
                    ? 'text-cyan-300/50 line-through' 
                    : 'text-cyan-300 group-hover:text-cyan-200'
                }`}>
                  {task.title}
                </p>
                {task.dueDate && (
                  <p className="text-xs text-cyan-400/60 flex items-center gap-1.5 mt-1.5">
                    <Clock className="w-3 h-3" />
                    {task.dueDate}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
