import { SudokuCellPosition } from "../../contracts";
import { SudokuRule, SudokuRuleResult } from "..";
import { SudokuCellPossibilities, SudokuGrid } from "../../contracts";
import { cleanBlock, cleanColumn, cleanRow, cloneGrid } from "../../utils";

type SudokuMappedCell = {
  value: string;
  originalValue: SudokuCellPossibilities;
  row: number;
  column: number;
  block: number;
};

function mapGridCells(grid: SudokuGrid): SudokuMappedCell[] {
  const cells: SudokuMappedCell[] = [];

  for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
    const row = grid[rowIndex];
    for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
      const cell = row[columnIndex];

      if (Array.isArray(cell)) {
        cells.push({
          value: cell.map(Number).join(""),
          originalValue: cell,
          row: rowIndex,
          column: columnIndex,
          block: Math.floor(rowIndex / 3) * 3 + Math.floor(columnIndex / 3),
        });
      }
    }
  }

  return cells;
}

function findDuplicates(grid: SudokuGrid, cells: SudokuMappedCell[]): SudokuRuleResult[] {
  let _grid = cloneGrid(grid);

  const results: SudokuRuleResult[] = [];

  for (let c = 0; c < cells.length; c++) {
    const cell = cells[c];

    const possibleValues = cell.originalValue.filter((value) => value).length;

    const rowPositions: SudokuCellPosition[] = [[cell.row, cell.column]];
    const columnPositions: SudokuCellPosition[] = [[cell.row, cell.column]];
    const blockPositions: SudokuCellPosition[] = [[cell.row, cell.column]];

    for (let d = c + 1; d < cells.length; d++) {
      const duplicateCell = cells[d];

      if (cell.value !== duplicateCell.value) continue;

      if (cell.row === duplicateCell.row) {
        rowPositions.push([duplicateCell.row, duplicateCell.column]);
        if (possibleValues === rowPositions.length) {
          let hasChanged = false;
          cell.originalValue.forEach((value, index) => {
            if (value) {
              const newGrid = cleanRow(_grid, cell.row, index + 1, rowPositions);
              if (newGrid) {
                _grid = newGrid;
                hasChanged = true;
              }
            }
          });

          if (hasChanged)
            results.push({
              status: "success",
              rule: "solver-check-row-duplicates",
              grid: cloneGrid(_grid),
              message: "Found duplicate values in row",
              highlight: rowPositions,
            });
        }
      }

      if (cell.column === duplicateCell.column) {
        columnPositions.push([duplicateCell.row, duplicateCell.column]);

        if (possibleValues === columnPositions.length) {
          let hasChanged = false;
          cell.originalValue.forEach((value, index) => {
            if (value) {
              const newGrid = cleanColumn(_grid, cell.column, index + 1, columnPositions);
              if (newGrid) {
                _grid = newGrid;
                hasChanged = true;
              }
            }
          });

          if (hasChanged)
            results.push({
              status: "success",
              rule: "solver-check-column-duplicates",
              grid: cloneGrid(_grid),
              message: "Found duplicate values in column",
              highlight: columnPositions,
            });
        }
      }

      if (cell.block === duplicateCell.block) {
        blockPositions.push([duplicateCell.row, duplicateCell.column]);

        if (possibleValues === blockPositions.length) {
          let hasChanged = false;
          cell.originalValue.forEach((value, index) => {
            if (value) {
              const newGrid = cleanBlock(_grid, [cell.row, cell.column], index + 1, blockPositions);
              if (newGrid) {
                _grid = newGrid;
                hasChanged = true;
              }
            }
          });

          if (hasChanged)
            results.push({
              status: "success",
              rule: "solver-check-block-duplicates",
              grid: cloneGrid(_grid),
              message: "Found duplicate values in block",
              highlight: blockPositions,
            });
        }
      }
    }
  }

  return results;
}

export const checkGroups: SudokuRule = (grid: SudokuGrid): SudokuRuleResult[] => {
  const cells: SudokuMappedCell[] = mapGridCells(grid);

  const results = findDuplicates(grid, cells);

  return results;
};
