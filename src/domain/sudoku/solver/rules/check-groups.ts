import { SudokuCellPosition, SudokuSetType } from "../../contracts";
import { SudokuRule, SudokuRuleResult } from "..";
import { SudokuCellPossibilities, SudokuGrid } from "../../contracts";
import { cleanBlock, cleanBySetType, cleanColumn, cleanRow, cloneGrid, getSetTypeKey, sameBlock, sameColumn, sameRow } from "../../utils";

type SudokuMappedCell = {
  cell: SudokuCellPossibilities;
  position: SudokuCellPosition;
};

function mapSudokuCells(grid: SudokuGrid): SudokuMappedCell[] {
  const mappedCells: SudokuMappedCell[] = [];

  for (let row = 0; row < 9; row++) {
    for (let column = 0; column < 9; column++) {
      const cell = grid[row][column];

      if (!Array.isArray(cell)) {
        continue;
      }

      const position: SudokuCellPosition = [row, column];
      mappedCells.push({ cell, position });
    }
  }

  return mappedCells.sort((a, b) => b.cell.filter((p) => p).length - a.cell.filter((p) => p).length);
}

function createNumberSet(cell: SudokuCellPossibilities, cell2?: SudokuCellPossibilities): number[] {
  return cell.reduce((_set, p, index) => {
    if (p || (cell2 && cell2[index])) {
      _set.push(index + 1);
    }

    return _set;
  }, [] as number[]);
}

function checkGridSets(grid: SudokuGrid, mappedCells: SudokuMappedCell[], setSize: number, type: SudokuSetType): SudokuRuleResult[] {
  const results: SudokuRuleResult[] = [];

  const possibilitiesSets = new Map<string, (SudokuMappedCell & {})[]>();

  for (let i = 0; i < mappedCells.length; i++) {
    const cellMap = mappedCells[i];
    const { cell, position } = cellMap;

    for (let j = i + 1; j < mappedCells.length; j++) {
      const cellMap2 = mappedCells[j];
      const { cell: cell2, position: position2 } = cellMap2;

      if (type === "row" && !sameRow(position, position2)) continue;
      if (type === "column" && !sameColumn(position, position2)) continue;
      if (type === "block" && !sameBlock(position, position2)) continue;

      const set = createNumberSet(cell, cell2);

      if (set.length === setSize) {
        const setKey = `${position.join("-")}|${set.join("-")}`;
        const setCells = possibilitiesSets.get(setKey) || [cellMap];
        setCells.push(cellMap2);
        possibilitiesSets.set(setKey, setCells);
      }
    }
  }

  let _grid = cloneGrid(grid);

  for (const [setKey, setCells] of possibilitiesSets) {
    if (setCells.length === setSize) {
      const positions = setCells.map((cellMap) => cellMap.position);

      const [_, possibilities] = setKey.split("|");

      const numbersSet = possibilities.split("-").map((p) => parseInt(p));

      let hasChanged = false;
      numbersSet.forEach((number) => {
        const newGrid = cleanBySetType(type, _grid, positions[0], number, positions);
        if (newGrid) {
          _grid = newGrid;
          hasChanged = true;
        }
      });

      if (hasChanged) {
        results.push({
          status: "success",
          rule: `check-groups-${type}`,
          grid: cloneGrid(_grid),
          highlight: setCells.map((cellMap) => cellMap.position),
          message: `Set [${numbersSet.join(",")}] is only possible in ${positions.length} cells in this ${type}`,
        });
      }
    }
  }

  return results;
}

export const checkGroups: SudokuRule = (grid: SudokuGrid): SudokuRuleResult[] => {
  const results: SudokuRuleResult[] = [];

  const mappedCells: SudokuMappedCell[] = mapSudokuCells(grid);

  const greatestLength = Math.max(...mappedCells.map((mappedCell) => mappedCell.cell.filter((p) => p).length));

  for (let setSize = 2; setSize <= greatestLength; setSize++) {
    for (let type of ["row", "column", "block"]) {
      const checkResults = checkGridSets(
        results.length ? results[results.length - 1].grid : grid,
        mappedCells.filter((mappedCell) => mappedCell.cell.filter((p) => p).length <= setSize),
        setSize,
        type as SudokuSetType
      );
      results.push(...checkResults);
    }
  }

  return results;
};
