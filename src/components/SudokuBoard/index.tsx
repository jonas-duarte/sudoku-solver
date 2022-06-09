import SudokuCell from "./SudokuCell";

import { SudokuCellPosition, SudokuGrid } from "../../sudoku/contracts";

import styles from "../../styles/Sudoku.module.css";

function* generatePositions(): IterableIterator<SudokuCellPosition> {
  for (let row = 0; row < 9; row++) {
    for (let column = 0; column < 9; column++) {
      yield [row, column];
    }
  }
}

const positions = [...generatePositions()];

type SudokuBoardProps = {
  grid: SudokuGrid;
  readOnly: boolean;
  onCellChange: (position: SudokuCellPosition, value: number | null) => void;
  highlight: SudokuCellPosition[];
};

export default function SudokuBoard(props: SudokuBoardProps) {
  return (
    <div className={styles.board}>
      {positions.map(([row, column]) => {
        const value = props.grid[row][column];
        return (
          <SudokuCell
            key={`${row}-${column}`}
            value={value}
            onCellChange={(value) => {
              props.onCellChange([row, column], value);
            }}
            readOnly={props.readOnly}
            highlight={props.highlight.find(([r, c]) => r === row && c === column) ? true : false}
          />
        );
      })}
    </div>
  );
}
