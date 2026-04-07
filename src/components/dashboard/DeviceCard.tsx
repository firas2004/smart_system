import { useState } from 'react';
import { Wind, Flame, Refrigerator, WashingMachine, Lightbulb, Plug, Power } from 'lucide-react';
import type { Device } from '@/data/mockData';

const iconMap: Record<string, any> = {
  air_conditioner: Wind,
  water_heater: Flame,
  refrigerator: Refrigerator,
  washing_machine: WashingMachine,
  lighting: Lightbulb,
  other: Plug,
};

interface DeviceCardProps {
  device: Device;
}

const DeviceCard = ({ device }: DeviceCardProps) => {
  const [isOn, setIsOn] = useState(device.isOn);
  const Icon = iconMap[device.type] || Plug;
  const isOffline = device.status === 'offline';

  return (
    <div className={`glass-card p-4 transition-all duration-200 hover:scale-[1.02] ${isOn ? 'glow-border' : ''} ${isOffline ? 'opacity-50' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isOn ? 'bg-primary/15' : 'bg-secondary'}`}>
          <Icon className={`w-4.5 h-4.5 ${isOn ? 'text-primary' : 'text-muted-foreground'}`} />
        </div>
        <button
          onClick={() => !isOffline && setIsOn(!isOn)}
          disabled={isOffline}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isOn ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}
        >
          <Power className="w-4 h-4" />
        </button>
      </div>
      <h3 className="text-sm font-semibold text-foreground truncate">{device.name}</h3>
      <p className="text-xs text-muted-foreground mt-0.5">{device.location}</p>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
        <div>
          <p className="text-xs text-muted-foreground">Puissance</p>
          <p className="text-sm font-mono font-bold text-foreground">{isOn ? `${device.currentPower}W` : '0W'}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Aujourd'hui</p>
          <p className="text-sm font-mono font-bold text-foreground">{device.todayConsumption} kWh</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-2">
        <span className={`w-1.5 h-1.5 rounded-full ${device.status === 'online' ? 'bg-energy-green' : device.status === 'error' ? 'bg-energy-red' : 'bg-muted-foreground'}`} />
        <span className="text-[10px] text-muted-foreground capitalize">{device.status}</span>
      </div>
    </div>
  );
};

export default DeviceCard;
