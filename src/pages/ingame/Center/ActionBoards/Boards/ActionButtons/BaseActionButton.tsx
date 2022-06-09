import {IProps} from "system/types/CommonTypes";
import {ActionType} from "system/GameStates/States";
import classes from "pages/ingame/Center/ActionBoards/Boards/ActionButtons/BaseActionButton.module.css";
import {ActionInfo} from "system/GameStates/ActionInfo";
import {Fragment, useContext} from "react";
import {Card, CardRole} from "system/cards/Card";
import RoomContext from "system/context/roomInfo/room-context";
import LocalContext, {LocalField} from "system/context/localInfo/local-context";
import {TurnManager} from "system/GameStates/TurnManager";
import {DeckManager} from "system/cards/DeckManager";
import HorizontalLayout from "pages/components/ui/HorizontalLayout";
import {cardPool} from "system/cards/CardPool";
import {useTranslation} from "react-i18next";
import {insert} from "lang/i18nHelper";
import {CursorState} from "system/context/localInfo/LocalContextProvider";

type Prop = IProps & {
    index: number;
    cssIndex?: number;
    param: Card | ActionInfo;
    onClickButton: () => void;
};

export function getRequiredCoins(action: ActionType): number {
    switch (action) {
        case ActionType.Coup:
            return 7;
        case ActionType.Assassinate:
            return 3;
        default:
            return 0;
    }
}

export default function BaseActionButton(props: Prop) {
    const param = props.param;
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const {t} = useTranslation();
    const [myId, myPlayer] = TurnManager.getMyInfo(ctx, localCtx);
    const myCards = DeckManager.peekCards(ctx.room.game.deck, myPlayer.icard, 2);

    if (checkEmptyCard(t, param)) return <Fragment/>;

    function onMouseOver(e: any) {
        const key = getTutorialText(param);
        if (key === null) return;
        localCtx.setVal(LocalField.TutorialSelector, key);
    }

    function onMouseOut(e: any) {
        localCtx.setVal(LocalField.TutorialSelector, CursorState.Idle);
    }

    const [name, hasCard, isCard, relatedRole, cost] = analyseParam(t, param, myCards);
    let iconElem = <Fragment/>;
    let subClassName = "";
    if (isCard) {
        iconElem = <img
            className={`${classes.characterIcon}`}
            src={`${cardPool.get(relatedRole).getImage()}`}
            alt="card"
        />;
        subClassName = classes.lieText;
    }

    const hasEnoughMoney = myPlayer.coins >= cost;
    let subText = hasCard ? "" : t("_lie_marker");
    if (!hasEnoughMoney) {
        subClassName = classes.noCoinText;
        subText = insert(t, "_coin_cost", cost);
    }

    const disableCss = hasEnoughMoney ? classes.cell : classes.cellDisabled;
    let baseIndex = props.index + 1;
    if (props.cssIndex !== undefined && props.cssIndex > 0) {
        baseIndex = props.cssIndex;
    }
    const cellCss = classes[`cell${baseIndex}`];
    return (
        <button
            className={`${disableCss} ${cellCss} ${props.className}`}
            onClick={props.onClickButton}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
        >
            <HorizontalLayout>
                {iconElem}
                <p className={classes.nameText}>{name}</p>
                <p className={subClassName}>{subText}</p>
            </HorizontalLayout>
            <div className={classes.shortcutHint}>{props.index + 1}</div>
        </button>
    );
}

function checkEmptyCard(t: any, param: any): boolean {
    if (param instanceof Card) {
        if (DeckManager.isDead(param.cardRole)) return true;
    } else {
        if (param.actionType === ActionType.None) return true;
    }
    return false;
}

function analyseParam(t: any, param: any, myCards: CardRole[]): [string, boolean, boolean, CardRole, number] {
    let name = "";
    let hasCard = false;
    let isCard = true;
    let relatedRole = CardRole.None;
    let cost = 0;

    if (param instanceof Card) {
        hasCard = true;
        relatedRole = param.cardRole;
        name = param.getName(t);
    } else {
        //ActionInfo Case
        switch (param.actionType) {
            case ActionType.ChangeCards:
            case ActionType.DefendWithAmbassador:
                relatedRole = CardRole.Ambassador;
                break;
            case ActionType.Assassinate:
                relatedRole = CardRole.Assassin;
                cost = 3;
                break;
            case ActionType.ContessaBlocksAssassination:
                relatedRole = CardRole.Contessa;
                break;
            case ActionType.DefendWithCaptain:
            case ActionType.Steal:
                relatedRole = CardRole.Captain;
                break;
            case ActionType.GetThree:
            case ActionType.DukeBlocksForeignAid:
                relatedRole = CardRole.Duke;
                break;
            case ActionType.Coup:
                hasCard = true;
                isCard = false;
                cost = 7;
                break;
            default:
                hasCard = true;
                isCard = false;
                break;
        }
        name = param.getName(t);
        hasCard = myCards.includes(relatedRole) || !isCard;
    }
    return [name, hasCard, isCard, relatedRole, cost];
}

function getTutorialText(param: Card | ActionInfo): string | null {
    if (param instanceof Card) return null;
    switch (param.actionType) {
        case ActionType.None:
            return null;
        case ActionType.GetOne:
            return "_tutorial_getone";
        case ActionType.GetForeignAid:
            return "_tutorial_foreignAid";
        case ActionType.Coup:
            return "_tutorial_coup";
        case ActionType.Steal:
            return "_tutorial_steal";
        case ActionType.GetThree:
            return "_tutorial_getThree";
        case ActionType.Assassinate:
            return "_tutorial_assassinate";
        case ActionType.ContessaBlocksAssassination:
            return "_tutorial_contessaBlocksAssassin";
        case ActionType.DukeBlocksForeignAid:
            return "_tutorial_dukeBlocksForeignAid";
        case ActionType.ChangeCards:
            return "_tutorial_changeCard";
        case ActionType.IsALie:
            return "_tutorial_isALie";
        case ActionType.DefendWithCaptain:
            return "_tutorial_defendCaptain";
        case ActionType.DefendWithAmbassador:
            return "_tutorial_defendAMbassaador";
        case ActionType.Accept:
            return "_tutorial_defendAccept";
    }
}