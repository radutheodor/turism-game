export type TileType = 'property' | 'chance' | 'start' | 'jail' | 'tax' | 'parking';

export interface Tile {
  id: number;
  name: string;
  type: TileType;
  color?: string; // Only for properties
  price?: number;
}

export const tiles: Tile[] = [
  { id: 0, name: 'Start', type: 'start' },
  { id: 1, name: 'București', type: 'property', color: 'blue', price: 60 },
  { id: 2, name: 'Constanța', type: 'property', color: 'blue', price: 60 },
  { id: 3, name: 'Taxă', type: 'tax' },
  { id: 4, name: 'Sinaia', type: 'property', color: 'lightblue', price: 100 },
  { id: 5, name: 'Poiana Brașov', type: 'property', color: 'lightblue', price: 100 },
  { id: 6, name: 'Cluj-Napoca', type: 'property', color: 'green', price: 120 },
  { id: 7, name: 'Brașov', type: 'property', color: 'green', price: 140 },
  { id: 8, name: 'Oradea', type: 'property', color: 'green', price: 140 },
  { id: 9, name: 'Arad', type: 'property', color: 'yellow', price: 160 },
  { id: 10, name: 'Închisoare', type: 'jail' },
  { id: 11, name: 'Timișoara', type: 'property', color: 'orange', price: 180 },
  { id: 12, name: 'Iași', type: 'property', color: 'orange', price: 180 },
  { id: 13, name: 'Bacău', type: 'property', color: 'orange', price: 200 },
  { id: 14, name: 'Ploiești', type: 'property', color: 'red', price: 220 },
  { id: 15, name: 'Gara Nord', type: 'property', color: 'black', price: 240 },
  { id: 16, name: 'Zalău', type: 'property', color: 'red', price: 240 },
  { id: 17, name: 'Turda', type: 'property', color: 'red', price: 260 },
  { id: 18, name: 'Sibiu', type: 'property', color: 'purple', price: 280 },
  { id: 19, name: 'Târgoviște', type: 'property', color: 'purple', price: 280 },
  { id: 20, name: 'Parcare', type: 'parking' },
  { id: 21, name: 'Giurgiu', type: 'property', color: 'brown', price: 300 },
  { id: 22, name: 'Craiova', type: 'property', color: 'brown', price: 300 },
  { id: 23, name: 'Bistrița', type: 'property', color: 'brown', price: 320 },
  { id: 24, name: 'Tulcea', type: 'property', color: 'pink', price: 340 },
  { id: 25, name: 'Mangalia', type: 'property', color: 'pink', price: 360 },
  { id: 26, name: 'Reșița', type: 'property', color: 'pink', price: 380 },
  { id: 27, name: 'Chance', type: 'chance' },
  { id: 28, name: 'Vaslui', type: 'property', color: 'cyan', price: 400 },
  { id: 29, name: 'Focșani', type: 'property', color: 'cyan', price: 420 },
  { id: 30, name: 'Du-te la închisoare', type: 'jail' },
  { id: 31, name: 'Slobozia', type: 'property', color: 'lime', price: 440 },
  { id: 32, name: 'Medgidia', type: 'property', color: 'lime', price: 460 },
  { id: 33, name: 'Bârlad', type: 'property', color: 'lime', price: 480 },
  { id: 34, name: 'Suceava', type: 'property', color: 'gray', price: 500 },
  { id: 35, name: 'Roman', type: 'property', color: 'gray', price: 520 },
  { id: 36, name: 'Pașcani', type: 'property', color: 'gray', price: 540 },
  { id: 37, name: 'Târnăveni', type: 'property', color: 'darkred', price: 560 },
  { id: 38, name: 'Deva', type: 'property', color: 'darkred', price: 580 },
  { id: 39, name: 'Satu Mare', type: 'property', color: 'darkred', price: 600 },
];