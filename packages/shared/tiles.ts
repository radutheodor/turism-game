import type { Tile, SurpriseCard } from './types';

export const tiles: Tile[] = [
  { id: 0,  name: 'Start', type: 'start', icon: '🏁' },
  { id: 1,  name: 'Litoral', type: 'property', price: 60,  rent: [4, 20, 60, 180, 320, 450],     houseCost: 50,  group: 'A', icon: '🏖️' },
  { id: 2,  name: 'Camping', type: 'camping', icon: '⛺' },
  { id: 3,  name: 'Mahmudia', type: 'property', price: 100, rent: [6, 30, 90, 270, 400, 550],     houseCost: 50,  group: 'A', icon: '🦩' },
  { id: 4,  name: 'Stație Auto', type: 'statie', price: 200, icon: '🚌' },
  { id: 5,  name: 'Lacul Sărat', type: 'property', price: 100, rent: [6, 30, 90, 270, 400, 550],  houseCost: 50,  group: 'B', icon: '🏊' },
  { id: 6,  name: 'Soveja', type: 'property', price: 120, rent: [8, 40, 100, 300, 450, 600],      houseCost: 50,  group: 'B', icon: '🌲' },
  { id: 7,  name: 'Roman', type: 'property', price: 140, rent: [10, 50, 150, 450, 625, 750],      houseCost: 100, group: 'C', icon: '⛪' },
  { id: 8,  name: 'Surpriză', type: 'surpriza', icon: '❓' },
  { id: 9,  name: 'Suceava', type: 'property', price: 140, rent: [10, 50, 150, 450, 625, 750],    houseCost: 100, group: 'C', icon: '🏰' },
  { id: 10, name: 'Parcare', type: 'parcare', icon: '🅿️' },
  { id: 11, name: 'Semafor', type: 'semafor', icon: '🚦' },
  { id: 12, name: 'Harghita', type: 'property', price: 180, rent: [14, 70, 200, 550, 750, 950],   houseCost: 100, group: 'D', icon: '🗻' },
  { id: 13, name: 'Maramureș', type: 'property', price: 200, rent: [16, 80, 220, 600, 800, 1000], houseCost: 100, group: 'D', icon: '🪵' },
  { id: 14, name: 'CFR', type: 'cfr', price: 220, icon: '🚂' },
  { id: 15, name: 'M. Apuseni', type: 'property', price: 240, rent: [18, 90, 250, 700, 875, 1050], houseCost: 150, group: 'E', icon: '⛰️' },
  { id: 16, name: 'Lipova', type: 'property', price: 260, rent: [20, 100, 300, 750, 925, 1100],    houseCost: 150, group: 'E', icon: '🏛️' },
  { id: 17, name: 'Surpriză', type: 'surpriza', icon: '❓' },
  { id: 18, name: 'Buziaș', type: 'property', price: 280, rent: [22, 110, 330, 800, 975, 1150],    houseCost: 150, group: 'F', icon: '💧' },
  { id: 19, name: 'B. Herculane', type: 'property', price: 280, rent: [22, 110, 330, 800, 975, 1150], houseCost: 150, group: 'F', icon: '♨️' },
  { id: 20, name: 'Grădina Botanică', type: 'gradina', icon: '🌺' },
  { id: 21, name: 'Stație Auto', type: 'statie', price: 200, icon: '🚌' },
  { id: 22, name: 'Porțile Fier', type: 'property', price: 300, rent: [26, 130, 390, 900, 1100, 1275], houseCost: 200, group: 'G', icon: '🌊' },
  { id: 23, name: 'Tg. Jiu', type: 'property', price: 300, rent: [26, 130, 390, 900, 1100, 1275],     houseCost: 200, group: 'G', icon: '🗿' },
  { id: 24, name: 'Horezu', type: 'property', price: 320, rent: [28, 150, 450, 1000, 1200, 1400],      houseCost: 200, group: 'G', icon: '🏺' },
  { id: 25, name: 'Călimănești', type: 'property', price: 340, rent: [30, 160, 470, 1050, 1250, 1450], houseCost: 200, group: 'H', icon: '🌿' },
  { id: 26, name: 'Surpriză', type: 'surpriza', icon: '❓' },
  { id: 27, name: 'C. de Argeș', type: 'property', price: 380, rent: [34, 170, 500, 1100, 1300, 1500], houseCost: 200, group: 'H', icon: '⛪' },
  { id: 28, name: 'M. Făgăraș', type: 'property', price: 400, rent: [36, 180, 500, 1100, 1350, 1600], houseCost: 200, group: 'I', icon: '🏔️' },
  { id: 29, name: 'Poiana Brașov', type: 'property', price: 420, rent: [38, 190, 550, 1150, 1400, 1650], houseCost: 200, group: 'I', icon: '⛷️' },
  { id: 30, name: 'Hanul Morilor', type: 'han', icon: '🏚️' },
  { id: 31, name: 'Bran', type: 'property', price: 440, rent: [40, 200, 600, 1200, 1500, 1700],        houseCost: 250, group: 'J', icon: '🧛' },
  { id: 32, name: 'Pod', type: 'pod', icon: '🌉' },
  { id: 33, name: 'Sinaia', type: 'property', price: 480, rent: [44, 220, 660, 1300, 1550, 1800],      houseCost: 250, group: 'J', icon: '🏰' },
  { id: 34, name: 'Surpriză', type: 'surpriza', icon: '❓' },
  { id: 35, name: 'Cheia', type: 'property', price: 520, rent: [48, 240, 720, 1400, 1650, 1900],       houseCost: 250, group: 'K', icon: '🔑' },
  { id: 36, name: 'Săr. Monteoru', type: 'property', price: 540, rent: [50, 250, 750, 1450, 1700, 1950], houseCost: 250, group: 'K', icon: '🧂' },
  { id: 37, name: 'CFR', type: 'cfr', price: 220, icon: '🚂' },
  { id: 38, name: 'Snagov', type: 'property', price: 560, rent: [52, 260, 780, 1500, 1750, 2000],      houseCost: 300, group: 'L', icon: '🏞️' },
  { id: 39, name: 'București', type: 'property', price: 580, rent: [55, 275, 825, 1600, 1850, 2050],   houseCost: 300, group: 'L', icon: '🏛️' },
];

// Property groups — tiles in each color group
export const propertyGroups: Record<string, number[]> = {};
for (const t of tiles) {
  if (t.group) {
    if (!propertyGroups[t.group]) propertyGroups[t.group] = [];
    propertyGroups[t.group].push(t.id);
  }
}

// Group display colors for the board
export const groupColors: Record<string, string> = {
  A: '#8B4513',
  B: '#87CEEB',
  C: '#FF69B4',
  D: '#FF8C00',
  E: '#DC143C',
  F: '#FFD700',
  G: '#228B22',
  H: '#4169E1',
  I: '#9932CC',
  J: '#20B2AA',
  K: '#CD853F',
  L: '#191970',
};

// Surprise cards deck
export const surpriseCards: SurpriseCard[] = [
  { id: 1,  text: 'Ai câștigat la tombolă! Primești $200.',               action: 'receive', value: 200 },
  { id: 2,  text: 'Plătești o amendă de circulație: $100.',               action: 'pay', value: 100 },
  { id: 3,  text: 'Mergi la Start. Primești $200.',                       action: 'moveTo', tileId: 0 },
  { id: 4,  text: 'Plătești reparații la drum: $75.',                     action: 'pay', value: 75 },
  { id: 5,  text: 'Moștenire de la o rudă: $150.',                        action: 'receive', value: 150 },
  { id: 6,  text: 'Mergi direct la Semafor! Nu primești bani la Start.',  action: 'jail' },
  { id: 7,  text: 'Ai primit un bonus turistic: $100.',                   action: 'receive', value: 100 },
  { id: 8,  text: 'Plătești taxa hotelieră: $150.',                       action: 'pay', value: 150 },
  { id: 9,  text: 'Eliberare de la Semafor — păstrează acest card.',      action: 'jailFree' },
  { id: 10, text: 'Mergi la Poiana Brașov.',                              action: 'moveTo', tileId: 29 },
  { id: 11, text: 'Ai găsit o comoară în Carpați! $250.',                 action: 'receive', value: 250 },
  { id: 12, text: 'Plătești impozit pe proprietăți: $25 per cabană, $100 per hotel.', action: 'repairs', value: 25 },
  { id: 13, text: 'Mergi la București.',                                  action: 'moveTo', tileId: 39 },
  { id: 14, text: 'Plătești doctorul: $50.',                              action: 'pay', value: 50 },
  { id: 15, text: 'Primești dividente: $50.',                             action: 'receive', value: 50 },
  { id: 16, text: 'Întoarce-te 3 spații.',                                action: 'moveSteps', value: -3 },
];
