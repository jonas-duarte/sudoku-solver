export type SudokuCellPossibilities = [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean];
export type SudokuCellValue = number | SudokuCellPossibilities | null;
export type SudokuCellPosition = [number, number];
export type SudokuRow = [SudokuCellValue, SudokuCellValue, SudokuCellValue, SudokuCellValue, SudokuCellValue, SudokuCellValue, SudokuCellValue, SudokuCellValue, SudokuCellValue];
export type SudokuGrid = [SudokuRow, SudokuRow, SudokuRow, SudokuRow, SudokuRow, SudokuRow, SudokuRow, SudokuRow, SudokuRow];