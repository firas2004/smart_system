import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { deviceShares } from '@/data/mockData';

const DeviceDonut = () => {
  return (
    <div className="glass-card p-6">
      <h2 className="text-base font-semibold text-foreground mb-4">Répartition par Appareil</h2>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={deviceShares}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            dataKey="kwh"
            stroke="none"
          >
            {deviceShares.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div className="glass-card p-2.5 text-xs border border-border">
                  <p className="font-semibold text-foreground">{d.name}</p>
                  <p className="text-muted-foreground">{d.kwh} kWh ({d.percentage}%)</p>
                </div>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2 mt-2">
        {deviceShares.map((s) => (
          <div key={s.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-muted-foreground">{s.name}</span>
            </div>
            <span className="font-mono text-foreground">{s.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeviceDonut;
