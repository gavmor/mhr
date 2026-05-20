import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { cn } from '../../lib/utils';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { AlertCircle } from 'lucide-react';

export function QRCodeUrl() {
  const [expanded, setExpanded] = useState(false);
  const [url, setUrl] = useState('');

  useEffect(() => {
    // In Nuqs, URL state updates push history state. We want to show the current URL.
    setUrl(window.location.href);
    
    // We want to update the QR code when the URL changes (e.g., nuqs push)
    const handlePopState = () => setUrl(window.location.href);
    window.addEventListener('popstate', handlePopState);
    
    // nuqs might not trigger popstate on shallow replace, so let's also update 
    // on a small interval while modal is open, or use a MutationObserver. 
    // Actually, just reading it once is mostly fine if the modal opens after URL updates.
    // Let's use an interval to catch useQueryState updates while modal is open.
    const intervalId = setInterval(() => {
      if (window.location.href !== url) {
        setUrl(window.location.href);
      }
    }, 500);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      clearInterval(intervalId);
    };
  }, [url]);

  if (!url) return null;

  return (
    <div 
      className={cn(
        "absolute right-3 bg-white border-2 border-black p-1 shadow-[2px_2px_0_0_#000] cursor-pointer transition-all duration-300 z-10 flex items-center justify-center overflow-hidden",
        expanded ? "top-14 w-64 h-64 p-3 shadow-[8px_8px_0_0_#000]" : "top-14 w-8 h-8 hover:bg-gray-100"
      )}
      onClick={() => setExpanded(!expanded)}
      title="Click to expand/contract QR code"
    >
      <ErrorBoundary fallback={
        <div className="flex flex-col items-center justify-center text-center text-red-500 p-2">
          <AlertCircle className="mb-2 w-full h-full max-w-[48px] max-h-[48px]" />
          {expanded && <span className="font-comic-label font-bold text-xs uppercase leading-tight">Data Too Large For QR</span>}
        </div>
      }>
        <QRCodeSVG value={url.toUpperCase()} width="100%" height="100%" level="L" />
      </ErrorBoundary>
    </div>
  );
}
