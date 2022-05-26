import classes from "./PlayersPanel.module.css";
import VerticalLayout from "pages/components/ui/VerticalLayout";
import PlayerListItem from "./PlayerListItem";
import { PlayerMap } from "system/GameStates/GameTypes";
import { IProps } from "system/types/CommonTypes";
import { useContext } from "react";
import RoomContext from "system/context/room-context";
import { setStartingRoom } from "system/GameStates/RoomGenerator";
import LocalContext, {
  LocalField,
} from "system/context/localInfo/local-context";

// type Props = IProps & {
//   playerMap: PlayerMap;
// };
export default function PlayersPanel(props: IProps) {
  const ctx = useContext(RoomContext);
  const localCtx = useContext(LocalContext);
  console.log("Panel loaded");
  console.log(ctx.room);
  const onClickStart = () => {
    //return if playerId is not the same as hostId
    const room = ctx.room;
    // if (numPlayer <= 1) return;
    //return if player num == 1
    ///1. SHuffle deck
    // 1- 1. 3* roles(5) = 15
    // 1-2 wwe want deck to have at elast 3 ccards
    // -3 supports up to 6 players
    //  more than 6,   than +5
    //while(remaining <= 2) add 5.
    //  5 call sshuffle
    //just distribute 2 starting from 0 ~ last player

    // 2. Set each field
    setStartingRoom(room, localCtx.getVal(LocalField.SortedList));
    //NOTE replace By listening

    //    history.replace("/game");
  };
  const elemList: JSX.Element[] = [];
  //TODO useContext
  const playerMap: PlayerMap = ctx.room.playerMap;
  const currPlayer = playerMap.size;
  playerMap.forEach((player, key) => {
    const elem = <PlayerListItem key={key} player={player} />;
    elemList.push(elem);
  });

  //props: IProps

  return (
    <VerticalLayout className={`${classes.container} `}>
      <div className={classes.headerContainer}>
        <p className={classes.headerTitle}>Hamang No.6</p>
        <p className={classes.headerPlayerNum}>{`${currPlayer}/20`}</p>
      </div>
      <VerticalLayout className={classes.list}>{elemList}</VerticalLayout>
      <button className={classes.buttonStart} onClick={onClickStart}>
        start
      </button>
    </VerticalLayout>
  );
}
