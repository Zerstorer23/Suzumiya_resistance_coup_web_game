import * as ChallengeSolver from "pages/ingame/Center/ActionBoards/Boards/Solver/ChallengeSolver";
import * as Solver from "pages/ingame/Center/ActionBoards/Boards/Solver/Solver";
import {useContext, useEffect} from "react";
import LocalContext from "system/context/localInfo/local-context";
import RoomContext from "system/context/roomInfo/room-context";
import {StateManager} from "system/GameStates/States";
import {preChallengeBoard} from "pages/ingame/Center/ActionBoards/Boards/Solver/ChallengeHelperPanels";

export default function SolverBoard(): JSX.Element {
    /**
     * Turn owner is responsible for solving boards
     * Some states that involve waiting and unchanged are solve at waiting board by owner
     * Some states that solves challenges are solved at Challenger board
     */
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    /**
     * Challenged state solver.
     * Separate because this uses param
     */
    const action = ctx.room.game.action;
    const board = ctx.room.game.state.board;

    //Challenge Handler
    useEffect(() => {
        if (!StateManager.isChallenged(board)) return;
        ChallengeSolver.solveChallenges(ctx, localCtx);
    }, [action]);


    useEffect(() => {
        if (StateManager.isChallenged(board)) return;
        Solver.solveState(ctx, localCtx);
    }, []);

    return preChallengeBoard;
}
