import {Fragment, useContext, useEffect} from "react";
import RoomContext from "system/context/roomInfo/room-context";
import LocalContext from "system/context/localInfo/local-context";
import {TurnManager} from "system/GameStates/TurnManager";
import {CardRole} from "system/cards/Card";
import {DeckManager} from "system/cards/DeckManager";
import {KillInfo} from "system/GameStates/GameTypes";
import classes from "pages/ingame/Center/ActionBoards/Boards/BaseBoard.module.css";
import BaseActionButton from "pages/ingame/Center/ActionBoards/Boards/ActionButtons/BaseActionButton";
import {handleCardKill} from "pages/ingame/Center/ActionBoards/Boards/Discard/DiscardSolver";
import {CardPool} from "system/cards/CardPool";
import {keyCodeToIndex} from "pages/ingame/Center/ActionBoards/Boards/BaseBoard";

export function MyCardsPanel(): JSX.Element {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const deck = ctx.room.game.deck;
    const [myId, localPlayer] = TurnManager.getMyInfo(ctx, localCtx);
    const myCards: CardRole[] = DeckManager.peekCards(deck, localPlayer.icard, 2);

    useEffect(() => {
        if (DeckManager.playerIsDead(deck, ctx.room.playerMap.get(myId)!)) {
            console.trace("WTF?");
            handleCardKill(ctx, localPlayer.icard);
        }

        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, []);

    function onKeyDown(event: any) {
        const idx = keyCodeToIndex(event.keyCode, myCards.length - 1);
        if (idx < 0) return;
        onMakeAction(idx);
    }

    function onMakeAction(index: number) {
        const myIndex = localPlayer.icard + index;
        const card = deck[myIndex];
        if (DeckManager.isDead(card) || card === CardRole.None) return;
        handleCardKill(ctx, myIndex);
    }

    return (
        <Fragment>
            <div className={classes.header}>Choose a card to discard...</div>
            <div className={classes.container}>
                {myCards.map((role: CardRole, index: number) => {
                    return (
                        <BaseActionButton
                            key={index}
                            index={index}
                            param={CardPool.getCard(
                                DeckManager.isDead(role) ? CardRole.None : role
                            )}
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

export function PostKillPanel(): JSX.Element {
    const ctx = useContext(RoomContext);
    const info = ctx.room.game.action.param as KillInfo;
    const player = ctx.room.playerMap.get(info.ownerId)!;
    const cardRole = ctx.room.game.deck[info.removed];
    if (player === undefined) return <Fragment/>;
    const isDead = DeckManager.playerIsDead(ctx.room.game.deck, player);
    return (
        <Fragment>
            <p>{`${player.name} discarded `}{CardPool.getCard(cardRole).getElemName()}</p>
            {isDead && <p>{`${player.name} is removed from game!`}</p>}
        </Fragment>
    );
}
