import {Fragment, useContext, useEffect} from "react";
import {KillInfo} from "system/GameStates/GameTypes";
import RoomContext from "system/context/roomInfo/room-context";
import LocalContext from "system/context/localInfo/local-context";
import {handleCardKill, handleSuicide} from "pages/ingame/Center/ActionBoards/Boards/Discard/DiscardSolver";
import {setMyTimer} from "pages/components/ui/MyTimer/MyTimer";
import {BoardState} from "system/GameStates/States";
import {useTranslation} from "react-i18next";
import {TurnManager} from "system/GameStates/TurnManager";
import {DeckManager} from "system/cards/DeckManager";
import {CardRole} from "system/cards/Card";
import classes from "pages/ingame/Center/ActionBoards/Boards/BaseBoard/BaseBoard.module.css";
import BaseActionButton from "pages/ingame/Center/ActionBoards/Boards/ActionButtons/BaseActionButton";

import {useShortcutEffect} from "system/hooks/useShortcut";

const MAX_PCARD = 2;

export default function DiscardBoard(): JSX.Element {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const killInfo = ctx.room.game.action.param as KillInfo;
    const deck = ctx.room.game.deck;
    const myEntry = TurnManager.getMyInfo(ctx, localCtx);
    const numAlive = DeckManager.playerAliveCardNum(deck, myEntry.player.icard);
    const myCards: CardRole[] = DeckManager.peekCards(deck, myEntry.player.icard, MAX_PCARD);
    const {t} = useTranslation();


    useEffect(() => {
        if (killInfo.nextState === BoardState.CalledAssassinate && numAlive === 2) {
            handleSuicide(t, ctx, killInfo.ownerId);
            return;
        }
        setMyTimer(ctx, localCtx, () => {
            if (myEntry.id !== killInfo.ownerId) return;
            if (killInfo.removed === undefined) return;
            if (killInfo.removed[0] >= 0) return;
            const randomAlive = DeckManager.getRandomFromPlayer(myEntry.player, deck);
            if (randomAlive === null) return;
            onMakeAction(randomAlive - myEntry.player.icard);
        });
    }, [killInfo.removed]);


    const keyInfo = useShortcutEffect(MAX_PCARD);
    useEffect(() => {
        const index = keyInfo.index;
        if (index < 0) return;
        onMakeAction(index);
    }, [keyInfo]);

    function onMakeAction(index: number): boolean {
        const myIndex = myEntry.player.icard + index;
        const card = deck[myIndex];
        if (DeckManager.isDead(card) || card === CardRole.None) return false;
        handleCardKill(t, ctx, myIndex);
        return true;
    }

    return (<Fragment>
            <div className={classes.header}>{t("_discarding_card")}</div>
            <div className={classes.container}>
                {myCards.map((role: CardRole, index: number) => {
                    return (
                        <BaseActionButton
                            key={index}
                            index={index}
                            isCardRole={true}
                            param={DeckManager.isDead(role) ? CardRole.None : role}
                            onClickButton={() => {
                                onMakeAction(index);
                            }}
                        />
                    );
                })}
            </div>
        </Fragment>
    );
}
