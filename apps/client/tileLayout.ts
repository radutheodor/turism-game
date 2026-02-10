// 13×13 grid — the correct Monopoly board layout.
//
// 4 corners: each 2×2 cells
// 4 sides: 9 tiles each, 1 cell wide × 1 cell tall at cols/rows 3-11
//
// Bottom/top tiles: 1 col wide, rows span from edge inward
// Left/right tiles: 1 row tall, cols span from edge inward
//
// Visual (col × row):
//
//   c: 1-2    3  4  5  6  7  8  9  10 11   12-13
// r1-2: [GB]  21 22 23 24 25 26 27 28 29   [HM]
// r3:   19──                                31──
// r4:   18──                                32──
// r5:   17──                                33──
// r6:   16──           CENTER               34──
// r7:   15──                                35──
// r8:   14──                                36──
// r9:   13──                                37──
// r10:  12──                                38──
// r11:  11──                                39──
// r12-13:[PK] 9  8  7  6  5  4  3  2  1    [ST]

export interface TilePos {
  id: number;
  col: number;
  row: number;
  colSpan: number;
  rowSpan: number;
}

export const tileLayout: TilePos[] = [
  // ─── BOTTOM ROW (right → left): rows 12-13 ────────────────
  { id: 0,  col: 12, row: 12, colSpan: 2, rowSpan: 2 }, // Start (BR corner)
  { id: 1,  col: 11, row: 12, colSpan: 1, rowSpan: 2 }, // Litoral
  { id: 2,  col: 10, row: 12, colSpan: 1, rowSpan: 2 }, // Camping
  { id: 3,  col: 9,  row: 12, colSpan: 1, rowSpan: 2 }, // Mahmudia
  { id: 4,  col: 8,  row: 12, colSpan: 1, rowSpan: 2 }, // Statie Auto
  { id: 5,  col: 7,  row: 12, colSpan: 1, rowSpan: 2 }, // Lacul Sarat
  { id: 6,  col: 6,  row: 12, colSpan: 1, rowSpan: 2 }, // Soveja
  { id: 7,  col: 5,  row: 12, colSpan: 1, rowSpan: 2 }, // Roman
  { id: 8,  col: 4,  row: 12, colSpan: 1, rowSpan: 2 }, // Surpriza
  { id: 9,  col: 3,  row: 12, colSpan: 1, rowSpan: 2 }, // Suceava

  // ─── BOTTOM-LEFT CORNER ────────────────────────────────────
  { id: 10, col: 1, row: 12, colSpan: 2, rowSpan: 2 },  // Parcare

  // ─── LEFT COLUMN (bottom → top): cols 1-2 ─────────────────
  { id: 11, col: 1, row: 11, colSpan: 2, rowSpan: 1 },  // Semafor
  { id: 12, col: 1, row: 10, colSpan: 2, rowSpan: 1 },  // Harghita
  { id: 13, col: 1, row: 9,  colSpan: 2, rowSpan: 1 },  // Maramures
  { id: 14, col: 1, row: 8,  colSpan: 2, rowSpan: 1 },  // CFR
  { id: 15, col: 1, row: 7,  colSpan: 2, rowSpan: 1 },  // M. Apuseni
  { id: 16, col: 1, row: 6,  colSpan: 2, rowSpan: 1 },  // Lipova
  { id: 17, col: 1, row: 5,  colSpan: 2, rowSpan: 1 },  // Surpriza
  { id: 18, col: 1, row: 4,  colSpan: 2, rowSpan: 1 },  // Buzias
  { id: 19, col: 1, row: 3,  colSpan: 2, rowSpan: 1 },  // B. Herculane

  // ─── TOP-LEFT CORNER ───────────────────────────────────────
  { id: 20, col: 1, row: 1, colSpan: 2, rowSpan: 2 },   // Grădina Botanică

  // ─── TOP ROW (left → right): rows 1-2 ─────────────────────
  { id: 21, col: 3,  row: 1, colSpan: 1, rowSpan: 2 },  // Statie Auto
  { id: 22, col: 4,  row: 1, colSpan: 1, rowSpan: 2 },  // Portile Fier
  { id: 23, col: 5,  row: 1, colSpan: 1, rowSpan: 2 },  // Tg. Jiu
  { id: 24, col: 6,  row: 1, colSpan: 1, rowSpan: 2 },  // Horezu
  { id: 25, col: 7,  row: 1, colSpan: 1, rowSpan: 2 },  // Calimanesti
  { id: 26, col: 8,  row: 1, colSpan: 1, rowSpan: 2 },  // Surpriza
  { id: 27, col: 9,  row: 1, colSpan: 1, rowSpan: 2 },  // C. de Arges
  { id: 28, col: 10, row: 1, colSpan: 1, rowSpan: 2 },  // M. Fagaras
  { id: 29, col: 11, row: 1, colSpan: 1, rowSpan: 2 },  // Poiana Brasov

  // ─── TOP-RIGHT CORNER ──────────────────────────────────────
  { id: 30, col: 12, row: 1, colSpan: 2, rowSpan: 2 },  // Hanul Morilor

  // ─── RIGHT COLUMN (top → bottom): cols 12-13 ──────────────
  { id: 31, col: 12, row: 3,  colSpan: 2, rowSpan: 1 }, // Bran
  { id: 32, col: 12, row: 4,  colSpan: 2, rowSpan: 1 }, // Pod
  { id: 33, col: 12, row: 5,  colSpan: 2, rowSpan: 1 }, // Sinaia
  { id: 34, col: 12, row: 6,  colSpan: 2, rowSpan: 1 }, // Surpriza
  { id: 35, col: 12, row: 7,  colSpan: 2, rowSpan: 1 }, // Cheia
  { id: 36, col: 12, row: 8,  colSpan: 2, rowSpan: 1 }, // Sar. Monteoru
  { id: 37, col: 12, row: 9,  colSpan: 2, rowSpan: 1 }, // CFR
  { id: 38, col: 12, row: 10, colSpan: 2, rowSpan: 1 }, // Snagov
  { id: 39, col: 12, row: 11, colSpan: 2, rowSpan: 1 }, // Bucuresti
];
