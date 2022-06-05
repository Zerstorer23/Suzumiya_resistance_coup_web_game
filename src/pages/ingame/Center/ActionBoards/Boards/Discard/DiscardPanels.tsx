import {Fragment, useContext} from "react";
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
import useShortcut from "system/hooks/useShortcut";

const MAX_PCARD = 2;

export function MyCardsPanel(): JSX.Element {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const deck = ctx.room.game.deck;
    const [myId, localPlayer] = TurnManager.getMyInfo(ctx, localCtx);
    const myCards: CardRole[] = DeckManager.peekCards(deck, localPlayer.icard, MAX_PCARD);
    useShortcut(MAX_PCARD, (n) => {
        onMakeAction(n);
    });

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
