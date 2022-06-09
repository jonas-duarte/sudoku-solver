import { SudokuRule, SudokuRuleResult } from "..";
import { SudokuCellPosition, SudokuCellPossibilities, SudokuGrid } from "../../contracts";
import { cleanColumn, cleanRow, cloneGrid, defineValue } from "../../utils";

type SudokuMappedCell = {
  position: SudokuCellPosition;
};

function checkIfNumberIsAtSameAxleInBlock(grid: SudokuGrid, block: number, number: number): SudokuRuleResult[] {
  let _grid = cloneGrid(grid);

  const results: SudokuRuleResult[] = [];

  const blockRow = Math.floor(block / 3);
  const columnRow = Math.floor(block % 3);

  const mappedCells: SudokuMappedCell[] = [];

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const row = blockRow * 3 + i;
      const column = columnRow * 3 + j;
      const cell = grid[row][column];

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
        position: [row, column],
      });
    }
  }

  const isNumberInASingleRow = mappedCells.every((cell) => cell.position[0] === mappedCells[0].position[0]);
  const isNumberInASingleColumn = mappedCells.every((cell) => cell.position[1] === mappedCells[0].position[1]);

  if (isNumberInASingleRow) {
    const newGrid = cleanRow(
      _grid,
      mappedCells[0].position[0],
      number,
      mappedCells.map((cell) => cell.position)
    );

    if (newGrid) {
      _grid = newGrid;

      results.push({
        status: "success",
        rule: "check-if-number-is-needed-in-a-row-of-the-block",
        grid: cloneGrid(_grid),
        highlight: mappedCells.map((cell) => cell.position),
        message: `The number ${number} is in a single row of the block`,
      });
    }
  }

  if (isNumberInASingleColumn) {
    const newGrid = cleanColumn(
      _grid,
      mappedCells[0].position[1],
      number,
      mappedCells.map((cell) => cell.position)
    );
    if (newGrid) {
      _grid = newGrid;
      results.push({
        status: "success",
        rule: "check-if-number-is-needed-in-a-column-of-the-block",
        grid: cloneGrid(_grid),
        highlight: mappedCells.map((cell) => cell.position),
        message: `The number ${number} is in a single column of the block`,
      });
    }
  }

  return results;
}

export const checkIfNumbersAreAtSameAxleInBlocks: SudokuRule = (grid: SudokuGrid): SudokuRuleResult[] => {
  const results: SudokuRuleResult[] = [];

  for (let number = 1; number <= 9; number++) {
    for (let block = 0; block < 9; block++) {
      const blockResults = checkIfNumberIsAtSameAxleInBlock(results.length > 0 ? results[results.length - 1].grid : grid, block, number);
      results.push(...blockResults);
    }
  }

  return results;
};
