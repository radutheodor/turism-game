import React, { useState, useEffect, useRef } from 'react';

interface DiceProps {
  values: [number, number] | null;
  canRoll: boolean;
  onRoll: () => void;
}

export default function Dice({ values, canRoll, onRoll }: DiceProps) {
  const [rolling, setRolling] = useState(false);
  const [displayValues, setDisplayValues] = useState<[number, number]>([1, 1]);
  const [settled, setSettled] = useState(false);
  const animIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevValuesRef = useRef<[number, number] | null>(null);

  // When server sends NEW dice values, run the tumble animation then settle
  useEffect(() => {
    if (!values) return;
    // Skip if values haven't actually changed (same gameState re-render)
    if (
      prevValuesRef.current &&
      prevValuesRef.current[0] === values[0] &&
      prevValuesRef.current[1] === values[1]
    ) {
      return;
    }
    prevValuesRef.current = values;

    setSettled(false);
    setRolling(true);

    if (animIntervalRef.current) clearInterval(animIntervalRef.current);

    animIntervalRef.current = setInterval(() => {
      setDisplayValues([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
      ]);
    }, 80);

    const timeout = setTimeout(() => {
      if (animIntervalRef.current) clearInterval(animIntervalRef.current);
      animIntervalRef.current = null;
      setDisplayValues(values);
      setRolling(false);
      setSettled(true);
    }, 700);

    return () => {
      clearTimeout(timeout);
      if (animIntervalRef.current) clearInterval(animIntervalRef.current);
    };
  }, [values]);

  const handleRoll = () => {
    if (!canRoll || rolling) return;
    setSettled(false);
    setRolling(true);

    animIntervalRef.current = setInterval(() => {
      setDisplayValues([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
      ]);
    }, 80);

    onRoll();

    // Safety: stop animation if server doesn't respond in 3s
    setTimeout(() => {
      if (animIntervalRef.current) {
        clearInterval(animIntervalRef.current);
        animIntervalRef.current = null;
      }
      setRolling(false);
    }, 3000);
  };

  // Dot positions for each face value (percentage-based within the die)
  const dotPositions: Record<number, [number, number][]> = {
    1: [[50, 50]],
    2: [[28, 28], [72, 72]],
    3: [[28, 28], [50, 50], [72, 72]],
    4: [[28, 28], [72, 28], [28, 72], [72, 72]],
    5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
    6: [[28, 25], [72, 25], [28, 50], [72, 50], [28, 75], [72, 75]],
  };

  const renderDie = (value: number, index: number) => {
    const dots = dotPositions[value] || [];
    return (
      <svg
        key={index}
        width="64"
        height="64"
        viewBox="0 0 100 100"
        className={`w-16 h-16 drop-shadow-md transition-transform duration-150 ${
          rolling ? 'animate-bounce' : ''
        }`}
      >
        <rect
          x="3"
          y="3"
          width="94"
          height="94"
          rx="14"
          ry="14"
          fill="white"
          stroke="#d1d5db"
          strokeWidth="3"
        />
        {dots.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="8.5" fill="#1f2937" />
        ))}
      </svg>
    );
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-4 justify-center">
        {renderDie(displayValues[0], 0)}
        {renderDie(displayValues[1], 1)}
      </div>

      {/* Sum text ONLY shown after animation settles, always uses displayValues */}
      {settled && !rolling && (
        <p className="text-lg font-bold text-emerald-700">
          {displayValues[0]} + {displayValues[1]} = {displayValues[0] + displayValues[1]}
        </p>
      )}

      <button
        onClick={handleRoll}
        disabled={!canRoll || rolling}
        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {rolling ? 'Rolling...' : canRoll ? '🎲 Roll Dice' : 'Wait...'}
      </button>
    </div>
  );
}
