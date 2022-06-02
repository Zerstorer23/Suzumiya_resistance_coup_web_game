import {ChallengeState, GameAction, KillInfo} from "system/GameStates/GameTypes";
import {WaitTime} from "system/GameConstants";
import {BoardState} from "system/GameStates/States";

function inferChallengeTime(action: GameAction): WaitTime {
    const challInfo = action.param as KillInfo;
    switch (challInfo.nextState) {
        case ChallengeState.Notify:
            return WaitTime.WaitConfirms;
        case ChallengeState.Reveal:
            return WaitTime.MakingDecision;
        default:
            return WaitTime.WaitConfirms;
    }
}

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
            return inferChallengeTime(action);
        case BoardState.ChoosingBaseAction:
        case BoardState.CalledCoup:
        case BoardState.AmbassadorAccepted:
        case BoardState.StealChallenged:
        case BoardState.StealBlocked:
        case BoardState.CalledGetTwoBlocked:
        case BoardState.CalledAssassinate:
        case BoardState.AssassinBlocked:
            return WaitTime.MakingDecision;
        case BoardState.CalledGetTwo:
        case BoardState.CalledGetThree:
        case BoardState.CalledChangeCards:
        case BoardState.CalledSteal:
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