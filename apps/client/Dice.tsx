import React, { useState } from 'react';

interface DiceProps {
  onRollComplete: (total: number) => void;
  disabled?: boolean;
}

const Dice: React.FC<DiceProps> = ({ onRollComplete, disabled }) => {
  const [rolling, setRolling] = useState(false);
  const [values, setValues] = useState<[number, number]>([1, 1]);

  const rollDice = () => {
    if (rolling || disabled) return;

    setRolling(true);

    const interval = setInterval(() => {
      setValues([Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1]);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      const final1 = Math.floor(Math.random() * 6) + 1;
      const final2 = Math.floor(Math.random() * 6) + 1;
      setValues([final1, final2]);
      setRolling(false);
      onRollComplete(final1 + final2);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Dice row */}
      <div className="flex flex-row justify-center items-center gap-8">
        {values.map((val, idx) => (
          <img
            key={idx}
            src={`/dice${val}.svg`}
            alt={`Dice ${val}`}
            className={`w-16 h-16 transition-transform duration-500 ${rolling ? 'rotate-180 scale-125' : ''}`}
          />
        ))}
      </div>

      {/* Button */}
      <button
        onClick={rollDice}
        disabled={disabled || rolling}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {rolling ? 'Rolling...' : 'Roll Dice'}
      </button>
    </div>
  );
};

export default Dice;
