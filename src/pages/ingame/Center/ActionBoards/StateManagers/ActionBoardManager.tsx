import BaseBoard from "pages/ingame/Center/ActionBoards/Boards/BaseBoard/BaseBoard";
import CounterBoard from "pages/ingame/Center/ActionBoards/Boards/CounterBoard";
import SolverBoard from "pages/ingame/Center/ActionBoards/Boards/Solver/SolverBoard";
import WaitingBoard from "pages/ingame/Center/ActionBoards/Boards/Waiter/WaitingBoard";
import {Game, GameAction, KillInfo} from "system/GameStates/GameTypes";
import {BoardState, StateManager} from "system/GameStates/States";
import DiscardBoard from "pages/ingame/Center/ActionBoards/Boards/Discard/DiscardBoard";
import ReactAssassinBoard from "pages/ingame/Center/ActionBoards/Boards/ReactAssassinBoard";
import ReactCaptainBoard from "pages/ingame/Center/ActionBoards/Boards/ReactCaptainBoard";
import {TurnManager} from "system/GameStates/TurnManager";
import {LocalContextType} from "system/context/localInfo/local-context";
import ReactForeignAidBoard from "pages/ingame/Center/ActionBoards/Boards/ReactForeignAidBoard";
import {RoomContextType} from "system/context/roomInfo/RoomContextProvider";
import {Fragment} from "react";
import AmbassadorBoard from "pages/ingame/Center/ActionBoards/Boards/AmbassadorBoard";
import {GameManager} from "system/GameStates/GameManager";

export function getBoardElemFromRoom(ctx: RoomContextType, localCtx: LocalContextType): JSX.Element {
    const myEntry = TurnManager.getMyInfo(ctx, localCtx);
    if (myEntry.player.isSpectating) return <WaitingBoard/>;
    const room = GameManager.parseRoom(ctx);
    const isMyTurn: boolean = TurnManager.isMyTurn(ctx, localCtx);
    if (room.board === BoardState.DiscardingCard) return handleDiscarding(ctx, myEntry.id);
    const amTargeted: boolean = room.action.targetId === myEntry.id;
    if (isMyTurn) {
        return handleMyTurn(room.board, room.action, myEntry.id);
    } else if (amTargeted) {
        return handleTargeted(room.board);
    } else {
        return handleNotMyTurn(room.board, room.game);
    }
}

function handleMyTurn(boardState: BoardState, action: GameAction, myId: string): JSX.Element {
    if (StateManager.isFinal(boardState)) {
        return <SolverBoard/>;
    }
    if (StateManager.pierIsBlocked(boardState)) {
        return <CounterBoard canAccept={true}/>;
    }
    switch (boardState) {
        case BoardState.CalledCoup:
            if (action.targetId === myId) {
                return <DiscardBoard/>;
            } else {
                return <WaitingBoard/>;
            }
        case BoardState.ChoosingBaseAction:
            return <BaseBoard/>;
        case BoardState.AmbassadorAccepted:
            return <AmbassadorBoard/>;
        default:
            return <WaitingBoard/>;
    }
}

function handleNotMyTurn(board: BoardState, game: Game): JSX.Element {
    const hasChallenger: boolean = game.action.challengerId.length > 0;
    if (board === BoardState.CalledGetTwo) return <ReactForeignAidBoard/>;
    if (!hasChallenger && StateManager.isCounterable(board)) return <CounterBoard canAccept={false}/>;
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
        case BoardState.CalledInquisition:
            return <CounterBoard canAccept={true}/>;
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
