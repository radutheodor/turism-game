import React from 'react';
import './Board.css';
import { tiles } from './tileData';
import { tileLayout } from './tileLayout';

type Player = {
  id: string;
  name: string;
  avatar: string;
  position: number;
};

interface BoardProps {
  players: Player[];
}

export default function Board({ players }: BoardProps) {
  return (
    <div className="board-grid">
      {tiles.map((tile) => {
        const layout = tileLayout.find((t) => t.id === tile.id);
        if (!layout) return null;

        const playersOnTile = players.filter((p) => p.position === tile.id);
        const isCorner = [0, 10, 20, 30].includes(tile.id);
        const isVertical = (tile.id > 10 && tile.id < 20) || tile.id > 30;
        const flexDirection = isVertical ? 'row' : 'column';

        const style = {
          gridColumnStart: layout.x,
          gridRowStart: layout.y,
          backgroundColor: tile.color || 'white',
          width: isCorner ? '120px' : isVertical ? '120px' : '60px',
          height: isCorner ? '120px' : isVertical ? '60px' : '120px',
        };

        return (
          <div
            className="tile"
            style={{
              ...style,
              display: 'flex',
              flexDirection: flexDirection,
              overflow: 'hidden',
            }}
          >
            {tile.image ? (
              <img
                src={tile.image}
                className={`tile-top ${isVertical ? 'vertical' : ''}`}
                alt={tile.name}
              />
            ) : (
              <div
                className={`tile-top ${isVertical ? 'vertical' : ''}`}
                style={{ backgroundColor: tile.color }}
              />
            )}
            <div className="tile-bottom">
              <div className={`tile-name ${isVertical ? 'rotate' : ''}`}>{tile.name}</div>
              <div className="tile-players">
                {playersOnTile.map((p) => (
                  <span key={p.id} className="token">
                    {p.avatar}
                  </span>
                ))}
              </div>
              {tile.owner && <div className="tile-owner">🎖 {tile.owner.slice(0, 5)}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
