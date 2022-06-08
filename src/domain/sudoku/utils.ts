import { SudokuCellPosition, SudokuGrid } from "./contracts";

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