import * as ChallengeSolver from "pages/ingame/Center/ActionBoards/Boards/Solver/ChallengeSolver";
import * as Solver from "pages/ingame/Center/ActionBoards/Boards/Solver/Solver";
import WaitingPanel from "pages/ingame/Center/ActionBoards/Boards/Waiter/WaitingPanel";
import {useContext, useEffect, useState} from "react";
import LocalContext from "system/context/localInfo/local-context";
import RoomContext from "system/context/roomInfo/room-context";
import {BoardState, StateManager} from "system/GameStates/States";
import DiscardCardPanel from "pages/ingame/Center/ActionBoards/Boards/Solver/DiscardCardPanel";

export default function SolverBoard(): JSX.Element {
    /**
     * Turn owner is responsible for solving boards
     * Some states that involve waiting and unchanged are solve at waiting board by owner
     * Some states that solves challenges are solved at Challenger board
     */
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const [jsxElem, setJSX] = useState<JSX.Element>(<WaitingPanel/>);
    /**
     * Challenged state solver.
     * Separate because this uses param
     */
    const action = ctx.room.game.action;
    const board = ctx.room.game.state.board;

    //Challenge Handler
    useEffect(() => {
        if (!StateManager.isChallenged(board)) return;
        console.log("Solved board:");
        const elem = ChallengeSolver.solveChallenges(ctx, localCtx);
        console.log(elem);
        setJSX(elem);
    }, [action]);

    /**
     * Normal state solver
     */
    useEffect(() => {
        if (StateManager.isChallenged(board)) return;
        if (board === BoardState.DiscardingCard) {
            setJSX(<DiscardCardPanel/>);
            return;
        }
        Solver.solveState(ctx, localCtx);
    }, []);

    return jsxElem;
}
