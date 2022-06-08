import {ChallengeState, GameAction, KillInfo, Player, TurnState,} from "system/GameStates/GameTypes";
import {GameManager} from "system/GameStates/GameManager";
import {DbReferences, playerClaimedRole, ReferenceManager} from "system/Database/RoomDatabase";
import {ActionType, BoardState, StateManager} from "system/GameStates/States";
import {TurnManager} from "system/GameStates/TurnManager";
import {CardRole} from "system/cards/Card";
import {DS} from "system/Debugger/DS";
import {RoomContextType} from "system/context/roomInfo/RoomContextProvider";
import {ChatFormat, sendChat} from "pages/components/ui/ChatModule/chatInfo/ChatContextProvider";


export enum TransitionAction {
    Success,
    Abort,
    EndTurn,
}

/**
 * Do something and END
 * DO chanes in CHanger.
 * Return results TransitionAction
 */
export function prepareAndPushState(
    ctx: RoomContextType,
    changer: (newAction: GameAction, newState: TurnState) => TransitionAction
) {
    const [newAction, newState] = prepareActionState(ctx);
    const result = changer(newAction, newState);
    if (result === TransitionAction.Abort) {
        console.trace("Aborted state");
        return;
    }
    DS.logTransition("Next state " + newState.board);
    if (result === TransitionAction.EndTurn) {
        const res = setEndTurn(ctx, newAction, newState);
        if (!res) return;

        const nextPlayer = ctx.room.playerMap.get(ctx.room.playerList[newState.turn]);
        if (nextPlayer !== undefined) {
            sendChat(ChatFormat.announcement, "", `${nextPlayer.name}님의 턴`);
        }
    }
    pushActionState(newAction, newState);
}


function setEndTurn(ctx: RoomContextType, newAction: GameAction, newState: TurnState): boolean {
    DS.logTransition(`END TURN prev state = ${newState.board} / t ${newState.turn}`);
    if (newState.board === BoardState.ChoosingBaseAction) {
        console.trace("Cant end turn at state 0");
        return false;
    }
    newState.board = BoardState.ChoosingBaseAction;
    newState.turn = TurnManager.getNextTurn(
        ctx.room.playerMap,
        ctx.room.playerList,
        newState.turn
    );
    resetAction(newAction, ctx.room.playerList[newState.turn]);
    DS.logTransition(`next turn state = ${newState.board} / t ${newState.turn} / ${newAction.pierId}`);
    return true;
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

export function handleAcceptOrLie(
    ctx: RoomContextType,
    action: ActionType,
    myId: string
): boolean {
    if (action === ActionType.IsALie) {
        pushIsALieState(ctx, myId);
        return true;
    }
    if (action === ActionType.Accept) {
        pushAcceptedState(ctx);
        return true;
    }
    return false;
}

export function pushIsALieState(ctx: RoomContextType, challengerId: string) {
    prepareAndPushState(ctx, (newAction, newState) => {
        const board = StateManager.getChallengedState(ctx.room.game.state.board);
        if (board === null) return TransitionAction.Abort;
        newState.board = board;
        newAction.challengerId = challengerId;
        const susCard = inferLieCard(ctx.room.game.state.board, newAction);
        if (susCard === CardRole.None) return TransitionAction.Abort;
        //We dont know who target is yet.
        const killInfo = GameManager.createKillInfo(ActionType.IsALie, "");
        killInfo.card = susCard;
        killInfo.nextState = ChallengeState.Notify;
        newAction.param = killInfo;
        DS.logTransition("Move to challenged state " + board);
        DS.logTransition(newAction);
        return TransitionAction.Success;
    });
}

function inferLieCard(board: BoardState, action: GameAction): CardRole {
    switch (board) {
        case BoardState.CalledGetTwoBlocked:
        case BoardState.CalledGetThree:
            return CardRole.Duke;
        case BoardState.CalledChangeCards:
            return CardRole.Ambassador;
        case BoardState.CalledSteal:
            return CardRole.Captain;
        case BoardState.CalledAssassinate:
            return CardRole.Assassin;
        case BoardState.AssassinBlocked:
            return CardRole.Contessa;
        case BoardState.StealBlocked:
            return action.param as CardRole;
    }
    return CardRole.None;
}

/**
 * Only use for ACTUAL ACCEPTED state
 * @param ctx
 */

export function pushAcceptedState(ctx: RoomContextType) {
    prepareAndPushState(ctx, (newAction, newState) => {
        const board = StateManager.getAcceptedState(ctx.room.game.state.board);
        if (board === null) return TransitionAction.Abort;
        newState.board = board;
        DS.logTransition("Move to Accepted " + board);
        return TransitionAction.Success;
    });
}

export function pushCalledState(
    ctx: RoomContextType,
    action: ActionType,
    myId: string,
    myPlayer: Player,
    targetId = ""
) {
    prepareAndPushState(ctx, (newAction, newState) => {
        const newBoard = StateManager.getCalledState(action);
        if (newBoard === null) return TransitionAction.Abort;
        playerClaimedRole(myId, myPlayer, action);
        newState.board = newBoard;
        newAction.pierId = myId;
        newAction.targetId = targetId;
        console.log("New state = ", newState);
        if (newBoard === BoardState.CalledCoup) {
            newAction.param = GameManager.createKillInfo(ActionType.Coup, targetId);
            payCost(ctx, newAction);
        }

        return TransitionAction.Success;
    });
}

function payCost(ctx: RoomContextType, newAction: GameAction) {
    const killInfo = newAction.param as KillInfo;
    let cost = 0;
    if (killInfo.cause === ActionType.Coup) {
        cost = 7;
    } else if (killInfo.cause === ActionType.Assassinate) {
        cost = 3;
    }
    if (cost > 0) {
        const player = ctx.room.playerMap.get(newAction.pierId);
        if (player === undefined) return;
        player.coins -= cost;
        ReferenceManager.updatePlayerReference(newAction.pierId, player);
    }
}

export function pushPrepareDiscarding(
    ctx: RoomContextType,
    killInfo: KillInfo,
) {
    prepareAndPushState(ctx, (newAction, newState) => {
        newState.board = BoardState.DiscardingCard;
        newAction.param = killInfo;
        payCost(ctx, newAction);
        return TransitionAction.Success;
    });
}

function resetAction(newAction: GameAction, newPier: string) {
    newAction.param = "";
    newAction.pierId = newPier;
    newAction.challengerId = "";
    newAction.targetId = "";
}

export function pushEndGame(ctx: RoomContextType, winnerId: string) {
    const [newAction, newState] = prepareActionState(ctx);
    resetAction(newAction, winnerId);
    newState.board = BoardState.ChoosingBaseAction;
    newState.turn = -2;
    pushActionState(newAction, newState);
}
