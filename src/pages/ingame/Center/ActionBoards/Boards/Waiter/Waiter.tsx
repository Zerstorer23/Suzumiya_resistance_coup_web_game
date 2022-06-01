import {RoomContextType} from "system/context/roomInfo/room-context";
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
    ctx: RoomContextType
) {
    const [pierId, pier] = TurnManager.getPlayerInfo(ctx, PlayerType.Pier);
    ActionManager.prepareAndPushState(ctx, (newAction, newState) => {
        pier.coins += 3;
        ReferenceManager.updatePlayerReference(pierId, pier);
        return TransitionAction.EndTurn;
    });
}


export function acceptState(
    ctx: RoomContextType
) {
    ActionManager.pushAcceptedState(ctx);
}