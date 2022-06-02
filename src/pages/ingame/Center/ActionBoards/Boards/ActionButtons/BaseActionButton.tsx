import {IProps} from "system/types/CommonTypes";
import {ActionType} from "system/GameStates/States";
import classes from "pages/ingame/Center/ActionBoards/Boards/BaseBoard.module.css";
import {ActionInfo} from "system/GameStates/ActionInfo";
import {Fragment, useContext} from "react";
import {Card, CardRole} from "system/cards/Card";
import RoomContext from "system/context/roomInfo/room-context";
import LocalContext from "system/context/localInfo/local-context";
import {TurnManager} from "system/GameStates/TurnManager";
import {DeckManager} from "system/cards/DeckManager";
import HorizontalLayout from "pages/components/ui/HorizontalLayout";
import {CardPool} from "system/cards/CardPool";

type Prop = IProps & {
    param: Card | ActionInfo;
    onClickButton: () => void;
};
export default function BaseActionButton(props: Prop) {
    let name = "";
    let hasCard = false;
    let isCard = true;
    const param = props.param;
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const [myId, myPlayer] = TurnManager.getMyInfo(ctx, localCtx);
    const myCards = DeckManager.peekCards(ctx.room.game.deck, myPlayer.icard, 2);

    let relatedRole = CardRole.None;
    if (param instanceof Card) {
        hasCard = true;
        relatedRole = param.cardRole;
        name = param.getName();
        //Card case
    } else {
        //ActionInfo Case
        switch (param.actionType) {
            case ActionType.ChangeCards:
            case ActionType.DefendWithAmbassador:
                relatedRole = (CardRole.Ambassador);
                break;
            case ActionType.Assassinate:
                relatedRole = (CardRole.Assassin);
                break;
            case ActionType.ContessaBlocksAssassination:
                relatedRole = (CardRole.Contessa);
                break;
            case ActionType.DefendWithCaptain:
            case ActionType.Steal:
                relatedRole = (CardRole.Captain);
                break;
            case ActionType.GetThree:
            case ActionType.DukeBlocksForeignAid:
                relatedRole = (CardRole.Duke);
                break;
            case ActionType.None:
                return <Fragment/>;
            default:
                hasCard = true;
                isCard = false;
                break;
        }
        name = param.getName();
        hasCard = (myCards.includes(relatedRole)) || !isCard;
    }

    const iconElem = isCard ? (
        <img
            className={`${classes.characterIcon}`}
            src={`${(CardPool.getCard(relatedRole)).getImage()}`}
            alt="card"
        />
    ) : <Fragment/>;
    return (
        <button
            className={`${classes.cell} ${props.className}`}
            onClick={props.onClickButton}
        >
            <HorizontalLayout className={classes.fullBox}>
                {iconElem}
                <p className={classes.nameText}>{name}</p>
                <p className={(isCard) ? classes.lieText : ""}>{hasCard ? "" : "[Lie]"}</p>
            </HorizontalLayout>
        </button>
    );
}
