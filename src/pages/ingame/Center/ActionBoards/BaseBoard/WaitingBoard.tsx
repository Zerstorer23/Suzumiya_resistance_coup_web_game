import classes from "pages/ingame/Center/ActionBoards/BaseBoard/BaseBoard.module.css";
import { useContext } from "react";
import LocalContext from "system/context/localInfo/local-context";
import RoomContext from "system/context/room-context";
export default function WaitingBoard(): JSX.Element {
  const ctx = useContext(RoomContext);
  const localCtx = useContext(LocalContext);

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
