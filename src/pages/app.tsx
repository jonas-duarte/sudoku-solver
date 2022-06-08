import Head from "next/head";
import { useEffect, useState } from "react";

import SudokuBoard from "../components/SudokuBoard";
import { SudokuResults } from "../components/SudokuResults";

import { SudokuCellPosition, SudokuGrid } from "../domain/sudoku/contracts";
import SudokuSolver, { SudokuRuleResult } from "../domain/sudoku/solver";
import { checkGroups } from "../domain/sudoku/solver/rules/check-groups";
import { checkUniqueOnBlocks } from "../domain/sudoku/solver/rules/check-unique-on-blocks";
import { checkUniqueOnColumns } from "../domain/sudoku/solver/rules/check-unique-on-columns";
import { checkUniqueOnRows } from "../domain/sudoku/solver/rules/check-unique-on-rows";
import { cleanBlocks } from "../domain/sudoku/solver/rules/clean-blocks";
import { cleanColumns } from "../domain/sudoku/solver/rules/clean-columns";
import { cleanRows } from "../domain/sudoku/solver/rules/clean-rows";
import { defineUniqueValues } from "../domain/sudoku/solver/rules/define-unique-values";

import { cloneGrid } from "../domain/sudoku/utils";

import styles from "../styles/Sudoku.module.css";

const initialGrids: { [key: string]: SudokuGrid } = {
  Easy: [
    [null, 4, null, null, null, null, 6, 8, 5],
    [6, null, 2, null, 9, 8, null, null, null],
    [null, 5, null, 7, 6, 4, null, 1, null],
    [null, 9, null, null, null, 7, null, 6, 8],
    [null, 6, 7, 9, null, 5, null, 4, 2],
    [5, 2, 4, 6, null, 3, null, null, 7],
    [null, null, null, null, null, 9, null, null, null],
    [4, null, null, null, 7, 1, null, null, 6],
    [9, 8, null, null, 5, null, 4, null, null],
  ],
  Medium: [
    [null, null, 8, null, null, null, null, null, null],
    [null, null, 7, 8, null, 1, null, null, null],
    [3, 9, 6, null, null, null, 8, 7, 1],
    [null, 6, 3, null, null, null, 5, null, 2],
    [5, 7, null, null, 6, null, null, null, null],
    [null, null, null, 9, 5, null, 3, 6, null],
    [6, null, 5, null, 1, null, null, 4, 8],
    [null, null, null, null, 8, null, 2, null, null],
    [null, 8, null, 7, null, null, 6, null, 9],
  ],
  Hard: [
    [9, null, 3, null, 2, 7, 8, null, 5],
    [null, null, 7, 9, 1, null, null, 4, null],
    [null, null, null, null, null, null, null, null, null],
    [null, 7, 9, null, 3, null, null, null, null],
    [1, null, null, null, 9, 8, null, null, null],
    [null, null, null, null, null, null, null, null, 2],
    [null, 4, null, 8, null, null, null, null, null],
    [null, 2, null, null, null, null, 1, null, 8],
    [null, null, null, 2, null, 6, null, null, 4],
  ],
  Expert: [
    [9, null, null, null, null, null, null, null, 4],
    [3, null, null, 5, 6, null, null, null, null],
    [null, 8, null, null, null, null, 5, null, null],
    [null, null, 4, null, null, 1, 9, null, null],
    [null, null, null, null, null, 7, null, null, null],
    [null, 7, 1, 8, null, null, null, null, null],
    [null, null, null, null, null, null, 4, 1, 7],
    [null, null, null, null, 2, null, null, 8, null],
    [null, null, null, null, 8, 3, null, 9, null],
  ],
  Evil: [
    [8, null, null, null, 7, 5, null, 4, null],
    [null, null, null, 9, null, null, null, null, null],
    [null, 3, null, null, null, null, null, null, 6],
    [null, null, null, 2, null, null, null, 1, null],
    [null, 8, null, null, 1, 9, 3, null, null],
    [9, null, null, 4, null, null, null, null, null],
    [null, null, null, null, 2, null, null, null, null],
    [5, null, null, null, 8, 1, null, 7, null],
    [null, null, 7, null, null, null, 4, null, null],
  ],
};

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

// TODO: as regras só deveriam retornar resultados caso elas sejam aplicáveis
const sudokuSolver = new SudokuSolver([
  cleanRows,
  cleanColumns,
  cleanBlocks,
  defineUniqueValues,
  checkGroups,
  checkUniqueOnRows,
  checkUniqueOnColumns,
  checkUniqueOnBlocks,
]);

export default function SudokuHelper() {
  const [grid, setGrid] = useState<SudokuGrid>(initialGrids.Expert);
  const [solvedResults, setSolvedResults] = useState<SudokuRuleResult[]>([]);
  const [step, setStep] = useState<number>(0);

  const handleCellChange = (position: SudokuCellPosition, value: number | null) => {
    const [row, column] = position;
    const newGrid: SudokuGrid = [...grid];
    newGrid[row][column] = value;
    setGrid(newGrid);
  };

  const handleResolve = () => {
    if (step === 0) {
      const results = sudokuSolver.solve(grid);
      setSolvedResults(results);
      setStep(results.length);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.boardArea}>
        <div className={styles.boardHeader}>
          {solvedResults[step - 1] ? `Step ${step} - ${solvedResults[step - 1].message}` : "Welcome to Sudoku Solver"}
        </div>
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
          <button onClick={handleResolve}>Resolve</button>
        </div>

        <div className={styles.buttons}>
          {step === 0 ? (
            <>
              {Object.keys(initialGrids).map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    if (step === 0) {
                      setGrid(initialGrids[key]);
                    }
                  }}
                >
                  {key}
                </button>
              ))}
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  if (step > 1) {
                    setStep(step - 1);
                  }
                }}
              >
                Previous step
              </button>
              <button
                onClick={() => {
                  if (step < solvedResults.length) {
                    setStep(step + 1);
                  }
                }}
              >
                Next step
              </button>
            </>
          )}
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
