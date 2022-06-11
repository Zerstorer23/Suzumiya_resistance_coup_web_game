import {WaitTime} from "system/GameConstants";
import {BoardState} from "system/GameStates/States";


export function inferWaitTime(board: BoardState): number {
    switch (board) {
        case BoardState.ChoosingBaseAction:
        case BoardState.CalledCoup:
        case BoardState.AmbassadorAccepted:
        case BoardState.StealBlocked:
        case BoardState.CalledGetTwoBlocked:
        case BoardState.CalledAssassinate:
        case BoardState.AssassinBlocked:
        case BoardState.CalledSteal:
        case BoardState.DiscardingCard:
            return WaitTime.MakingDecision;
        case BoardState.CalledGetTwo:
        case BoardState.CalledGetThree:
        case BoardState.CalledChangeCards:
        case BoardState.CalledInquisition:
            return WaitTime.WaitReactions;
        case BoardState.GetOneAccepted:
        case BoardState.DukeBlocksAccepted:
        case BoardState.StealAccepted:
        case BoardState.StealBlockAccepted:
        case BoardState.ContessaChallenged:
        case BoardState.ContessaAccepted:
        case BoardState.ForeignAidAccepted:
        case BoardState.GetThreeAccepted:
        case BoardState.DiscardingFinished:
        case BoardState.AmbassadorChallenged:
        case BoardState.DukeBlocksChallenged:
        case BoardState.GetThreeChallenged:
        case BoardState.StealBlockChallenged:
        case BoardState.AssassinateChallenged:
        case BoardState.StealChallenged:
        case BoardState.InquisitionAccepted:
        case BoardState.InquisitionChallenged:
            return WaitTime.WaitConfirms;
    }
}