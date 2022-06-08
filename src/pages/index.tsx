import type { NextPage } from "next";
import Link from "next/link";
import styles from "../styles/Home.module.css";

function* gridGenerator() {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      yield [i, j];
    }
  }
}

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <h1>Sudoku Solver</h1>
      <div className={styles.grid}>
        {[...gridGenerator()].map(([i, j]) => (
          <div key={`${i}-${j}`} />
        ))}
      </div>
      <div className={styles.buttons}>
        <Link href="/app">
          <button>App</button>
        </Link>
        <a href="https://github.com/jonas-duarte/sudoku-solver" rel="noreferrer" target="_blank">
          <button>GitHub</button>
        </a>
        <a href="https://www.linkedin.com/in/jonasrdsantos/" rel="noreferrer" target="_blank">
          <button>LinkedIn</button>
        </a>
      </div>
    </div>
  );
};

export default Home;
