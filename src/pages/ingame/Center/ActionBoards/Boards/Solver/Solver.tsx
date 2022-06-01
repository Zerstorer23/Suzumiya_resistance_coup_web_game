import {setMyTimer} from "pages/components/ui/MyTimer/MyTimer";
import {LocalContextType} from "system/context/localInfo/local-context";
import {RoomContextType} from "system/context/room-context";
import {DbReferences, ReferenceManager} from "system/Database/RoomDatabase";
import {WaitTime} from "system/GameConstants";
import {GameAction, TurnState} from "system/GameStates/GameTypes";
import {ActionType, BoardState, StateManager} from "system/GameStates/States";
import {TurnManager} from "system/GameStates/TurnManager";
import {GameManager} from "system/GameStates/GameManager";

export function proceedTurn() {
    //Clear board and go to next turn
    const turnState: TurnState = TurnManager.endTurn();
    ReferenceManager.updateReference(DbReferences.GAME_state, turnState);
}


export function doNothingAndEnd(localCtx: LocalContextType) {
    setMyTimer(localCtx, WaitTime.WaitConfirms, proceedTurn);
}

export function solveState(ctx: RoomContextType, localCtx: LocalContextType) {
    const board = ctx.room.game.state.board;
    switch (board) {
        case BoardState.GetOneAccepted:
            handleGetOne(ctx, localCtx);
            break;
        case BoardState.CoupAccepted:
        case BoardState.AssissinateAccepted:
            handlePlayerKill(ctx, localCtx);
            break;
        case BoardState.StealAccepted:
            handleCaptain(ctx, localCtx);
            break;
        case BoardState.StealBlockAccepted:
        case BoardState.DukeBlocksAccepted:
        case BoardState.ContessaAccepted:
        default:
            doNothingAndEnd(localCtx);
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
    const [myId, localPlayer] = TurnManager.getMyInfo(ctx, localCtx);
    localPlayer.coins++;
    ReferenceManager.updatePlayerReference(myId, localPlayer);
    console.log("Get one triggers wait");
    setMyTimer(localCtx, WaitTime.WaitConfirms, proceedTurn);
}

/**
 *
 * @param ctx Coup  : ?Coup-> [CalledCoup: Wait]
 /Accept->[CoupAccepted :param, Solve Wait NextTurn]
 * @param localCtx
 */
function handlePlayerKill(ctx: RoomContextType, localCtx: LocalContextType) {
}

/**
 * ==Anyone can challenge
 Duke  : ?GetThree->[CalledGetThree: Wait]
 Unchanged->  Solve NextTurn
 /Lie-> [GetThreeChallenged:Solve Wait NextTurn]
 */
function handleDuke(ctx: RoomContextType, localCtx: LocalContextType) {
    const [myId, localPlayer] = TurnManager.getMyInfo(ctx, localCtx);
    localPlayer.coins++;
    ReferenceManager.updatePlayerReference(myId, localPlayer);
    console.log("Get one triggers wait");
    setMyTimer(localCtx, WaitTime.WaitConfirms, proceedTurn);
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
function handleCaptain(ctx: RoomContextType, localCtx: LocalContextType) {
}