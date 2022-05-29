import { resourceUsage } from "process";
import IMG_NAGATO from "resources/images/nagato2.png";
import IMG_CARD from "resources/images/card_ico.png";
import IMG_COIN from "resources/images/coin_ico.png";

import HorizontalLayout from "pages/components/ui/HorizontalLayout";
import gc from "global.module.css";
import classes from "./PlayerItem.module.css";
import { IProps } from "system/types/CommonTypes";
import { Player } from "system/GameStates/GameTypes";
import { useContext } from "react";
import LocalContext, {
  LocalField,
} from "system/context/localInfo/local-context";
import { CursorState } from "system/context/localInfo/LocalContextProvider";
import RoomContext from "system/context/room-context";
import { TurnManager } from "system/GameStates/TurnManager";

type Props = IProps & {
  player: Player;
  playerId: string;
};
export default function PlayerItem(props: Props): JSX.Element {
  const localCtx = useContext(LocalContext);
  const ctx = useContext(RoomContext);
  const pSelector = localCtx.getVal(LocalField.PlayerSelector);
  let panelColor = "";
  const currentTurnId = TurnManager.getCurrentPlayerId(ctx, localCtx);
  const nextTurnId = TurnManager.getNextPlayerId(localCtx);
  const isMe = props.playerId === localCtx.getVal(LocalField.Id);
  if (isMe) {
    //My panel has highest priority and is unselectable
    panelColor = classes.isMe;
  } else if (pSelector === CursorState.Selecting) {
    //When selecting, show color
    panelColor = classes.selectable;
  } else if (props.playerId === currentTurnId) {
    panelColor = classes.currentTurn;
  } else if (props.playerId === nextTurnId) {
    panelColor = classes.nextTurn;
  }
  return (
    <HorizontalLayout className={`${classes.container} ${panelColor}`}>
      <img
        src={IMG_NAGATO}
        alt="nagato"
        className={`${classes.characterIcon}`}
      />
      <div className={`${classes.nameContainer}`}>
        <p className={`${classes.namePanel} `}>{props.player.name}</p>
        <p className={`${classes.subtitle} `}>나입니다.</p>
      </div>

      <div className={`${classes.iconPanel} `}>
        <img alt="" src={IMG_CARD} className={classes.icon} />
        <p className={classes.iconText}>{2}</p>
        {/* TODO: calculate the number of cards left*/}
      </div>
      <div className={`${classes.iconPanel} `}>
        <img alt="" src={IMG_COIN} className={classes.icon} />
        <div className={classes.iconText}>{props.player.coins}</div>
        {}
      </div>
    </HorizontalLayout>
  );
}
