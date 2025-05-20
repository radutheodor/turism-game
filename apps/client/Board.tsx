import React from 'react';
import './Board.css';

const TILE_COUNT = 40;

type Player = {
  id: string;
  name: string;
  avatar: string;
  position: number;
};

interface BoardProps {
  players: Player[];
}

const getTileCoordinates = (index: number): { x: number; y: number } => {
  if (index <= 10) return { x: 10 - index, y: 10 };
  if (index <= 20) return { x: 0, y: 20 - index };
  if (index <= 30) return { x: index - 20, y: 0 };
  return { x: 10, y: index - 30 };
};

export default function Board({ players }: BoardProps) {
  const tiles = Array.from({ length: TILE_COUNT }, (_, i) => {
    const playersOnTile = players.filter(p => p.position === i);
    const { x, y } = getTileCoordinates(i);

    return (
      <div
        key={i}
        className="tile"
        style={{
          gridColumnStart: x + 1,
          gridRowStart: y + 1,
        }}
      >
        <div className="tile-index">{i}</div>
        <div className="tile-players">
          {playersOnTile.map((p) => (
            <span key={p.id} className="token">{p.avatar}</span>
          ))}
        </div>
      </div>
    );
  });

  return <div className="board-grid">{tiles}</div>;
}