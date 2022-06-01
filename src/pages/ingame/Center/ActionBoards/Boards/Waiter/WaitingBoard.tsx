import {setMyTimer} from "pages/components/ui/MyTimer/MyTimer";
import * as Waiter from "pages/ingame/Center/ActionBoards/Boards/Waiter/Waiter";
import * as Solver from "pages/ingame/Center/ActionBoards/Boards/Solver/Solver";
import WaitingPanel from "pages/ingame/Center/ActionBoards/Boards/Waiter/WaitingPanel";
import {useContext, useEffect} from "react";
import LocalContext from "system/context/localInfo/local-context";
import RoomContext from "system/context/roomInfo/room-context";
import {BoardState, StateManager} from "system/GameStates/States";
import {TurnManager} from "system/GameStates/TurnManager";

export default function WaitingBoard(): JSX.Element {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const board = ctx.room.game.state.board;
    useEffect(() => {
        const waitTime = StateManager.inferWaitTime(board, ctx.room.game.action);
        console.log("Wait State " + board + " time " + waitTime);
        setMyTimer(localCtx, waitTime, () => {
            const isMyTurn: boolean = TurnManager.isMyTurn(ctx, localCtx);
            if (!isMyTurn) return;
            //If it my turn, it is very likely that I will do something about it.
            switch (ctx.room.game.state.board) {
                case BoardState.CalledGetTwo:
                    Waiter.handleGetTwo(ctx);
                    break;
                case BoardState.CalledGetThree:
                    Waiter.handleGetThree(ctx);
                    break;
                case BoardState.CalledSteal:
                    Solver.handleSteal(ctx);
                    break;
                case BoardState.CalledChangeCards:
                case BoardState.CalledAssassinate:
                case BoardState.AssassinBlocked:
                    Waiter.acceptState(ctx);
                    break;
                default:
                    console.warn("Wtf are we waiting?");
                    break;
            }
        });

    }, [board]);
    return <WaitingPanel/>;
};
