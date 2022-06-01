import { IProps } from "system/types/CommonTypes";
import { ActionType } from "system/GameStates/States";
import classes from "pages/ingame/Center/ActionBoards/Boards/BaseBoard.module.css";
import { ActionInfo } from "system/GameStates/ActionInfo";
import { Fragment, useContext } from "react";
import { Card, CardRole } from "system/cards/Card";
import RoomContext from "system/context/roomInfo/room-context";
import LocalContext, {
  LocalField,
} from "system/context/localInfo/local-context";
import { TurnManager } from "system/GameStates/TurnManager";
import { DeckManager } from "system/cards/DeckManager";

type Prop = IProps & {
  param: Card | ActionInfo;
  onClickButton: () => void;
};
export default function BaseActionButton(props: Prop) {
  let name = "";
  let hasCard = false;
  let isCard = false;
  const param = props.param;
  const ctx = useContext(RoomContext);
  const localCtx = useContext(LocalContext);
  const [myId, myPlayer] = TurnManager.getMyInfo(ctx, localCtx);
  const myCards = DeckManager.peekCards(ctx.room.game.deck, myPlayer.icard, 2);

  if (param instanceof Card) {
    isCard = true;
    hasCard = true;
    name = param.getName();
    //Card case
  } else {
    //ActionInfo Case
    switch (param.actionType) {
      case ActionType.ChangeCards:
      case ActionType.DefendWithAmbassador:
        if (myCards.includes(CardRole.Ambassador)) hasCard = true;
        break;
      case ActionType.Assassinate:
        if (myCards.includes(CardRole.Assassin)) hasCard = true;
        break;
      case ActionType.ContessaBlocksAssassination:
        if (myCards.includes(CardRole.Contessa)) hasCard = true;
        break;
      case ActionType.DefendWithCaptain:
      case ActionType.Steal:
        if (myCards.includes(CardRole.Captain)) hasCard = true;
        break;
      case ActionType.GetThree:
      case ActionType.DukeBlocksForeignAid:
        if (myCards.includes(CardRole.Duke)) hasCard = true;
        break;
      case ActionType.None:
        return <Fragment />;
      default:
        hasCard = true;
        break;
    }
    name = param.getName();
  }

  return (
    <button
      className={`${classes.cell} ${props.className}`}
      onClick={props.onClickButton}
    >
      {isCard && (
        <img
          className={`${classes.characterIcon}`}
          src={`${param.getImage()}`}
          alt="card"
        />
      )}
      <p>{name}</p>
      {!hasCard && <p>[Lie]</p>}
    </button>
  );
}
