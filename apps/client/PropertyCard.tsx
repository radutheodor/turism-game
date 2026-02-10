import React from 'react';
import { tiles, groupColors } from '@turism/shared';
import type { GameState, Player, OwnedProperty } from '@turism/shared';

interface PropertyCardProps {
  tileId: number;
  gameState: GameState;
  onClose: () => void;
}

export default function PropertyCard({ tileId, gameState, onClose }: PropertyCardProps) {
  const tile = tiles[tileId];
  if (!tile) return null;

  const owned = gameState.ownedProperties.find(op => op.tileId === tileId);
  const owner = owned ? gameState.players.find(p => p.id === owned.ownerId) : null;
  const gc = tile.group ? groupColors[tile.group] : '#888';

  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden w-72">
      {/* Header with color band */}
      <div className="relative" style={{ backgroundColor: gc || '#e2e8f0' }}>
        <div className="flex flex-col items-center py-4 px-3">
          <span className="text-5xl mb-1">{tile.icon}</span>
          <h3 className="text-white font-bold text-lg text-center drop-shadow-md">{tile.name}</h3>
          {tile.type !== 'property' && tile.type !== 'cfr' && tile.type !== 'statie' && (
            <span className="text-white/80 text-xs capitalize">{tile.type}</span>
          )}
        </div>
        <button onClick={onClose}
          className="absolute top-2 right-2 text-white/80 hover:text-white text-lg font-bold w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20">
          ×
        </button>
      </div>

      <div className="p-4 space-y-3">
        {/* Owner */}
        {owner ? (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200">
            <span className="text-2xl">{owner.avatar}</span>
            <div>
              <div className="font-medium text-sm">{owner.name}</div>
              <div className="text-xs text-gray-500">
                {owned!.houses === 5 ? '🏨 Hotel' :
                 owned!.houses > 0 ? `🏠 × ${owned!.houses}` : 'No buildings'}
                {owned!.mortgaged && ' · 🔴 Mortgaged'}
              </div>
            </div>
          </div>
        ) : tile.price ? (
          <div className="text-center p-2 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-600">
            Unowned — available for purchase
          </div>
        ) : null}

        {/* Price */}
        {tile.price && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Purchase price</span>
            <span className="font-bold">${tile.price}</span>
          </div>
        )}

        {/* Rent table */}
        {tile.rent && (
          <div className="space-y-1">
            <div className="text-xs font-bold text-gray-500 uppercase">Rent</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs">
              <span className="text-gray-500">Base rent</span>
              <span className="text-right font-medium">${tile.rent[0]}</span>
              {tile.rent[1] != null && <>
                <span className="text-gray-500">With 1 🏠</span>
                <span className="text-right font-medium">${tile.rent[1]}</span>
              </>}
              {tile.rent[2] != null && <>
                <span className="text-gray-500">With 2 🏠</span>
                <span className="text-right font-medium">${tile.rent[2]}</span>
              </>}
              {tile.rent[3] != null && <>
                <span className="text-gray-500">With 3 🏠</span>
                <span className="text-right font-medium">${tile.rent[3]}</span>
              </>}
              {tile.rent[4] != null && <>
                <span className="text-gray-500">With 4 🏠</span>
                <span className="text-right font-medium">${tile.rent[4]}</span>
              </>}
              {tile.rent[5] != null && <>
                <span className="text-gray-500">With 🏨 Hotel</span>
                <span className="text-right font-bold text-emerald-700">${tile.rent[5]}</span>
              </>}
            </div>
          </div>
        )}

        {/* House cost */}
        {tile.houseCost && (
          <div className="flex justify-between text-sm border-t pt-2">
            <span className="text-gray-500">House cost</span>
            <span className="font-medium">${tile.houseCost} each</span>
          </div>
        )}

        {/* Mortgage value */}
        {tile.price && (
          <div className="flex justify-between text-xs text-gray-400 border-t pt-2">
            <span>Mortgage value</span>
            <span>${Math.floor(tile.price / 2)}</span>
          </div>
        )}

        {/* Special tiles info */}
        {tile.type === 'statie' && (
          <div className="text-xs text-gray-500 border-t pt-2">
            Rent: $25 (1 station), $50 (2), $100 (3), $200 (4)
          </div>
        )}
        {tile.type === 'cfr' && (
          <div className="text-xs text-gray-500 border-t pt-2">
            Rent: $25 (1 CFR), $50 (2), $100 (3), $200 (4)
          </div>
        )}
        {tile.type === 'camping' && (
          <div className="text-xs text-gray-500 border-t pt-2">Fee: $50 camping tax</div>
        )}
        {tile.type === 'pod' && (
          <div className="text-xs text-gray-500 border-t pt-2">Toll: $100 bridge fee</div>
        )}
        {tile.type === 'surpriza' && (
          <div className="text-xs text-gray-500 border-t pt-2">Draw a Surprise card!</div>
        )}
        {tile.type === 'semafor' && (
          <div className="text-xs text-gray-500 border-t pt-2">Go directly to jail!</div>
        )}
      </div>
    </div>
  );
}
