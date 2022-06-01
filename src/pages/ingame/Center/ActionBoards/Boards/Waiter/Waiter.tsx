import {LocalContextType} from "system/context/localInfo/local-context";
import {RoomContextType} from "system/context/room-context";
import {ReferenceManager} from "system/Database/RoomDatabase";
import {PlayerType, TurnManager} from "system/GameStates/TurnManager";
import * as ActionManager from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {TransitionAction} from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";

/*
Get 2 : ?GetTwo-> [CalledGetTwo: Wait] 
                  Unchanged-> Solve NextTurn
                  /Duke-> [DukeBlocks: Wait]
                          ?Accept->[DukeBlocksAccepted:Solve Wait NextTurn]
                          ?Lie->   [DukeBlocksChallenged: Solve Wait NextTurn]
*/

export function handleGetTwo(ctx: RoomContextType) {
    const [pierId, pier] = TurnManager.getPlayerInfo(ctx, PlayerType.Pier);
    ActionManager.prepareAndPushState(ctx, (newAction, newState) => {
        pier.coins += 2;
        ReferenceManager.updatePlayerReference(pierId, pier);
        return TransitionAction.EndTurn;
    });
}

export function handleGetThree(
    ctx: RoomContextType,
    localCtx: LocalContextType
) {
    const [pierId, pier] = TurnManager.getPlayerInfo(ctx, PlayerType.Pier);
    ActionManager.prepareAndPushState(ctx, (newAction, newState) => {
        pier.coins += 3;
        ReferenceManager.updatePlayerReference(pierId, pier);
        return TransitionAction.EndTurn;
    });
}

/**
 * max +2
 * add to pier
 * take from target
 */
export function handleSteal(ctx: RoomContextType, localCtx: LocalContextType) {
    const [pierId, pier] = TurnManager.getPlayerInfo(ctx, PlayerType.Pier);
    const [targetId, target] = TurnManager.getPlayerInfo(ctx, PlayerType.Target);
    ActionManager.prepareAndPushState(ctx, (newAction, newState) => {
        const stealAmount = Math.min(target.coins, 2);
        pier.coins += stealAmount;
        target.coins -= stealAmount;
        ReferenceManager.updatePlayerReference(pierId, pier);
        ReferenceManager.updatePlayerReference(targetId, target);
        return TransitionAction.EndTurn;
    });
}

/**
 * Move to Accepted State
 * @param ctx
 */
export function handleAmbassador(ctx: RoomContextType) {
    ActionManager.pushAcceptedState(ctx);
}

/**
 *Move to Accepted State
 * @param ctx
 */
export function handleAssassinate(
    ctx: RoomContextType
) {
    ActionManager.pushAcceptedState(ctx);
}

/**
 *Move to Accepted State
 * @param ctx
 */
export function handleContessa(
    ctx: RoomContextType
) {
    ActionManager.pushAcceptedState(ctx);
}

export function acceptState(
    ctx: RoomContextType
) {
    ActionManager.pushAcceptedState(ctx);
}