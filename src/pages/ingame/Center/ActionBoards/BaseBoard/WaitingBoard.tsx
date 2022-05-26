import classes from "pages/ingame/Center/ActionBoards/BaseBoard/BaseBoard.module.css";
export default function WaitingBoard(): JSX.Element {
  //TODO change by board state

  return (
    <div className={classes.container}>
      <h1>Waiting for other player's action...</h1>
    </div>
  );
}
