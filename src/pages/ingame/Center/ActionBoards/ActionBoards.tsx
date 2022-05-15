import gc from "global.module.css";
import BaseBoard from "pages/ingame/Center/ActionBoards/BaseBoard/BaseBoard";
import classes from "./ActionBoards.module.css";

export default function ActionBoards(): JSX.Element {
  return (
    <div className={`${gc.round_border} ${classes.container}`}>
      <div className={classes.header}>Do my action...</div>
      <BaseBoard />
    </div>
  );
}
