import {Fragment, useContext} from "react";
import RoomContext from "system/context/roomInfo/room-context";
import LocalContext from "system/context/localInfo/local-context";
import {TurnManager} from "system/GameStates/TurnManager";
import {Card, CardRole} from "system/cards/Card";
import {DeckManager} from "system/cards/DeckManager";
import {KillInfo, Player} from "system/GameStates/GameTypes";
import classes from "pages/ingame/Center/ActionBoards/Boards/BaseBoard.module.css";
import BaseActionButton from "pages/ingame/Center/ActionBoards/Boards/ActionButtons/BaseActionButton";
import {handlePlayerKill} from "pages/ingame/Center/ActionBoards/Boards/Discard/DiscardSolver";

export function MyCardsPanel(): JSX.Element {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const deck = ctx.room.game.deck;
    const [myId, localPlayer] = TurnManager.getMyInfo(ctx, localCtx);
    const myCards: CardRole[] = DeckManager.peekCards(deck, localPlayer.icard, 2);
    
    return (<Fragment>
        <div className={classes.header}>Choose 2 cards that you want to keep...</div>
        <div className={classes.container}>
            {myCards.map((role: CardRole, index: number) => {
                const baseIndex = index + 1;
                const cssName = classes[`cell${baseIndex}`];
                return (
                    <BaseActionButton
                        key={index}
                        className={`${cssName} `}
                        param={new Card(role)}
                        onClickButton={() => {
                            handlePlayerKill(ctx, localPlayer.icard + index);
                        }}
                    />
                );
            })}
        </div>
    </Fragment>);
}


export function PostKillPanel(): JSX.Element {
    const ctx = useContext(RoomContext);
    const info = ctx.room.game.action.param as KillInfo;
    const player = ctx.room.playerMap.get(info.ownerId)!;
    const cardRole = ctx.room.game.deck[info.removed];
    const isDead = DeckManager.playerIsDead(ctx.room.game.deck, info.ownerId);
    return (
        <Fragment>
            <p>{`${player.name} discarded ${cardRole}`}</p>
            {isDead && <p>{`${player.name} is removed from game!`}</p>}
        </Fragment>);
}

export function createWaitingBoard(targetPlayer: Player) {
    return (<p>{`Waiting for ${targetPlayer.name} to remove card.`}</p>);
}
