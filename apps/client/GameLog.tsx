import React, { useEffect, useRef } from 'react';

interface GameLogProps {
  log: string[];
}

export default function GameLog({ log }: GameLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log.length]);

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="font-bold text-sm text-gray-500 uppercase mb-3">Game Log</h3>
      <div className="h-40 overflow-y-auto text-xs space-y-1 font-mono">
        {log.length === 0 ? (
          <p className="text-gray-400 italic">No events yet</p>
        ) : (
          log.map((entry, i) => (
            <div key={i} className="text-gray-600 py-0.5 border-b border-gray-50">
              {entry}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
