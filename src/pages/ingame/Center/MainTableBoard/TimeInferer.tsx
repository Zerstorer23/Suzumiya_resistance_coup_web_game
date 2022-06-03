import {GameAction, KillInfo} from "system/GameStates/GameTypes";
import {WaitTime} from "system/GameConstants";
import {BoardState} from "system/GameStates/States";

/*function inferChallengeTime(action: GameAction): WaitTime {
    const challInfo = action.param as KillInfo;
    switch (challInfo.nextState) {
        case ChallengeState.Notify:
            return WaitTime.WaitConfirms;
        default:
            return WaitTime.WaitConfirms;
    }
}*/

function inferDiscardingTime(action: GameAction) {
    const killInfo = action.param as KillInfo;
    if (killInfo.removed < 0) return WaitTime.MakingDecision;
    return WaitTime.WaitConfirms;
}

export function inferWaitTime(board: BoardState, action: GameAction): number {
    switch (board) {
        case BoardState.DiscardingCard:
            return inferDiscardingTime(action);
        case BoardState.AmbassadorChallenged:
        case BoardState.DukeBlocksChallenged:
        case BoardState.GetThreeChallenged:
        case BoardState.StealBlockChallenged:
        case BoardState.AssassinateChallenged:
            return WaitTime.WaitConfirms;
        case BoardState.ChoosingBaseAction:
        case BoardState.CalledCoup:
        case BoardState.AmbassadorAccepted:
        case BoardState.StealChallenged:
        case BoardState.StealBlocked:
        case BoardState.CalledGetTwoBlocked:
        case BoardState.CalledAssassinate:
        case BoardState.AssassinBlocked:
        case BoardState.CalledSteal:
            return WaitTime.MakingDecision;
        case BoardState.CalledGetTwo:
        case BoardState.CalledGetThree:
        case BoardState.CalledChangeCards:
            return WaitTime.WaitReactions;
        case BoardState.GetOneAccepted:
        case BoardState.DukeBlocksAccepted:
        case BoardState.StealAccepted:
        case BoardState.StealBlockAccepted:
        case BoardState.ContessaChallenged:
        case BoardState.ContessaAccepted:
        case BoardState.ForeignAidAccepted:
        case BoardState.GetThreeAccepted:
            return WaitTime.WaitConfirms;
    }
}