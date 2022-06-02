import {setMyTimer} from "pages/components/ui/MyTimer/MyTimer";
import {LocalContextType} from "system/context/localInfo/local-context";
import {RoomContextType} from "system/context/roomInfo/room-context";
import {ReferenceManager} from "system/Database/RoomDatabase";
import {WaitTime} from "system/GameConstants";
import {BoardState} from "system/GameStates/States";
import {PlayerType, TurnManager} from "system/GameStates/TurnManager";
import * as ActionManager from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {TransitionAction} from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";

export function waitAndEnd(ctx: RoomContextType, localCtx: LocalContextType) {
    setMyTimer(localCtx, WaitTime.WaitConfirms, () => {
        ActionManager.pushJustEndTurn(ctx);
    });
}

export function solveState(ctx: RoomContextType, localCtx: LocalContextType) {
    const board = ctx.room.game.state.board;
    switch (board) {
        case BoardState.GetOneAccepted:
            handleGetOne(ctx, localCtx);
            break;
        case BoardState.ForeignAidAccepted:
            handleGetTwo(ctx);
            break;
        case BoardState.GetThreeAccepted:
            handleGetThree(ctx);
            break;
        case BoardState.StealAccepted:
            handleSteal(ctx);
            break;
        case BoardState.DiscardingCard:
            break;
        case BoardState.StealBlockAccepted:
        case BoardState.DukeBlocksAccepted:
        case BoardState.ContessaAccepted:
        default:
            waitAndEnd(ctx, localCtx);
            break;
    }
}

/*


Ambassador: ?ChangeCards->[CalledChangeCards : Wait]
                          Unchallenged->[AmbassadorAccepted: Solve Wait NextTurn]
                          /Lie->        [AmbassadorChallenged: Solve Wait NextTurn]
Assassin: ?Assassin->[CalledAssassinate: Wait]
                      /Accept-> [AssissinateAccepted :Solve Wait NextTurn]
                      /Lie->    [AssassinateChallenged:Solve Wait NextTurn]
                      /Block->  [AssassinateChallengedWithContessa : Wait]
                                        ?Lie->[ContessaChallenged:Solve Wait NextTurn]
                                        ?Accept->[ContessaAccepted:Solve Wait NextTurn]
*/

//Get 1 : ?GetOne-> [GetOneAccepted : Solve Wait NextTurn]
function handleGetOne(ctx: RoomContextType, localCtx: LocalContextType) {
    const [pierId, pier] = TurnManager.getPlayerInfo(ctx, PlayerType.Pier);
    pier.coins++;
    ReferenceManager.updatePlayerReference(pierId, pier);
    waitAndEnd(ctx, localCtx);
}

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

/**
 * Captain: ?Steal-> [CalledSteal:Wait]
 /Accept->     [StealAccepted: Solve NextTurn]
 /Lie->        [StealChallenged:Solve Wait NextTurn]
 /Block;param->[StealBlocked: Wait]
 ?Accept;param->[StealBlockedAccepted: Solve Wait NextTurn]
 ?Lie;param->[StealBlockedChallenged: Solve Wait NextTurn]
 * @param ctx
 * @param localCtx
 */
/**
 * max +2
 * add to pier
 * take from target
 */
export function handleSteal(ctx: RoomContextType) {
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
