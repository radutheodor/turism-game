import React from 'react';
import './Board.css';
import { tiles } from '@turism/shared';
import type { Player, OwnedProperty } from '@turism/shared';
import { tileLayout } from './tileLayout';

interface BoardProps {
  players: Player[];
  ownedProperties: OwnedProperty[];
}

// Color mapping for tile groups (property color bands)
const groupColors: Record<string, string> = {
  A: '#8B4513', // brown
  B: '#87CEEB', // light blue
  C: '#FF69B4', // pink
  D: '#FFA500', // orange
  E: '#FF0000', // red
  F: '#FFD700', // yellow
  G: '#228B22', // green
  H: '#0000CD', // dark blue
  I: '#8A2BE2', // purple
  J: '#20B2AA', // teal
  K: '#DC143C', // crimson
  L: '#4B0082', // indigo
};

// Tile type background colors
const typeColors: Record<string, string> = {
  start: '#90EE90',
  parcare: '#FFE4B5',
  gradina: '#98FB98',
  han: '#DEB887',
  surpriza: '#FFB6C1',
  camping: '#FFFACD',
  statie: '#FFA07A',
  cfr: '#90EE90',
  semafor: '#ADD8E6',
  pod: '#B0C4DE',
};

export default function Board({ players, ownedProperties }: BoardProps) {
  return (
    <div className="board-grid">
      {tiles.map((tile) => {
        const layout = tileLayout.find((t) => t.id === tile.id);
        if (!layout) return null;

        const playersOnTile = players.filter((p) => p.position === tile.id && !p.bankrupt);
        const owned = ownedProperties.find((op) => op.tileId === tile.id);
        const owner = owned ? players.find((p) => p.id === owned.ownerId) : null;

        const isCorner = [0, 10, 20, 30].includes(tile.id);
        const isLeft = tile.id > 10 && tile.id < 20;
        const isRight = tile.id > 30;
        const isVertical = isLeft || isRight;
        const isTop = tile.id > 20 && tile.id < 30;
        const isBottom = tile.id > 0 && tile.id < 10;

        const groupColor = tile.group ? groupColors[tile.group] : undefined;
        const bgColor = tile.type !== 'property' ? typeColors[tile.type] || '#f5f5f0' : '#f5f5f0';

        const style: React.CSSProperties = {
          gridColumnStart: layout.x,
          gridRowStart: layout.y,
          width: isCorner ? 'var(--corner-size)' : isVertical ? 'var(--corner-size)' : 'var(--tile-size)',
          height: isCorner ? 'var(--corner-size)' : isVertical ? 'var(--tile-size)' : 'var(--corner-size)',
        };

        return (
          <div key={tile.id} className="tile" style={style} title={`${tile.name}${tile.price ? ` — $${tile.price}` : ''}`}>
            {/* Color band for property groups */}
            {groupColor && (
              <div
                className={`color-band ${isVertical ? (isLeft ? 'band-right' : 'band-left') : isTop ? 'band-bottom' : 'band-top'}`}
                style={{ backgroundColor: groupColor }}
              />
            )}

            {/* Ownership border indicator */}
            {owner && (
              <div className="ownership-indicator">
                <span className="owner-avatar">{owner.avatar}</span>
              </div>
            )}

            {/* Main tile content */}
            <div className={`tile-content ${isVertical ? 'vertical' : ''} ${isCorner ? 'corner' : ''}`} style={{ backgroundColor: bgColor }}>
              {tile.image ? (
                <div className="tile-image-wrapper">
                  <img src={tile.image} className="tile-image" alt={tile.name} />
                </div>
              ) : null}

              <div className={`tile-label ${isVertical ? 'label-vertical' : ''}`}>
                <span className="tile-name">{tile.name}</span>
                {tile.price && <span className="tile-price">${tile.price}</span>}
              </div>
            </div>

            {/* Player tokens */}
            {playersOnTile.length > 0 && (
              <div className="tile-tokens">
                {playersOnTile.map((p) => (
                  <span key={p.id} className="token" title={p.name}>
                    {p.avatar}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
