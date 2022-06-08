import classes from "pages/ingame/Center/ActionBoards/Boards/BaseBoard.module.css";
import RoomContext from "system/context/roomInfo/room-context";
import {Fragment, useContext, useEffect, useState} from "react";
import LocalContext from "system/context/localInfo/local-context";
import {DeckManager} from "system/cards/DeckManager";
import {CardDeck} from "system/cards/Card";
import BaseActionButton from "pages/ingame/Center/ActionBoards/Boards/ActionButtons/BaseActionButton";
import {TurnManager} from "system/GameStates/TurnManager";
import * as ActionManager from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {TransitionAction} from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {useShortcutEffect} from "system/hooks/useShortcut";
import {useTranslation} from "react-i18next";
import useDefaultAction from "system/hooks/useDefaultAction";
import {CardPool} from "system/cards/CardPool";
import {RoomContextType} from "system/context/roomInfo/RoomContextProvider";
import {DbReferences, ReferenceManager} from "system/Database/RoomDatabase";
import {ActionType} from "system/GameStates/States";
import {ActionPool} from "system/GameStates/ActionInfo";

export default function AmbassadorBoard2(): JSX.Element {
    const ctx = useContext(RoomContext);
    const deck = ctx.room.game.deck;
    const {t} = useTranslation();
    const localCtx = useContext(LocalContext);
    const [myId, myPlayer] = TurnManager.getMyInfo(ctx, localCtx);
    //get 2 cards from top of the deck
    const topIndex = DeckManager.peekTopIndex(ctx);
    const cardIndicesArr = [myPlayer.icard, myPlayer.icard + 1, topIndex, topIndex + 1];
    const [selectedArr, setSelected] = useState<number[]>([]);
    const [panel, setPanel] = useState<JSX.Element>(<Fragment/>);
    //Max Exchangable
    const numAlive = DeckManager.playerAliveCardNum(deck, myPlayer.icard);
    const keyInfo = useShortcutEffect(cardIndicesArr.length);
    useEffect(() => { // Shortcut system
        const idx = keyInfo.index;
        if (idx < 0) return;
        onMakeAction(cardIndicesArr[idx]);
    }, [keyInfo]);
    useDefaultAction(ctx, localCtx, () => { // AFK system
        endTurn(ctx);
    });

    useEffect(() => {//When action is made...
        const [top, bottom] = generatePanels(cardIndicesArr, selectedArr, deck, onMakeAction);//Update buttons
        setPanel(<Fragment>
            <div className={classes.quarterContainer}>
                {top}
            </div>
            <p className={classes.centerText}>{t("_deck_card_pool")}</p>
            <div className={classes.quarterContainer}>
                {bottom}
            </div>
        </Fragment>);
        if (selectedArr.length < numAlive) return; // Need to choose more
        if (selectedArr.length === 1) { //Max choose 1 case, fill the other with dead card
            setSelected((prev) => [...prev, findDeadAfter(deck, myPlayer.icard)]);
            return;
        }
        const unSelected = cardIndicesArr.filter((value) => !selectedArr.includes(value));//Find the other unselected cards
        if (unSelected.length !== 2 || selectedArr.length !== 2) {//Cannot happen
            console.trace("Somethings wrong");
            endTurn(ctx);
        }
        const newDeck = [...deck];//Copy deck
        newDeck[myPlayer.icard] = deck[selectedArr[0]];
        newDeck[myPlayer.icard + 1] = deck[selectedArr[1]];
        newDeck[topIndex] = deck[unSelected[0]];
        newDeck[topIndex + 1] = deck[unSelected[1]];
        ReferenceManager.updateReference(DbReferences.GAME_deck, newDeck);//Update
        endTurn(ctx);//End
    }, [selectedArr]);

    const onMakeAction = (index: number) => {
        if (selectedArr.length >= numAlive) return;//Cannot pick more
        if (DeckManager.isDead(deck[index])) return; // Cannot pick dead card
        setSelected((prev) => [...prev, index]);
    };

    return (
        <Fragment>
            <div className={classes.header}>{t("_amba_choose_cards")}</div>
            <p className={classes.centerText}>{t("_my_card_pool")}</p>
            {panel}
        </Fragment>
    );
}

function findDeadAfter(deck: CardDeck, index: number): number {
    return (DeckManager.isDead(deck[index])) ? index : index + 1;
}

function endTurn(ctx: RoomContextType) {
    ActionManager.prepareAndPushState(ctx, () => {
        return TransitionAction.EndTurn;
    });
}

function generatePanels(cardIndicesArr: number[], selectedArr: number[], deck: CardDeck, onMakeAction: any): [JSX.Element[], JSX.Element[]] {
    const top: JSX.Element[] = [];
    const bottom: JSX.Element[] = [];
    cardIndicesArr.forEach((cardIndex, i) => {
        const isTop = i < 2;
        const elem = <BaseActionButton key={i} index={i}
                                       param={selectedArr.includes(cardIndex) ?
                                           ActionPool.get(ActionType.None)
                                           : CardPool.getCard(deck[cardIndex])}
                                       cssIndex={(isTop) ? i + 1 : i - 1}
                                       onClickButton={() => {
                                           onMakeAction(cardIndex);
                                       }}/>;
        if (isTop) {
            top.push(elem);
        } else {
            bottom.push(elem);
        }
    });
    return [top, bottom];
}