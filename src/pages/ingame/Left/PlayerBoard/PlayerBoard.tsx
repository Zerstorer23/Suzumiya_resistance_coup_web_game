import { Fragment } from "react";
import gc from "global.module.css";
import classes from "./PlayerBoard.module.css";
import PlayerItem from "./PlayerItem/PlayerItem";

export default function PlayerBoard(): JSX.Element {
  //TODO
  //localContext
  //get list
  //put list
  return (
    <Fragment>
      <div className={`${gc.round_border} ${classes.container}`}>
        <p className={classes.header}>Players</p>
        <PlayerItem />
        <PlayerItem />
        <PlayerItem />
        <PlayerItem />
        <PlayerItem />
        <PlayerItem />
        <PlayerItem />
        <PlayerItem />
      </div>
    </Fragment>
  );
}
