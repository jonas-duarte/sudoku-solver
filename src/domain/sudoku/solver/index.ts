import { SudokuCellPosition } from "./../contracts";
import { SudokuCellPossibilities, SudokuCellValue, SudokuGrid, SudokuRow } from "../contracts";

export type SudokuRuleStatus = "success" | "failure";

export type SudokuRuleResult = {
  status: SudokuRuleStatus;
  rule: string;
  grid: SudokuGrid;
  message: string;
  highlight: SudokuCellPosition[];
};

export type SudokuRule = (grid: SudokuGrid) => SudokuRuleResult[];

const INITIAL_POSSBILITIES: SudokuCellPossibilities = [true, true, true, true, true, true, true, true, true];

export default class SudokuSolver {
  constructor(private rules: SudokuRule[]) {}

  private static initializeGrid(grid: SudokuGrid): SudokuRuleResult[] {
    const initializedGrid: SudokuGrid = grid.map(
      (row): SudokuRow => row.map((cell): SudokuCellValue => cell || [...INITIAL_POSSBILITIES]) as SudokuRow
    ) as SudokuGrid;

    return [
      {
        status: "success",
        grid: initializedGrid,
        rule: "solver-initialization",
        message: "Solver initialized",
        highlight: [],
      },
    ];
  }

  public solve(grid: SudokuGrid): SudokuRuleResult[] {
    const solvingResults: SudokuRuleResult[] = SudokuSolver.initializeGrid(grid);

    let lastSolvingResultSize = 0;

    while (true) {
      for (const rule of this.rules) {
        const lastSolvingResult: SudokuRuleResult | undefined = solvingResults[solvingResults.length - 1];
        const stepsResults: SudokuRuleResult[] = rule(lastSolvingResult?.grid || grid);
        solvingResults.push(...stepsResults);
      }

      if (solvingResults.length === lastSolvingResultSize || solvingResults.length > 2000) {
        break;
      }

      lastSolvingResultSize = solvingResults.length;
    }

    return solvingResults;
  }
}
