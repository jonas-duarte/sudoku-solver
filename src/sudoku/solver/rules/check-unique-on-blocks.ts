import { SudokuRule, SudokuRuleResult } from "..";
import { SudokuGrid } from "../../contracts";
import { cloneGrid, defineValue } from "../../utils";

function checkUniqueOnBlock(grid: SudokuGrid, block: number): SudokuRuleResult[] {
  let _grid = cloneGrid(grid);
  const row = Math.floor(block / 3);
  const column = block % 3;
  const _block = [
    ..._grid[row * 3 + 0].slice(column * 3, column * 3 + 3),
    ..._grid[row * 3 + 1].slice(column * 3, column * 3 + 3),
    ..._grid[row * 3 + 2].slice(column * 3, column * 3 + 3),
  ];

  const results: SudokuRuleResult[] = [];

  for (let v = 0; v < 9; v++) {
    const cellWithValue = _block.filter((cell) => Array.isArray(cell) && cell[v] === true);
    if (cellWithValue.length === 1) {
      const cell = cellWithValue[0];
      const cellIndex = _block.indexOf(cell);
      const value = v + 1;

      _grid = defineValue(_grid, [row * 3 + Math.floor(cellIndex / 3), column * 3 + (cellIndex % 3)], value);

      results.push({
        status: "success",
        rule: "check-unique-on-blocks",
        grid: cloneGrid(_grid),
        message: `Number ${value} is unique in block ${block + 1}`,
        highlight: [[row * 3 + Math.floor(cellIndex / 3), column * 3 + (cellIndex % 3)]],
      });
    }
  }

  return results;
}

export const checkUniqueOnBlocks: SudokuRule = (grid: SudokuGrid) => {
  const results: SudokuRuleResult[] = [];

  let lastGridSolution = grid;
  for (let blockIndex = 0; blockIndex < 9; blockIndex++) {
    const blockResults = checkUniqueOnBlock(lastGridSolution, blockIndex);
    results.push(...blockResults);
    lastGridSolution = blockResults[blockResults.length - 1]?.grid ?? lastGridSolution;
  }

  return results;
};
