import classes from "./BaseBoard.module.css";

export default function BaseBoard(): JSX.Element {
  //TODO change by board state
  return (
    <div className={classes.container}>
      <div className={`${classes.cell} ${classes.cell1}`}>1</div>
      <div className={`${classes.cell} ${classes.cell2}`}>2</div>
      <div className={`${classes.cell} ${classes.cell3}`}>3</div>
      <div className={`${classes.cell} ${classes.cell4}`}>4</div>
      <div className={`${classes.cell} ${classes.cell5}`}>5</div>
      <div className={`${classes.cell} ${classes.cell6}`}>6</div>
      <div className={`${classes.cell} ${classes.cell7}`}>7</div>
      <div className={`${classes.cell} ${classes.cell8}`}>8</div>
    </div>
  );
}
