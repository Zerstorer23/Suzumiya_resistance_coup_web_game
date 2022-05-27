import classes from "pages/ingame/Center/ActionBoards/BaseBoard/BaseBoard.module.css";
export default function WaitingBoard(): JSX.Element {
  //TODO change by board state
  /*
Resolving stage
if pier is me.

else Waiting stage of counter stage

*/
  return (
    <div className={classes.singleContainer}>
      <h1>Waiting for other player's action...</h1>
    </div>
  );
}
