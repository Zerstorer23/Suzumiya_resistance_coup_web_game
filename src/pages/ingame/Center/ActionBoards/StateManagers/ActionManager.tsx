import {RoomContextType} from "system/context/room-context";
import {GameAction, TurnState} from "system/GameStates/GameTypes";
import {GameManager} from "system/GameStates/GameManager";
import {DbReferences, ReferenceManager} from "system/Database/RoomDatabase";
import {ActionType, StateManager} from "system/GameStates/States";

/***
 * HANDLE actions That does not push turn
 */

/**
 * Prepares varialbes for puhsing new action
 * */
export function prepareActionState(ctx: RoomContextType): [GameAction, TurnState] {
    const gameAction = GameManager.copyGameAction(ctx.room.game.action);
    return [gameAction, {...ctx.room.game.state}];
}

/**
 * Call this to apply action to DB
 */
export function pushActionState(gameAction: GameAction, newState: TurnState) {
    ReferenceManager.updateReference(DbReferences.GAME_action, gameAction);
    ReferenceManager.updateReference(DbReferences.GAME_state, newState);
}


export function handleAcceptOrLie(ctx: RoomContextType, action: ActionType, myId: string): boolean {
    if (action === ActionType.IsALie) {
        pushIsALieState(ctx, myId);
        return true;
    }
    if (action === ActionType.Accept) {
        pushAcceptedState(ctx, myId);
        return true;
    }
    return false;
}

export function pushIsALieState(ctx: RoomContextType, myId: string) {
    const [newAction, newState] = prepareActionState(ctx);
    const board = StateManager.getChallengedState(ctx.room.game.state.board);
    if (board === null) return;
    newState.board = board;
    newAction.challengerId = myId;
    pushActionState(newAction, newState);
}


/**
 * Only use for ACTUAL ACCEPTED state
 * @param ctx
 * @param myId
 */

export function pushAcceptedState(ctx: RoomContextType, myId: string) {
    const [newAction, newState] = prepareActionState(ctx);
    const board = StateManager.getAcceptedState(ctx.room.game.state.board);
    if (board === null) return;
    newState.board = board;
    pushActionState(newAction, newState);
}

export function pushCalledState(ctx: RoomContextType, action: ActionType, myId: string, targetId = "") {
    const [newAction, newState] = prepareActionState(ctx);
    const newBoard = StateManager.getCalledState(action);
    if (newBoard === null) return;
    newState.board = newBoard;
    newAction.pierId = myId;
    newAction.targetId = targetId;
    pushActionState(newAction, newState);
}

