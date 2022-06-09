import { useEffect, useState } from "react";
import { SudokuCellValue } from "../../sudoku/contracts";

import styles from "../../styles/Sudoku.module.css";

export type SudokuCellProps = {
  value: SudokuCellValue;
  onCellChange: (value: number | null) => void;
  readOnly: boolean;
  highlight: boolean;
};

export default function SudokuCell(props: SudokuCellProps) {
  const [isEditing, setIsEditing] = useState(false);

  const { value, readOnly, highlight } = props;

  useEffect(() => {
    setIsEditing(false);
  }, [value, readOnly]);

  return (
    <div
      className={styles.cell}
      style={{
        cursor: props.readOnly && !isEditing ? "default" : "pointer",
        backgroundColor: props.highlight ? "#E1BC2988" : "",
      }}
      onClick={() => {
        if (!props.readOnly) {
          setIsEditing(true);
        }
      }}
    >
      {!isEditing && (
        <>
          {Array.isArray(value) ? (
            <div className={styles.possibilitiesGrid}>
              {value.map((possibility, index) => (
                <div key={index} className={styles.subcell}>
                  {possibility ? index + 1 : null}
                </div>
              ))}
            </div>
          ) : (
            value
          )}
        </>
      )}
      {isEditing && (
        <input
          autoFocus
          type="tel"
          pattern="[0-9]*"
          value={value as number}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (!isNaN(value) && value >= 0 && value <= 9) {
              props.onCellChange(value || null);
            }
            setIsEditing(false);
          }}
          onBlur={() => {
            setIsEditing(false);
          }}
          onFocus={(e) => {
            e.target.select();
          }}
        />
      )}
    </div>
  );
}
