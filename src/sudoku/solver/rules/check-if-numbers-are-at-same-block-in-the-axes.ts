import { SudokuRule, SudokuRuleResult } from "..";
import { SudokuCellPosition, SudokuCellPossibilities, SudokuGrid } from "../../contracts";
import { cleanBlock, cleanColumn, cleanRow, cloneGrid, defineValue, sameBlock } from "../../utils";

type SudokuMappedCell = {
  position: SudokuCellPosition;
};

function checkIfNumberIsAtSameBlockAtRow(grid: SudokuGrid, number: number, row: number): SudokuRuleResult[] {
  let _grid = cloneGrid(grid);

  const results: SudokuRuleResult[] = [];

  const mappedCells: SudokuMappedCell[] = [];

  for (let i = 0; i < 9; i++) {
    const cell = grid[row][i];

    if (typeof cell === "number" && cell === number) {
      return [];
    }

    if (!Array.isArray(cell)) {
      continue;
    }

    if (!(cell as SudokuCellPossibilities)[number - 1]) {
      continue;
    }

    mappedCells.push({
      position: [row, i],
    });
  }

  const isNumberInASingleBlock = mappedCells.every((cell) => sameBlock(cell.position, mappedCells[0].position));

  if (isNumberInASingleBlock) {
    const newGrid = cleanBlock(
      _grid,
      mappedCells[0].position,
      number,
      mappedCells.map((cell) => cell.position)
    );

    if (newGrid) {
      _grid = newGrid;

      results.push({
        status: "success",
        rule: "check-if-number-is-in-a-single-column-of-the-block",
        grid: cloneGrid(_grid),
        highlight: mappedCells.map((cell) => cell.position),
        message: `The number ${number} is needed in a single block at row ${row + 1}`,
      });
    }
  }

  return results;
}

function checkIfNumberIsAtSameBlockAtColumn(grid: SudokuGrid, number: number, column: number): SudokuRuleResult[] {
  let _grid = cloneGrid(grid);

  const results: SudokuRuleResult[] = [];

  const mappedCells: SudokuMappedCell[] = [];

  for (let i = 0; i < 9; i++) {
    const cell = grid[i][column];

    if (typeof cell === "number" && cell === number) {
      return [];
    }

    if (!Array.isArray(cell)) {
      continue;
    }

    if (!(cell as SudokuCellPossibilities)[number - 1]) {
      continue;
    }

    mappedCells.push({
      position: [i, column],
    });
  }

  const isNumberInASingleBlock = mappedCells.every((cell) => sameBlock(cell.position, mappedCells[0].position));

  if (isNumberInASingleBlock) {
    const newGrid = cleanBlock(
      _grid,
      mappedCells[0].position,
      number,
      mappedCells.map((cell) => cell.position)
    );

    if (newGrid) {
      _grid = newGrid;

      results.push({
        status: "success",
        rule: "check-if-number-is-in-a-single-column-of-the-block",
        grid: cloneGrid(_grid),
        highlight: mappedCells.map((cell) => cell.position),
        message: `The number ${number} is needed in a single block at column ${column + 1}`,
      });
    }
  }

  return results;
}

export const checkIfNumbersAreAtSameBlockInTheAxes: SudokuRule = (grid: SudokuGrid): SudokuRuleResult[] => {
  const results: SudokuRuleResult[] = [];

  for (let number = 1; number <= 9; number++) {
    for (let row = 0; row < 9; row++) {
      const result = checkIfNumberIsAtSameBlockAtRow(results.length > 0 ? results[0].grid : grid, number, row);
      results.push(...result);
    }

    for (let column = 0; column < 9; column++) {
      const result = checkIfNumberIsAtSameBlockAtColumn(results.length > 0 ? results[0].grid : grid, number, column);
      results.push(...result);
    }
  }

  return results;
};
