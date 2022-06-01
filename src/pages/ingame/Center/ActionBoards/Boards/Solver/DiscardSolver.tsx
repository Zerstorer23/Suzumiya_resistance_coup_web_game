import {RoomContextType} from "system/context/roomInfo/room-context";
import {LocalContextType} from "system/context/localInfo/local-context";
import {setMyTimer} from "pages/components/ui/MyTimer/MyTimer";
import {WaitTime} from "system/GameConstants";
import * as ActionManager from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {TransitionAction} from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {RemovedCard} from "system/GameStates/GameTypes";
import {DeckManager} from "system/cards/DeckManager";
import {DbReferences, ReferenceManager} from "system/Database/RoomDatabase";
import {Fragment} from "react";
import {BoardState} from "system/GameStates/States";
import {TurnManager} from "system/GameStates/TurnManager";

export function solveDiscard(ctx: RoomContextType, localCtx: LocalContextType): JSX.Element | null {
    const board = ctx.room.game.state.board;
    const action = ctx.room.game.action;
    const [myId, myPlayer] = TurnManager.getMyInfo(ctx, localCtx);

    function createWaitingBoard(id: string) {
        const rp = ctx.room.playerMap.get(id)!;
        return (<p>{`Waiting for ${rp.name} to remove card.`}</p>);
    }

    // if (board !== BoardState.DiscardingCard) return;
    switch (board) {
        case BoardState.CalledCoup:
            if (action.targetId === myId) {
                return null;
            } else {
                return createWaitingBoard(action.targetId);
            }
        //Assassination
        case BoardState.DiscardingCard:
            break;
        default:
            //Challenges
            break;
    }
    const removed = ctx.room.game.action.param as RemovedCard;
    if (removed.idx < 0) {
        if (removed.playerId !== myId) {
        }
    } else {
        // setJSX(<PostKillPanel info={removed}/>);
    }

    return <Fragment/>;
}

/**
 *        case BoardState.CoupAccepted:
 *         case BoardState.AssissinateAccepted:
 *         param is RemovedCard type
 */
function handlePlayerKill(ctx: RoomContextType, localCtx: LocalContextType) {
    //Mark the card in param dead
    setMyTimer(localCtx, WaitTime.WaitConfirms, () => {
        ActionManager.prepareAndPushState(ctx, (newAction, newState) => {
            const removedInfo = ctx.room.game.action.param as RemovedCard;
            const deck = ctx.room.game.deck;
            DeckManager.killCardAt(deck, removedInfo.idx);
            ReferenceManager.updateReference(DbReferences.GAME_deck, deck);
            return TransitionAction.EndTurn;
        });
    });
}