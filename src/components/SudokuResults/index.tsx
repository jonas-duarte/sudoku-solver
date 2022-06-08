import { SudokuRuleResult } from "../../domain/sudoku/solver";

import styles from "../../styles/Sudoku.module.css";

type SudokuResultsProps = {
  results: SudokuRuleResult[];
  selectedStep: number;
  onSelectStep: (step: number) => void;
};

export function SudokuResults(props: SudokuResultsProps) {
  return (
    <div className={styles.results}>
      <div className={styles.resultsHeader}>Results</div>
      <div className={styles.resultsList}>
        {props.results.map((result, index) => (
          <div
            key={index}
            className={styles.result}
            style={{
              backgroundColor: props.selectedStep - 1 === index ? "#4C4077" : "",
            }}
            onClick={() => {
              props.onSelectStep(index + 1);
            }}
          >
            <div>{index + 1}</div>
            <div>{result.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
