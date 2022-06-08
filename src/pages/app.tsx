import Head from "next/head";
import { useState } from "react";

import SudokuBoard from "../components/SudokuBoard";
import { SudokuResults } from "../components/SudokuResults";

import { SudokuCellPosition, SudokuGrid } from "../domain/sudoku/contracts";
import SudokuSolver, { SudokuRuleResult } from "../domain/sudoku/solver";

import { cleanBlockPossibilities } from "../domain/sudoku/solver/rules/clean-block-possibilities";
import { cleanColumnPossibilities } from "../domain/sudoku/solver/rules/clean-column-possibilities";
import { cleanRowPossibilities } from "../domain/sudoku/solver/rules/clean-row-possibilities";
import { defineUniquePossibilities } from "../domain/sudoku/solver/rules/define-unique-possibilities";
import { cloneGrid } from "../domain/sudoku/utils";

import styles from "../styles/Sudoku.module.css";

const initialGrid: SudokuGrid = [
  [null, 4, null, null, null, null, 6, 8, 5],
  [6, null, 2, null, 9, 8, null, null, null],
  [null, 5, null, 7, 6, 4, null, 1, null],
  [null, 9, null, null, null, 7, null, 6, 8],
  [null, 6, 7, 9, null, 5, null, 4, 2],
  [5, 2, 4, 6, null, 3, null, null, 7],
  [null, null, null, null, null, 9, null, null, null],
  [4, null, null, null, 7, 1, null, null, 6],
  [9, 8, null, null, 5, null, 4, null, null],
];

const CLEAN_GRID: SudokuGrid = [
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
];

const sudokuSolver = new SudokuSolver([cleanRowPossibilities, cleanColumnPossibilities, cleanBlockPossibilities, defineUniquePossibilities]);

export default function SudokuHelper() {
  const [grid, setGrid] = useState<SudokuGrid>(initialGrid);
  const [solvedResults, setSolvedResults] = useState<SudokuRuleResult[]>([]);
  const [step, setStep] = useState<number>(0);

  const handleCellChange = (position: SudokuCellPosition, value: number | null) => {
    const [row, column] = position;
    const newGrid: SudokuGrid = [...grid];
    newGrid[row][column] = value;
    setGrid(newGrid);
  };

  return (
    <div className={styles.container}>
      <div className={styles.boardArea}>
        <SudokuBoard
          grid={solvedResults[step - 1] ? solvedResults[step - 1].grid : grid}
          readOnly={step !== 0}
          onCellChange={(position, value) => {
            handleCellChange(position, value);
          }}
          highlight={solvedResults[step - 1] ? solvedResults[step - 1].highlight : []}
        />
        <div className={styles.buttons}>
          <button
            onClick={() => {
              setGrid(cloneGrid(CLEAN_GRID));
              setStep(0);
              setSolvedResults([]);
            }}
          >
            Clear
          </button>
          <button
            onClick={() => {
              if (step === 0) {
                const results = sudokuSolver.solve(grid);
                setSolvedResults(results);
                setStep(results.length);
              }
            }}
          >
            Resolve
          </button>
        </div>
      </div>
      {solvedResults.length > 0 && (
        <div className={styles.resultsArea}>
          <SudokuResults
            results={solvedResults}
            selectedStep={step}
            onSelectStep={(step: number) => {
              setStep(step);
            }}
          />
        </div>
      )}
    </div>
  );
}
