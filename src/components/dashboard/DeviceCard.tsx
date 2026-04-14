import { useState } from 'react';
import { Wind, Flame, Refrigerator, WashingMachine, Lightbulb, Plug, Power, Check, AlertCircle } from 'lucide-react';
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
  const isError = device.status === 'error';

  const statusIndicators = {
    online: { color: 'from-green-500 to-green-600', textColor: 'text-green-400', icon: Check },
    offline: { color: 'from-gray-500 to-gray-600', textColor: 'text-gray-400', icon: AlertCircle },
    error: { color: 'from-red-500 to-red-600', textColor: 'text-red-400', icon: AlertCircle },
  };

  const statusStyle = statusIndicators[device.status as keyof typeof statusIndicators] || statusIndicators.offline;
  const StatusIcon = statusStyle.icon;

  return (
    <div className={`device-card-3d group relative overflow-hidden ${isOffline ? 'opacity-60' : ''}`}>
      {/* Top accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${isOn ? 'from-cyan-400 via-purple-400 to-cyan-400' : 'from-gray-500 to-gray-600'}`}></div>
      
      {/* Content */}
      <div className="relative z-10 p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
            isOn 
              ? 'bg-gradient-to-br from-cyan-500/40 to-purple-500/40 border border-cyan-500/60 shadow-lg shadow-cyan-500/30' 
              : 'bg-gray-500/20 border border-gray-500/30'
          }`}>
            <Icon className={`w-6 h-6 transition-colors ${isOn ? 'text-cyan-300' : 'text-gray-400'}`} />
          </div>
          <button
            onClick={() => !isOffline && setIsOn(!isOn)}
            disabled={isOffline}
            className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-all duration-300 ${
              isOn 
                ? 'bg-gradient-to-br from-cyan-500/50 to-purple-500/50 text-cyan-300 border border-cyan-500/60 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50' 
                : 'bg-gray-500/20 text-gray-400 border border-gray-500/30 hover:bg-gray-500/30'
            } ${isOffline ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:shadow-lg'}`}
          >
            <Power className={`w-5 h-5 ${isOn ? 'animate-pulse' : ''}`} />
          </button>
        </div>

        {/* Title and Location */}
        <div>
          <h3 className="text-base font-bold text-cyan-300 truncate group-hover:text-cyan-200 transition-colors">{device.name}</h3>
          <p className="text-xs text-cyan-400/60 mt-1 font-medium">{device.location}</p>
        </div>

        {/* Power Stats */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-gradient-to-br from-cyan-500/10 to-transparent rounded-lg p-3 border border-cyan-500/30">
            <p className="text-[10px] font-bold text-cyan-400/70 uppercase tracking-wider">Puissance</p>
            <p className="text-lg font-black text-cyan-300 mt-1 font-mono">{isOn ? `${device.currentPower}W` : '0W'}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-transparent rounded-lg p-3 border border-purple-500/30">
            <p className="text-[10px] font-bold text-purple-400/70 uppercase tracking-wider">Aujourd'hui</p>
            <p className="text-lg font-black text-purple-300 mt-1 font-mono">{device.todayConsumption} kWh</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
          device.status === 'online' ? 'bg-green-500/10 border-green-500/40' : 
          device.status === 'error' ? 'bg-red-500/10 border-red-500/40' :
          'bg-gray-500/10 border-gray-500/40'
        }`}>
          <div className={`w-2 h-2 rounded-full animate-pulse ${
            device.status === 'online' ? 'bg-green-400' :
            device.status === 'error' ? 'bg-red-400' :
            'bg-gray-400'
          }`} />
          <span className={`text-[11px] font-bold uppercase tracking-wider ${statusStyle.textColor}`}>
            {device.status === 'online' ? 'En ligne' : device.status === 'error' ? 'Erreur' : 'Hors ligne'}
          </span>
        </div>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-t from-cyan-500/5 to-transparent"></div>
    </div>
  );
};

export default DeviceCard;
