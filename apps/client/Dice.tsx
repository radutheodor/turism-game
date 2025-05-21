import React, { useState } from 'react';

interface DiceProps {
  onRollComplete: (total: number) => void;
  disabled?: boolean;
}

const Dice: React.FC<DiceProps> = ({ onRollComplete, disabled }) => {
  const [rolling, setRolling] = useState(false);
  const [value, setValue] = useState(1);

  const rollDice = () => {
    if (rolling || disabled) return;

    setRolling(true);

    const interval = setInterval(() => {
      setValue(Math.floor(Math.random() * 6) + 1);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      const result = Math.floor(Math.random() * 6) + 1;
      setValue(result);
      setRolling(false);
      onRollComplete(result);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <img
        src={`./public/dice${value}.svg`}
        alt={`dice ${value}`}
        className={`w-16 h-16 transition-transform duration-500 ${rolling ? 'rotate-180 scale-125' : ''}`}
      />
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
