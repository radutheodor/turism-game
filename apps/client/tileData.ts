export type TileType =
  | 'property'
  | 'surpriza'
  | 'statie'
  | 'parcare'
  | 'semafor'
  | 'cfr'
  | 'pod'
  | 'gradina'
  | 'camping'
  | 'han'
  | 'start';

export interface Tile {
  id: number;
  name: string;
  type: TileType;
  color?: string; // Only for properties
  price?: number;
  image?: string; // Only for properties
}

export const tiles: Tile[] = [
  { id: 0, name: 'Start', type: 'start' },
  {
    id: 1,
    name: '1. Litoral',
    type: 'property',
    price: 60,
    image: '/properties/litoral.png',
  },
  { id: 2, name: 'Camping', type: 'camping', color: 'yellow' },
  {
    id: 3,
    name: '2. Mahmudia',
    type: 'property',
    price: 100,
    image: '/properties/mahmudia.png',
  },
  { id: 4, name: 'Stație Auto', type: 'statie', color: 'orange' },
  {
    id: 5,
    name: '3. Lacul Sărat',
    type: 'property',
    price: 100,
    image: '/properties/lacul-sarat.png',
  },
  {
    id: 6,
    name: '4. Soveja',
    type: 'property',
    price: 120,
    image: '/properties/soveja.png',
  },
  {
    id: 7,
    name: '5. Roman',
    type: 'property',
    price: 140,
    image: '/properties/roman.png',
  },
  { id: 8, name: 'Surpriză', type: 'surpriza', color: 'pink' },
  {
    id: 9,
    name: '6. Suceava',
    type: 'property',
    price: 140,
    image: '/properties/suceava.png',
  },
  { id: 10, name: 'Parcare', type: 'parcare' },
  {
    id: 11,
    name: 'Semafor',
    type: 'semafor',
    color: 'lightblue',
  },
  {
    id: 12,
    name: '7. Harghita',
    type: 'property',
    price: 180,
    image: '/properties/harghita.png',
  },
  {
    id: 13,
    name: '8. Maramureș',
    type: 'property',
    price: 200,
    image: '/properties/maramures.png',
  },
  {
    id: 14,
    name: 'CFR',
    type: 'cfr',
    color: 'green',
    price: 220,
  },
  {
    id: 15,
    name: '9. Munții Apuseni',
    type: 'property',
    price: 240,
    image: '/properties/apuseni.png',
  },
  {
    id: 16,
    name: '10. Lipova',
    type: 'property',
    price: 260,
    image: '/properties/lipova.png',
  },
  {
    id: 17,
    name: 'Surpriză',
    type: 'surpriza',
    color: 'pink',
  },
  {
    id: 18,
    name: '11. Buziaș',
    type: 'property',
    price: 280,
    image: '/properties/buzias.png',
  },
  {
    id: 19,
    name: '12. Băile Herculane',
    type: 'property',
    price: 280,
    image: '/properties/herculane.png',
  },
  { id: 20, name: 'Grădina Botanică', type: 'gradina' },
  {
    id: 21,
    name: 'Stație Auto',
    type: 'statie',
    color: 'orange',
  },
  {
    id: 22,
    name: '13. Porțile Fier',
    type: 'property',
    price: 300,
    image: '/properties/porti-fier.png',
  },
  {
    id: 23,
    name: '14. Tărgu Jiu',
    type: 'property',
    price: 300,
    image: '/properties/tg-jiu.png',
  },
  {
    id: 24,
    name: '15. Horezu',
    type: 'property',
    price: 320,
    image: '/properties/horezu.png',
  },
  {
    id: 25,
    name: '16. Călimănești',
    type: 'property',
    price: 340,
    image: '/properties/calimanesti.png',
  },
  {
    id: 26,
    name: 'Surpriză',
    type: 'surpriza',
    color: 'pink',
  },
  {
    id: 27,
    name: '17. Curtea de Argeș',
    type: 'property',
    price: 380,
    image: '/properties/arges.png',
  },
  {
    id: 28,
    name: '18. Munții Făgăraș',
    type: 'property',
    price: 400,
    image: '/properties/fagaras.png',
  },
  {
    id: 29,
    name: '19. Poiana Brașov',
    type: 'property',
    price: 420,
    image: '/properties/poiana-brasov.png',
  },
  { id: 30, name: 'Hanul Morilor', type: 'han' },
  {
    id: 31,
    name: '20. Bran',
    type: 'property',
    price: 440,
    image: '/properties/bran.png',
  },
  {
    id: 32,
    name: 'Pod',
    type: 'pod',
    color: 'lightblue',
  },
  {
    id: 33,
    name: '21. Sinaia',
    type: 'property',
    price: 480,
    image: '/properties/sinaia.png',
  },
  {
    id: 34,
    name: 'Surpriză',
    type: 'surpriza',
    color: 'pink',
  },
  {
    id: 35,
    name: '22. Cheia',
    type: 'property',
    price: 520,
    image: '/properties/cheia.png',
  },
  {
    id: 36,
    name: '23. Sărata Monteoru',
    type: 'property',
    price: 540,
    image: '/properties/sarata-monteoru.png',
  },
  {
    id: 37,
    name: 'CFR',
    type: 'cfr',
    color: 'green',
  },
  {
    id: 38,
    name: '24. Snagov',
    type: 'property',
    price: 560,
    image: '/properties/snagov.png',
  },
  {
    id: 39,
    name: '25. București',
    type: 'property',
    price: 580,
    image: '/properties/bucuresti.png',
  },
];
