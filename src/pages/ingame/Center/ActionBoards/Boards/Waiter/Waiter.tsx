import {LocalContextType} from "system/context/localInfo/local-context";
import {RoomContextType} from "system/context/room-context";
import {ReferenceManager} from "system/Database/RoomDatabase";
import {TurnManager} from "system/GameStates/TurnManager";
import * as ActionManager from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {TransitionAction} from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {BoardState} from "system/GameStates/States";

/*
Get 2 : ?GetTwo-> [CalledGetTwo: Wait] 
                  Unchanged-> Solve NextTurn
                  /Duke-> [DukeBlocks: Wait]
                          ?Accept->[DukeBlocksAccepted:Solve Wait NextTurn]
                          ?Lie->   [DukeBlocksChallenged: Solve Wait NextTurn]
*/

export function handleGetTwo(ctx: RoomContextType, localCtx: LocalContextType) {
    const [myId, localPlayer] = TurnManager.getMyInfo(ctx, localCtx);
    ActionManager.prepareAndPushState(ctx, (newAction, newState) => {
        localPlayer.coins += 2;
        ReferenceManager.updatePlayerReference(myId, localPlayer);
        return TransitionAction.EndTurn;
    });
}

export function handleGetThree(
    ctx: RoomContextType,
    localCtx: LocalContextType
) {
    const [myId, localPlayer] = TurnManager.getMyInfo(ctx, localCtx);
    ActionManager.prepareAndPushState(ctx, (newAction, newState) => {
        localPlayer.coins += 3;
        ReferenceManager.updatePlayerReference(myId, localPlayer);
        return TransitionAction.EndTurn;
    });
}

export function handleSteal(ctx: RoomContextType, localCtx: LocalContextType) {
}

export function handleAmbassador(ctx: RoomContextType, localCtx: LocalContextType, myId: string) {
    ActionManager.pushAcceptedState(ctx, myId);
}

export function handleAssassinate(
    ctx: RoomContextType,
    localCtx: LocalContextType
) {
}

export function handleContessa(
    ctx: RoomContextType,
    localCtx: LocalContextType
) {
}
