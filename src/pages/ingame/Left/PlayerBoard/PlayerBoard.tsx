import { Fragment } from "react";
import { useContext } from "react";
import gc from "global.module.css";
import classes from "./PlayerBoard.module.css";
import PlayerItem from "./PlayerItem/PlayerItem";
import LocalContext from "system/context/localInfo/local-context";
import { getSortedListFromMap } from "system/GameStates/RoomGenerator";
import RoomContext from "system/context/room-context";
import { PlayerEntry } from "system/GameStates/GameTypes";
import { IProps } from "system/types/CommonTypes";
import { Player } from "system/GameStates/GameTypes";

export default function PlayerBoard(): JSX.Element {
  //TODO
  //localContext
  //get list
  //put list
  const ctx = useContext(RoomContext);
  const sortedList: PlayerEntry[] = getSortedListFromMap(ctx.room.playerMap);
  console.log(sortedList[0]);

  return (
    <Fragment>
      <div className={`${gc.round_border} ${classes.container}`}>
        <p className={classes.header}>Players</p>
        {sortedList.map((entry) => (
          <PlayerItem player={ctx.room.playerMap.get(entry.id)!} />
        ))}
      </div>
    </Fragment>
  );
}
