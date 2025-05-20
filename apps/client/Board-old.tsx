import React from 'react';
import './Board-old.css';
import AnimatedToken from './AnimatedToken';
import { tiles } from './tileData';

const TILE_SIZE = 50;

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
  return (
    <div className="board-container">
      <div className="board-grid">
        {tiles.map((tile) => {
          const { x, y } = getTileCoordinates(tile.id);
          return (
            <div
              key={tile.id}
              className="tile"
              style={{
                gridColumnStart: x + 1,
                gridRowStart: y + 1,
                backgroundColor: tile.color ? tile.color : 'white',
              }}
            >
              <div className="tile-name text-[8px] text-center">{tile.name}</div>
            </div>
          );
        })}
      </div>

      {players.map((p) => {
        const { x, y } = getTileCoordinates(p.position);
        return <AnimatedToken key={p.id} avatar={p.avatar} x={x * TILE_SIZE} y={y * TILE_SIZE} />;
      })}
    </div>
  );
}
