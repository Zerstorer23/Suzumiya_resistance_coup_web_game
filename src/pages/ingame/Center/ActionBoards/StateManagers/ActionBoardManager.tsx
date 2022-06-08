import BaseBoard from "pages/ingame/Center/ActionBoards/Boards/BaseBoard";
import CounterBoard from "pages/ingame/Center/ActionBoards/Boards/CounterBoard";
import SolverBoard from "pages/ingame/Center/ActionBoards/Boards/Solver/SolverBoard";
import WaitingBoard from "pages/ingame/Center/ActionBoards/Boards/Waiter/WaitingBoard";
import {Game, KillInfo} from "system/GameStates/GameTypes";
import {BoardState, StateManager} from "system/GameStates/States";
import DiscardBoard from "pages/ingame/Center/ActionBoards/Boards/Discard/DiscardBoard";
import ReactAssassinBoard from "pages/ingame/Center/ActionBoards/Boards/ReactAssassinBoard";
import ReactCaptainBoard from "pages/ingame/Center/ActionBoards/Boards/ReactCaptainBoard";
import {TurnManager} from "system/GameStates/TurnManager";
import {LocalContextType} from "system/context/localInfo/local-context";
import ReactForeignAidBoard from "pages/ingame/Center/ActionBoards/Boards/ReactForeignAidBoard";
import {RoomContextType} from "system/context/roomInfo/RoomContextProvider";
import {Fragment} from "react";
import AmbassadorBoard2 from "pages/ingame/Center/ActionBoards/Boards/AmbassadorBoard2";

export function getBoardElemFromRoom(ctx: RoomContextType, localCtx: LocalContextType): JSX.Element {
    const [myId, myPlayer] = TurnManager.getMyInfo(ctx, localCtx);
    if (myPlayer.isSpectating) return <WaitingBoard/>;

    const isMyTurn: boolean = TurnManager.isMyTurn(ctx, localCtx);
    // console.log(`turn : ${ctx.room.game.state.turn} / myId = ${myId} / ct ${ctx.room.playerList[ctx.room.game.state.turn]} / myturn? ${isMyTurn}`);
    const board = ctx.room.game.state.board;
    if (board === BoardState.DiscardingCard) return handleDiscarding(ctx, myId);
    const amTargeted: boolean = ctx.room.game.action.targetId === myId;
    if (isMyTurn) {
        return handleMyTurn(board);
    } else if (amTargeted) {
        return handleTargeted(board);
    } else {
        return handleNotMyTurn(board, ctx.room.game);
    }
}

function handleMyTurn(boardState: BoardState): JSX.Element {
    if (StateManager.isFinal(boardState)) {
        return <SolverBoard/>;
    }
    if (StateManager.pierIsBlocked(boardState)) {
        return <CounterBoard/>;
    }
    switch (boardState) {
        case BoardState.ChoosingBaseAction:
            return <BaseBoard/>;
        case BoardState.AmbassadorAccepted:
            return <AmbassadorBoard2/>;
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
            return <DiscardBoard/>;
        case BoardState.CalledAssassinate:
            return <ReactAssassinBoard/>;
        case BoardState.CalledSteal:
            return <ReactCaptainBoard/>;
        case BoardState.CalledGetTwoBlocked:
        default:
            return <WaitingBoard/>;
    }
}

function handleDiscarding(ctx: RoomContextType, myId: string): JSX.Element {
    const killInfo = ctx.room.game.action.param as KillInfo;
    if (killInfo.ownerId === undefined) return <Fragment/>;
    if (killInfo.ownerId === myId) return <DiscardBoard/>;
    return <WaitingBoard/>;
}
