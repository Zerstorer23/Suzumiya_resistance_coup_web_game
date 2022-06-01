import AmbassadorBoard from "pages/ingame/Center/ActionBoards/Boards/AmbassadorBoard";
import BaseBoard from "pages/ingame/Center/ActionBoards/Boards/BaseBoard";
import CounterBoard from "pages/ingame/Center/ActionBoards/Boards/CounterBoard";
import SolverBoard from "pages/ingame/Center/ActionBoards/Boards/Solver/SolverBoard";
import WaitingBoard from "pages/ingame/Center/ActionBoards/Boards/Waiter/WaitingBoard";
import {Game} from "system/GameStates/GameTypes";
import {BoardState, StateManager} from "system/GameStates/States";
import DiscardCardPanel from "pages/ingame/Center/ActionBoards/Boards/Solver/DiscardCardPanel";
import ReactAssassinBoard from "pages/ingame/Center/ActionBoards/Boards/ReactAssassinBoard";
import ReactCaptainBoard from "pages/ingame/Center/ActionBoards/Boards/ReactCaptainBoard";
import {TurnManager} from "system/GameStates/TurnManager";
import {LocalContextType} from "system/context/localInfo/local-context";
import {RoomContextType} from "system/context/roomInfo/room-context";
import ReactForeignAidBoard from "pages/ingame/Center/ActionBoards/Boards/ReactForeignAidBoard";

export function getBoardElemFromRoom(ctx: RoomContextType, localCtx: LocalContextType): JSX.Element {
    const [myId, localPlayer] = TurnManager.getMyInfo(ctx, localCtx);
    const isMyTurn: boolean = TurnManager.isMyTurn(ctx, localCtx);
    const board = ctx.room.game.state.board;
    const amTargeted: boolean = ctx.room.game.action.targetId === myId;
    if (StateManager.isFinal(board)) {
        return <SolverBoard/>;
    } else if (isMyTurn) {
        return handleMyTurn(board);
    } else if (amTargeted) {
        return handleTargeted(board);
    } else {
        return handleNotMyTurn(board, ctx.room.game);
    }
}

function handleMyTurn(boardState: BoardState): JSX.Element {

    switch (boardState) {
        case BoardState.ChoosingBaseAction:
            return <BaseBoard/>;
        case BoardState.CalledGetTwoBlocked:
        case BoardState.StealBlocked:
        case BoardState.AssassinBlocked:
            return <CounterBoard/>;
        case BoardState.AmbassadorAccepted:
            return <AmbassadorBoard/>;
        default:
            return <WaitingBoard/>;
    }

}

function handleNotMyTurn(board: BoardState, game: Game): JSX.Element {
    const hasChallenger: boolean = game.action.challengerId.length > 0;
    if (board === BoardState.CalledGetTwo) return <ReactForeignAidBoard/>;
    if (!hasChallenger && StateManager.isCounterable(board)) return <CounterBoard/>;
    return <WaitingBoard/>;

}

function handleTargeted(boardState: BoardState): JSX.Element {
    switch (boardState) {
        case BoardState.CalledCoup:
            return <DiscardCardPanel/>;
        case BoardState.CalledAssassinate:
            return <ReactAssassinBoard/>;
        case BoardState.CalledSteal:
            return <ReactCaptainBoard/>;
        case BoardState.CalledGetTwoBlocked:
            return <WaitingBoard/>;
        default:
            return <WaitingBoard/>;
    }

}
