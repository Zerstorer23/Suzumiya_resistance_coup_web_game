import classes from "pages/ingame/Center/ActionBoards/BaseBoard/BaseBoard.module.css";
import { useContext } from "react";
import LocalContext from "system/context/localInfo/local-context";
import RoomContext from "system/context/room-context";
export default function SolverBoard(): JSX.Element {
  //TODO change by board state
  const ctx = useContext(RoomContext);
  const localCtx = useContext(LocalContext);

  return (
    <div className={classes.container}>
      <h1>Counter this Action?</h1>
    </div>
  );
}
