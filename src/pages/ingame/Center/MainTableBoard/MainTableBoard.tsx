import gc from "../../../../global.module.css";
import classes from "./MainTableBoard.module.css";

export default function MainTableBoard(): JSX.Element {
  return (
    <div className={`${gc.round_border} ${classes.container}`}>Main Table</div>
  );
}
