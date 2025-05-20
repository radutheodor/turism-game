import React from 'react';

interface Props {
  avatar: string;
  x: number;
  y: number;
}

const AnimatedToken: React.FC<Props> = ({ avatar, x, y }) => {
  return (
    <div
      className="absolute transition-all duration-200 ease-in-out text-2xl"
      style={{
        left: x + 8,
        top: y + 8,
      }}
    >
      {avatar}
    </div>
  );
};

export default AnimatedToken;