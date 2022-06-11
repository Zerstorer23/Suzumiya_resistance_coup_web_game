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
import {useTranslation} from "react-i18next";
import {CursorState} from "system/context/localInfo/LocalContextProvider";
import gc from "global.module.css";

type Prop = IProps & {
    index: number;
    cssIndex?: number;
    isCardRole: boolean;
    param: CardRole | ActionType;
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
    const myEntry = TurnManager.getMyInfo(ctx, localCtx);
    const myCards = DeckManager.peekCards(ctx.room.game.deck, myEntry.player.icard, 2);

    if (checkEmptyCard(t, props.isCardRole, param)) return <Fragment/>;

    function onMouseOver(e: any) {
        if (props.isCardRole) return;
        const key = getTutorialText(param as ActionType);
        if (key === null) return;
        localCtx.setVal(LocalField.TutorialSelector, key);
    }

    function onMouseOut(e: any) {
        localCtx.setVal(LocalField.TutorialSelector, CursorState.Idle);
    }

    const [name, hasCard, isCard, relatedRole, cost] = analyseParam(t, props.isCardRole, param, myCards);
    let iconElem = <Fragment/>;
    let subClassName = "";
    if (isCard) {
        iconElem = <img
            className={`${classes.characterIcon} ${gc.absoluteLeftCenter}`}
            src={`${Card.getImage(relatedRole)}`}
            alt="card"
        />;
        subClassName = classes.lieText;
    }

    const hasEnoughMoney = myEntry.player.coins >= cost;
    let subText = hasCard ? "" : t("_lie_marker");
    if (!hasEnoughMoney) {
        subClassName = classes.lieText;
        subText = t("_coin_cost");
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
                <p className={`${classes.nameText} ${gc.absoluteCenter}`}>{name}</p>
                <p className={`${subClassName} ${gc.absoluteRightCenter}`}>{subText}</p>
            </HorizontalLayout>
            <div className={classes.shortcutHint}>{props.index + 1}</div>
        </button>
    );
}

function checkEmptyCard(t: any, isCard: boolean, param: CardRole | ActionType): boolean {
    if (isCard) {
        if (param === CardRole.None) return true;
        if (DeckManager.isDead(param as CardRole)) return true;
    } else {
        if (param === ActionType.None) return true;
    }
    return false;
}

function analyseParam(t: any, isCard: boolean, param: CardRole | ActionType, myCards: CardRole[]): [string, boolean, boolean, CardRole, number] {
    let name: string;
    let hasCard: boolean;
    let relatedRole = CardRole.None;
    let cost = 0;

    if (isCard) {
        hasCard = true;
        relatedRole = param as CardRole;
        name = Card.getName(t, relatedRole);
    } else {
        //ActionInfo Case
        switch (param as ActionType) {
            case ActionType.ChangeCards:
            case ActionType.DefendWithAmbassador:
                relatedRole = CardRole.Ambassador;
                isCard = true;
                break;
            case ActionType.Assassinate:
                relatedRole = CardRole.Assassin;
                isCard = true;
                cost = 3;
                break;
            case ActionType.ContessaBlocksAssassination:
                relatedRole = CardRole.Contessa;
                isCard = true;
                break;
            case ActionType.DefendWithCaptain:
            case ActionType.Steal:
                relatedRole = CardRole.Captain;
                isCard = true;
                break;
            case ActionType.GetThree:
            case ActionType.DukeBlocksForeignAid:
                relatedRole = CardRole.Duke;
                isCard = true;
                break;
            case ActionType.Coup:
                hasCard = true;
                cost = 7;
                break;
            default:
                hasCard = true;
                break;
        }
        name = ActionInfo.getName(t, param as ActionType);
        hasCard = myCards.includes(relatedRole) || !isCard;
    }
    return [name, hasCard, isCard, relatedRole, cost];
}

function getTutorialText(actionType: ActionType): string | null {
    switch (actionType) {
        case ActionType.InquisiteCards:
            return "_tutorial_inquisite";
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