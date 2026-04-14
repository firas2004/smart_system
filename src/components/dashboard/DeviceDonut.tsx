import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { deviceShares } from '@/data/mockData';
import { Zap } from 'lucide-react';

const DeviceDonut = () => {
  const totalKWh = deviceShares.reduce((sum, d) => sum + d.kwh, 0);

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-cyan-300 flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            Répartition par Appareil
          </h2>
          <p className="text-xs text-cyan-400/60 mt-1">Total : <span className="text-cyan-300 font-bold">{totalKWh.toFixed(1)} kWh</span></p>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={deviceShares}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            dataKey="kwh"
            stroke="rgba(0, 240, 255, 0.3)"
            strokeWidth={2}
          >
            {deviceShares.map((entry, index) => (
              <Cell key={index} fill={entry.color} opacity={0.9} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div className="modal-glass p-3 text-xs border border-cyan-500/50 rounded-lg shadow-lg shadow-cyan-500/30">
                  <p className="font-bold text-cyan-300">{d.name}</p>
                  <p className="text-cyan-400/80 mt-1">{d.kwh} kWh ({d.percentage}%)</p>
                  <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full" style={{width: `${d.percentage}%`, backgroundColor: d.color}}></div>
                  </div>
                </div>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend with bars */}
      <div className="space-y-2">
        {deviceShares.map((device) => (
          <div key={device.name} className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: device.color }} />
                  {device.name}
                </span>
                <span className="text-xs font-bold text-cyan-400">{device.percentage}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-700/50 rounded-full overflow-hidden border border-cyan-500/20">
                <div 
                  className="h-full rounded-full transition-all duration-500" 
                  style={{ width: `${device.percentage}%`, backgroundColor: device.color, boxShadow: `0 0 10px ${device.color}` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeviceDonut;
