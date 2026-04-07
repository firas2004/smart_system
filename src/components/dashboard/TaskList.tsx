import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  status: 'pending' | 'completed';
  dueDate?: string;
}

const mockTasks: Task[] = [
  { id: '1', title: 'Vérifier les capteurs du bâtiment A', status: 'pending', dueDate: 'Aujourd\'hui' },
  { id: '2', title: 'Mettre à jour le firmware des climatiseurs', status: 'completed', dueDate: 'Hier' },
  { id: '3', title: 'Analyser le rapport de surconsommation', status: 'pending', dueDate: 'Demain' },
  { id: '4', title: 'Remplacer le filtre du purificateur', status: 'pending', dueDate: 'Dans 3 jours' },
];

const TaskList = () => {
  return (
    <div className="glass-card p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Liste des Tâches</h2>
      {/* space-y-3 ajoute un espacement régulier entre les tâches */}
      <div className="space-y-3">
        {mockTasks.map((task, index) => (
          <div 
            key={task.id} 
            /* Couleurs alternées (zebra striping) basées sur l'index pair/impair */
            className={`flex items-center justify-between p-4 rounded-xl border border-border/50 transition-colors ${
              index % 2 === 0 ? 'bg-secondary/40' : 'bg-background/40'
            } hover:bg-secondary/80`}
          >
            <div className="flex items-center gap-3">
              {task.status === 'completed' ? (
                <CheckCircle2 className="w-5 h-5 text-energy-green" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground" />
              )}
              <div>
                <p className={`text-sm font-medium ${task.status === 'completed' ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                  {task.title}
                </p>
                {task.dueDate && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
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
