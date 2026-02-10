import React, { useState } from 'react';
import './Board.css';
import { tiles, groupColors } from '@turism/shared';
import type { Player, OwnedProperty, GameState } from '@turism/shared';
import { tileLayout } from './tileLayout';

interface BoardProps {
  players: Player[];
  ownedProperties: OwnedProperty[];
  onTileClick?: (tileId: number) => void;
}

export default function Board({ players, ownedProperties, onTileClick }: BoardProps) {
  return (
    <div className="board-outer">
      <div className="board-grid">
        {tiles.map((tile) => {
          const pos = tileLayout.find(t => t.id === tile.id);
          if (!pos) return null;

          const playersOnTile = players.filter(p => p.position === tile.id && !p.bankrupt);
          const owned = ownedProperties.find(op => op.tileId === tile.id);
          const owner = owned ? players.find(p => p.id === owned.ownerId) : null;

          const isCorner = pos.colSpan === 2 && pos.rowSpan === 2;
          const isHoriz = pos.rowSpan === 2 && pos.colSpan === 1; // bottom/top side
          const isVert = pos.colSpan === 2 && pos.rowSpan === 1;  // left/right side
          const isLeft = isVert && pos.col === 1;
          const isRight = isVert && pos.col >= 12;
          const isTop = isHoriz && pos.row === 1;

          const gc = tile.group ? groupColors[tile.group] : undefined;
          const houses = owned?.houses || 0;
          const mortgaged = owned?.mortgaged || false;

          return (
            <div
              key={tile.id}
              className={`tile ${isCorner ? 'tile-corner' : ''} ${mortgaged ? 'tile-mortgaged' : ''}`}
              style={{
                gridColumn: `${pos.col} / span ${pos.colSpan}`,
                gridRow: `${pos.row} / span ${pos.rowSpan}`,
              }}
              title={`${tile.name}${tile.price ? ` — $${tile.price}` : ''}${owner ? ` (${owner.name})` : ''}`}
              onClick={() => onTileClick?.(tile.id)}
            >
              {/* Color band */}
              {gc && (
                <div
                  className={`band ${isLeft ? 'band-r' : isRight ? 'band-l' : isTop ? 'band-b' : 'band-t'}`}
                  style={{ backgroundColor: gc }}
                />
              )}

              {/* House pips (on top of color band) */}
              {houses > 0 && houses < 5 && (
                <div className={`house-row ${isVert ? 'hr-vert' : 'hr-horiz'}`}>
                  {Array.from({ length: houses }).map((_, i) => <span key={i} className="hp">🏠</span>)}
                </div>
              )}
              {houses === 5 && (
                <div className={`house-row ${isVert ? 'hr-vert' : 'hr-horiz'}`}>
                  <span className="hp hp-hotel">🏨</span>
                </div>
              )}

              {/* Tile content */}
              <div className={`tile-inner ${isCorner ? 'inner-corner' : isVert ? 'inner-vert' : 'inner-horiz'}`}>
                <span className={`tile-icon ${isCorner ? 'icon-corner' : ''}`}>{tile.icon}</span>
                {isCorner && <span className="tile-txt">{tile.name}</span>}
                {!isCorner && tile.price && <span className="tile-price">${tile.price}</span>}
              </div>

              {/* Ownership: colored bottom border instead of emoji overlay */}
              {owner && !isCorner && (
                <div className="own-bar" style={{ backgroundColor: gc || '#10b981' }} title={owner.name}>
                  <span className="own-dot">{owner.avatar}</span>
                </div>
              )}

              {/* Player tokens */}
              {playersOnTile.length > 0 && (
                <div className="tkns">
                  {playersOnTile.map(p => <span key={p.id} className="tkn">{p.avatar}</span>)}
                </div>
              )}

              {mortgaged && <div className="mort-x">M</div>}
            </div>
          );
        })}

        {/* Center */}
        <div className="board-center">
          <div className="bc-dice">🎲</div>
          <div className="bc-title">TURISM</div>
          <div className="bc-sub">România</div>
        </div>
      </div>
    </div>
  );
}
