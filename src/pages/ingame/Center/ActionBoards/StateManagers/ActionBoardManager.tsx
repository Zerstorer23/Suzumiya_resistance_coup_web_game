import AmbassadorBoard from "pages/ingame/Center/ActionBoards/Boards/AmbassadorBoard";
import BaseBoard from "pages/ingame/Center/ActionBoards/Boards/BaseBoard";
import CounterBoard from "pages/ingame/Center/ActionBoards/Boards/CounterBoard";
import ForeignAidReactBoard from "pages/ingame/Center/ActionBoards/Boards/ForeignAidReactBoard";
import SolverBoard from "pages/ingame/Center/ActionBoards/Boards/Solver/SolverBoard";
import WaitingBoard from "pages/ingame/Center/ActionBoards/Boards/Waiter/WaitingBoard";
import {Game} from "system/GameStates/GameTypes";
import {BoardState, StateManager} from "system/GameStates/States";
import {Fragment} from "react";
import DiscardCardBoard from "pages/ingame/Center/ActionBoards/Boards/DiscardCardBoard";
import ReactAssassinBoard from "pages/ingame/Center/ActionBoards/Boards/ReactAssassinBoard";
import ReactCaptainBoard from "pages/ingame/Center/ActionBoards/Boards/ReactCaptainBoard";

export function getBoardElemFromRoom(
    boardState: BoardState,
    game: Game,
    currentTurnId: string,
    myId: string
): JSX.Element {
    const isMyTurn: boolean = currentTurnId === myId;
    const isTargeted: boolean = game.action.targetId === myId;
    const hasChallenger: boolean = game.action.challengerId.length > 0;
    /*    const debugstr = `Turn: ${currentTurnId} / isme?${isMyTurn} / isTarget? ${isTargeted} / state:${boardState}`;
        console.log(debugstr);*/
    if (isMyTurn) {
        return handleMyTurn(boardState);
    } else {
        return handleNotMyTurn(boardState, hasChallenger);
    }
}

function handleMyTurn(boardState: BoardState): JSX.Element {
    if (StateManager.isFinal(boardState)) {
        return <SolverBoard/>;
    } else {
        switch (boardState) {
            case BoardState.ChoosingBaseAction:
                return <BaseBoard/>;
            case BoardState.AidBlocked:
            case BoardState.StealBlocked:
            case BoardState.AssassinBlocked:
                return <CounterBoard/>;
            case BoardState.AmbassadorAccepted:
                return <AmbassadorBoard/>;
            default:
                return <WaitingBoard/>;
        }
    }
}

function handleNotMyTurn(boardState: BoardState, hasChallenger: boolean): JSX.Element {
    const [elem, handled] = handleTargettedState(boardState);
    if (handled) return elem;
    if (!hasChallenger) return <WaitingBoard/>;
    if (boardState === BoardState.CalledGetTwo) return <ForeignAidReactBoard/>;
    if (StateManager.isCounterable(boardState)) return <CounterBoard/>;
    return <WaitingBoard/>;

}

function handleTargettedState(boardState: BoardState): [JSX.Element, boolean] {
    switch (boardState) {
        case BoardState.CalledCoup:
            return [<DiscardCardBoard/>, true];
        case BoardState.CalledAssassinate:
            return [<ReactAssassinBoard/>, true];
        case BoardState.CalledSteal:
            return [<ReactCaptainBoard/>, true];
        default:
            return [<Fragment/>, false];
    }

}
