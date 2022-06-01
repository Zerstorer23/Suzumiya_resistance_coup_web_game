import {RoomContextType} from "system/context/room-context";
import {GameAction, TurnState} from "system/GameStates/GameTypes";
import {GameManager} from "system/GameStates/GameManager";
import {DbReferences, ReferenceManager} from "system/Database/RoomDatabase";
import {ActionType, BoardState, StateManager} from "system/GameStates/States";
import {TurnManager} from "system/GameStates/TurnManager";

/**
 *
 * @param ctx
 * @param changer : Changes state and returns if state should be applied
 */
export enum TransitionAction {
    Success,
    Abort,
    EndTurn
}

export function prepareAndPushState(ctx: RoomContextType, changer: (newAction: GameAction, newState: TurnState) => TransitionAction) {
    const [newAction, newState] = prepareActionState(ctx);
    const result = changer(newAction, newState);
    if (result === TransitionAction.Abort) return;
    if (result === TransitionAction.EndTurn) {
        setEndTurn(newState);
    }
    pushActionState(newAction, newState);
}

function setEndTurn(newState: TurnState) {
    newState.board = BoardState.ChoosingBaseAction;
    newState.turn = TurnManager.getNextTurn();
}

/**
 * Prepares varialbes for puhsing new action
 * */
function prepareActionState(ctx: RoomContextType): [GameAction, TurnState] {
    const gameAction = GameManager.copyGameAction(ctx.room.game.action);
    return [gameAction, {...ctx.room.game.state}];
}

/**
 * Call this to apply action to DB
 */
function pushActionState(gameAction: GameAction, newState: TurnState) {
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
    prepareAndPushState(ctx, (newAction, newState) => {
        const board = StateManager.getChallengedState(ctx.room.game.state.board);
        if (board === null) return TransitionAction.Abort;
        newState.board = board;
        newAction.challengerId = myId;
        return TransitionAction.Success;
    });
}


/**
 * Only use for ACTUAL ACCEPTED state
 * @param ctx
 * @param myId
 */

export function pushAcceptedState(ctx: RoomContextType, myId: string) {
    prepareAndPushState(ctx, (newAction, newState) => {
        const board = StateManager.getAcceptedState(ctx.room.game.state.board);
        if (board === null) return TransitionAction.Abort;
        newState.board = board;
        return TransitionAction.Success;
    });
}

export function pushCalledState(ctx: RoomContextType, action: ActionType, myId: string, targetId = "") {
    prepareAndPushState(ctx, (newAction, newState) => {
        const newBoard = StateManager.getCalledState(action);
        if (newBoard === null) return TransitionAction.Abort;
        newState.board = newBoard;
        newAction.pierId = myId;
        newAction.targetId = targetId;
        return TransitionAction.Success;
    });
}

