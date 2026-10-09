import React, { useState, useEffect } from 'react';

export default function OfflineHUD() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-amber-500/20 backdrop-blur-xl border border-amber-400/40 shadow-[0_10px_30px_rgba(245,158,11,0.2)] text-amber-200 text-xs font-mono flex items-center gap-2 animate-bounce pointer-events-auto">
      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
      <span>OFFLINE MODE ACTIVE • ALL 3D MODELS CACHED</span>
    </div>
  );
}
