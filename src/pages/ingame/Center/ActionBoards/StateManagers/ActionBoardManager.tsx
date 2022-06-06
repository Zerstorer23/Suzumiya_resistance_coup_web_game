import AmbassadorBoard from "pages/ingame/Center/ActionBoards/Boards/AmbassadorBoard";
import BaseBoard from "pages/ingame/Center/ActionBoards/Boards/BaseBoard";
import CounterBoard from "pages/ingame/Center/ActionBoards/Boards/CounterBoard";
import SolverBoard from "pages/ingame/Center/ActionBoards/Boards/Solver/SolverBoard";
import WaitingBoard from "pages/ingame/Center/ActionBoards/Boards/Waiter/WaitingBoard";
import {Game} from "system/GameStates/GameTypes";
import {BoardState, StateManager} from "system/GameStates/States";
import DiscardBoard from "pages/ingame/Center/ActionBoards/Boards/Discard/DiscardBoard";
import ReactAssassinBoard from "pages/ingame/Center/ActionBoards/Boards/ReactAssassinBoard";
import ReactCaptainBoard from "pages/ingame/Center/ActionBoards/Boards/ReactCaptainBoard";
import {TurnManager} from "system/GameStates/TurnManager";
import {LocalContextType} from "system/context/localInfo/local-context";
import ReactForeignAidBoard from "pages/ingame/Center/ActionBoards/Boards/ReactForeignAidBoard";
import {RoomContextType} from "system/context/roomInfo/RoomContextProvider";

export function getBoardElemFromRoom(ctx: RoomContextType, localCtx: LocalContextType): JSX.Element {
    const [myId, myPlayer] = TurnManager.getMyInfo(ctx, localCtx);
    if (myPlayer.isSpectating) {
        console.log("I am spectating");
        return <WaitingBoard/>;
    }
    const isMyTurn: boolean = TurnManager.isMyTurn(ctx, localCtx);
    // console.log(`turn : ${ctx.room.game.state.turn} / myId = ${myId} / ct ${ctx.room.playerList[ctx.room.game.state.turn]} / myturn? ${isMyTurn}`);
    const board = ctx.room.game.state.board;
    const amTargeted: boolean = ctx.room.game.action.targetId === myId;
    if (board === BoardState.DiscardingCard) return <DiscardBoard/>;
    if (isMyTurn) {
        if (StateManager.isFinal(board)) {
            return <SolverBoard/>;
        }
        return handleMyTurn(board);
    } else {
        if (amTargeted) {
            return handleTargeted(board);
        }
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
    console.log(`has challenger = ${hasChallenger} counter = ${StateManager.isCounterable(board)}`);
    if (!hasChallenger && StateManager.isCounterable(board)) return <CounterBoard/>;
    return <WaitingBoard/>;

}

function handleTargeted(boardState: BoardState): JSX.Element {
    switch (boardState) {
        case BoardState.CalledCoup:
            return <DiscardBoard/>;
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
