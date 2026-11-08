import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed standalone PWA, hide
  if (isInstalled) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
        ✓ Installed on Device
      </span>
    );
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-500 transition-all"
      >
        <Download className="w-4 h-4" />
        <span>አፕሊኬሽኑን በስልክህ ላይ ጫን (Install App)</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-500/40 bg-indigo-950/60 px-3.5 py-1.5 text-xs font-medium text-indigo-300 hover:bg-indigo-900 transition-colors"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>በ iPhone ላይ ጫን (Install on iOS)</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 p-6 shadow-2xl border border-slate-800 text-white relative">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-base font-bold text-white mb-2">በ iPhone / iPad ላይ ለመጫን</h3>
              <p className="text-xs text-slate-300 space-y-2 leading-relaxed">
                1. በ Safari ብሮውዘር ስር ያለውን <strong>Share (አጋራ)</strong> ምልክት ይጫኑ።<br />
                2. ወደ ታች ዝቅ ብለው <strong>"Add to Home Screen" (ወደ ስክሪን ጨምር)</strong> የሚለውን ይምረጡ።<br />
                3. ከዚያ በኋላ አፑ ልክ እንደ ተለመደው አፕ በኦፍላይን ይከፈታል!
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-slate-800 py-2 text-xs font-medium text-slate-200 hover:bg-slate-750 transition-colors"
              >
                ዝጋ (Close)
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <button
      onClick={() => alert('በስልክዎ ወይም በኮምፒውተርዎ ብሮውዘር ሜኑ (Three Dots) ላይ "Install App" ወይም "Add to Home Screen" የሚለውን በመጫን አፑን መጫን ይችላሉ።')}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
    >
      <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
      <span>Install PWA App</span>
    </button>
  );
};
