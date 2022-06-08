import { SudokuRule, SudokuRuleResult } from "..";
import { SudokuCellPossibilities, SudokuGrid, SudokuRow } from "../../contracts";
import { cloneGrid } from "../../utils";

function checkBlock(grid: SudokuGrid, block: number): SudokuRuleResult[] {
  const _grid = cloneGrid(grid);
  const row = Math.floor(block / 3);
  const column = block % 3;
  const _block = [
    ..._grid[row * 3 + 0].slice(column * 3, column * 3 + 3),
    ..._grid[row * 3 + 1].slice(column * 3, column * 3 + 3),
    ..._grid[row * 3 + 2].slice(column * 3, column * 3 + 3),
  ];

  const numbers: number[] = [];
  for (let cell of _block) {
    if (typeof cell === "number") {
      numbers.push(cell);
    }
  }

  if (numbers.length === 0) {
    return [];
  }

  if (numbers.length === 9) {
    return [];
  }

  const results: SudokuRuleResult[] = [];
  for (let number of numbers) {
    let hasChangedSomeCell = false;
    for (let cell of _block) {
      if (typeof cell === "number") {
        continue;
      }

      if (!(cell as SudokuCellPossibilities)[number - 1]) {
        continue;
      }

      (cell as SudokuCellPossibilities)[number - 1] = false;
      hasChangedSomeCell = true;
    }

    if (hasChangedSomeCell) {
      const cellRow = Math.floor(block / 3) * 3 + Math.floor(_block.indexOf(number) / 3);
      const cellColumn = (block % 3) * 3 + (_block.indexOf(number) % 3);
      results.push({
        status: "success",
        rule: "clean-block-possibilities",
        grid: cloneGrid(_grid),
        message: `Number ${number} cleaned from block ${block + 1}`,
        highlight: [[cellRow, cellColumn]],
      });
    }
  }

  return results;
}

export const cleanBlocks: SudokuRule = (grid: SudokuGrid) => {
  const results: SudokuRuleResult[] = [];

  let lastGridSolution = grid;
  for (let blockIndex = 0; blockIndex < grid.length; blockIndex++) {
    const blockResults = checkBlock(lastGridSolution, blockIndex);
    results.push(...blockResults);
    lastGridSolution = blockResults[blockResults.length - 1]?.grid ?? lastGridSolution;
  }

  return results;
};
