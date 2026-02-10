import React from 'react';
import './Board.css';
import { tiles, groupColors } from '@turism/shared';
import type { Player, OwnedProperty } from '@turism/shared';
import { tileLayout } from './tileLayout';

interface BoardProps {
  players: Player[];
  ownedProperties: OwnedProperty[];
}

const typeIcons: Record<string, string> = {
  start: '🏁', parcare: '🅿️', gradina: '🌺', han: '🏚️',
  surpriza: '❓', camping: '⛺', statie: '🚌', cfr: '🚂',
  semafor: '🚦', pod: '🌉',
};

export default function Board({ players, ownedProperties }: BoardProps) {
  return (
    <div className="board-wrapper">
      <div className="board-grid">
        {tiles.map((tile) => {
          const layout = tileLayout.find(t => t.id === tile.id);
          if (!layout) return null;

          const playersOnTile = players.filter(p => p.position === tile.id && !p.bankrupt);
          const owned = ownedProperties.find(op => op.tileId === tile.id);
          const owner = owned ? players.find(p => p.id === owned.ownerId) : null;

          const isCorner = [0, 10, 20, 30].includes(tile.id);
          const isLeft = tile.id > 10 && tile.id < 20;
          const isRight = tile.id > 30;
          const isVertical = isLeft || isRight;
          const isTop = tile.id > 20 && tile.id < 30;

          const groupColor = tile.group ? groupColors[tile.group] : undefined;
          const icon = tile.icon || typeIcons[tile.type] || '';

          // House indicators
          const houses = owned?.houses || 0;
          const isMortgaged = owned?.mortgaged || false;

          return (
            <div
              key={tile.id}
              className={`tile ${isCorner ? 'corner' : ''} ${isVertical ? 'vertical' : ''} ${isMortgaged ? 'mortgaged' : ''}`}
              style={{
                gridColumnStart: layout.x,
                gridRowStart: layout.y,
                ...(isCorner ? { width: 'var(--corner)', height: 'var(--corner)' } :
                  isVertical ? { width: 'var(--corner)', height: 'var(--cell)' } :
                  { width: 'var(--cell)', height: 'var(--corner)' }),
              }}
              title={`${tile.name}${tile.price ? ` — $${tile.price}` : ''}${owned ? ` (${owner?.name})` : ''}`}
            >
              {/* Color band */}
              {groupColor && (
                <div
                  className={`band ${isLeft ? 'band-r' : isRight ? 'band-l' : isTop ? 'band-b' : 'band-t'}`}
                  style={{ backgroundColor: groupColor }}
                />
              )}

              {/* House pips */}
              {houses > 0 && houses < 5 && (
                <div className={`houses ${isVertical ? 'houses-v' : 'houses-h'}`}>
                  {Array.from({ length: houses }).map((_, i) => (
                    <span key={i} className="house-pip">🏠</span>
                  ))}
                </div>
              )}
              {houses === 5 && (
                <div className={`houses ${isVertical ? 'houses-v' : 'houses-h'}`}>
                  <span className="hotel-pip">🏨</span>
                </div>
              )}

              {/* Tile body */}
              <div className={`tile-body ${isCorner ? 'corner-body' : ''}`}>
                <span className="tile-icon">{icon}</span>
                <span className={`tile-label ${isVertical && !isCorner ? 'label-vert' : ''}`}>
                  {tile.name}
                </span>
                {tile.price && !isCorner && (
                  <span className={`tile-price ${isVertical ? 'price-vert' : ''}`}>${tile.price}</span>
                )}
              </div>

              {/* Owner badge */}
              {owner && (
                <div className="owner-badge">{owner.avatar}</div>
              )}

              {/* Player tokens */}
              {playersOnTile.length > 0 && (
                <div className="tokens">
                  {playersOnTile.map(p => (
                    <span key={p.id} className="token" title={p.name}>{p.avatar}</span>
                  ))}
                </div>
              )}

              {/* Mortgage overlay */}
              {isMortgaged && <div className="mortgage-overlay">M</div>}
            </div>
          );
        })}

        {/* Center logo */}
        <div className="board-center">
          <div className="center-title">🎲</div>
          <div className="center-name">TURISM</div>
          <div className="center-sub">România</div>
        </div>
      </div>
    </div>
  );
}
