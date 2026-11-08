import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface OfflineIndicatorProps {
  isSimulatedOffline?: boolean;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ isSimulatedOffline }) => {
  const isOnline = useOnlineStatus();
  const actuallyOffline = !isOnline || isSimulatedOffline;

  if (!actuallyOffline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-500/95 backdrop-blur-md px-3.5 py-2 text-xs font-bold text-slate-950 shadow-xl border border-amber-400 animate-in fade-in slide-in-from-bottom-2">
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>
        {isSimulatedOffline
          ? 'የተሞከረ ኦፍላይን ሁነታ (Simulated Offline) — ያወረዷቸውን ፈተናዎች ያለ ኢንተርኔት መፈተን ይችላሉ'
          : 'ኦፍላይን ሁነታ (Offline) — ኢንተርኔት ተቋርጧል፤ በስልክዎ የተያዙ ፈተናዎች ብቻ ይሰራሉ'}
      </span>
    </div>
  );
};
