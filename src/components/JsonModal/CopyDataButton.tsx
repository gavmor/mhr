import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CopyDataButtonProps {
  data: string;
  className?: string;
}

export const CopyDataButton: React.FC<CopyDataButtonProps> = ({ data, className }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!data) return;
    navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "absolute top-3 right-3 p-2 bg-white border-2 border-black shadow-[2px_2px_0_0_#000] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all hover:bg-gray-100 cursor-pointer group flex items-center gap-2",
        className
      )}
      title="Copy character data"
    >
      {copied ? (
        <>
          <Check size={14} className="text-comic-green" />
          <span className="font-comic-label font-bold text-[10px] text-comic-green">COPIED!</span>
        </>
      ) : (
        <>
          <Copy size={14} className="group-hover:text-primary transition-colors" />
          <span className="font-comic-label font-bold text-[10px] opacity-40 group-hover:opacity-100 transition-opacity">COPY DATA</span>
        </>
      )}
    </button>
  );
};
