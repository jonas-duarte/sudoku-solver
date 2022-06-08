import { SudokuCellPosition, SudokuGrid, SudokuCellPossibilities, SudokuSetType } from "./contracts";

export function cloneGrid(grid: SudokuGrid): SudokuGrid {
  return JSON.parse(JSON.stringify(grid));
}

export function* rowHighlightGenerator(row: number): IterableIterator<SudokuCellPosition> {
  for (let i = 0; i < 9; i++) {
    yield [row, i];
  }
}

export function* columnHighlightGenerator(column: number): IterableIterator<SudokuCellPosition> {
  for (let i = 0; i < 9; i++) {
    yield [i, column];
  }
}

export function* blockHighlightGenerator(block: number): IterableIterator<SudokuCellPosition> {
  const blockRow = Math.floor(block / 3) * 3;
  const blockColumn = (block % 3) * 3;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      yield [blockRow + i, blockColumn + j];
    }
  }
}

export function cleanRow(grid: SudokuGrid, row: number, number: number, exclude?: SudokuCellPosition[]): SudokuGrid | null {
  let hasChanged = false;
  for (let column = 0; column < 9; column++) {
    if (exclude && exclude.some((p) => p[0] === row && p[1] === column)) {
      continue;
    }

    const cell = grid[row][column];

    if (!Array.isArray(cell)) {
      continue;
    }

    if (!(cell as SudokuCellPossibilities)[number - 1]) {
      continue;
    }

    (cell as SudokuCellPossibilities)[number - 1] = false;
    hasChanged = true;
  }

  return hasChanged ? grid : null;
}

export function cleanColumn(grid: SudokuGrid, column: number, number: number, exclude?: SudokuCellPosition[]): SudokuGrid | null {
  let hasChanged = false;
  for (let row = 0; row < 9; row++) {
    if (exclude && exclude.some((p) => p[0] === row && p[1] === column)) {
      continue;
    }

    const cell = grid[row][column];

    if (!Array.isArray(cell)) {
      continue;
    }

    if (!(cell as SudokuCellPossibilities)[number - 1]) {
      continue;
    }

    (cell as SudokuCellPossibilities)[number - 1] = false;
    hasChanged = true;
  }

  return hasChanged ? grid : null;
}

export function cleanBlock(grid: SudokuGrid, position: SudokuCellPosition, number: number, exclude?: SudokuCellPosition[]): SudokuGrid | null {
  const blockRow = Math.floor(position[0] / 3);
  const columnRow = Math.floor(position[1] / 3);

  let hasChanged = false;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const row = blockRow * 3 + i;
      const column = columnRow * 3 + j;

      if (exclude && exclude.some((p) => p[0] === row && p[1] === column)) {
        continue;
      }

      const cell = grid[row][column];

      if (!Array.isArray(cell)) {
        continue;
      }

      if (!(cell as SudokuCellPossibilities)[number - 1]) {
        continue;
      }

      (cell as SudokuCellPossibilities)[number - 1] = false;
      hasChanged = true;
    }
  }

  return hasChanged ? grid : null;
}

export function defineValue(grid: SudokuGrid, position: SudokuCellPosition, value: number): SudokuGrid {
  const [row, column] = position;

  let newGrid = cloneGrid(grid);

  newGrid[row][column] = value;

  newGrid = cleanRow(newGrid, row, value) || newGrid;
  newGrid = cleanColumn(newGrid, column, value) || newGrid;
  newGrid = cleanBlock(newGrid, [row, column], value) || newGrid;

  return newGrid;
}

export function sameRow(p1: SudokuCellPosition, p2: SudokuCellPosition): boolean {
  return p1[0] === p2[0];
}

export function sameColumn(p1: SudokuCellPosition, p2: SudokuCellPosition): boolean {
  return p1[1] === p2[1];
}

export function sameBlock(p1: SudokuCellPosition, p2: SudokuCellPosition): boolean {
  const block1 = Math.floor(p1[0] / 3) * 3 + Math.floor(p1[1] / 3);
  const block2 = Math.floor(p2[0] / 3) * 3 + Math.floor(p2[1] / 3);

  return block1 === block2;
}

export function cleanBySetType(
  setType: SudokuSetType,
  grid: SudokuGrid,
  position: SudokuCellPosition,
  number: number,
  exclude?: SudokuCellPosition[]
): SudokuGrid | null {
  switch (setType) {
    case "row":
      return cleanRow(grid, position[0], number, exclude);
    case "column":
      return cleanColumn(grid, position[1], number, exclude);
    case "block":
      return cleanBlock(grid, position, number, exclude);
  }

  return null;
}

export function getSetTypeKey(setType: SudokuSetType, position: SudokuCellPosition): `${string}${number}` {
  switch (setType) {
    case "row":
      return `r${position[0]}`;
    case "column":
      return `c${position[1]}`;
    case "block":
      const block = Math.floor(position[0] / 3) * 3 + Math.floor(position[1] / 3);
      return `b${block}`;
  }
}
