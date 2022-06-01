import {setMyTimer} from "pages/components/ui/MyTimer/MyTimer";
import * as Waiter from "pages/ingame/Center/ActionBoards/Boards/Waiter/Waiter";
import * as Solver from "pages/ingame/Center/ActionBoards/Boards/Solver/Solver";
import WaitingPanel from "pages/ingame/Center/ActionBoards/Boards/Waiter/WaitingPanel";
import {useContext, useEffect} from "react";
import LocalContext, {
    LocalField,
} from "system/context/localInfo/local-context";
import RoomContext from "system/context/room-context";
import {WaitTime} from "system/GameConstants";
import {BoardState} from "system/GameStates/States";
import {TurnManager} from "system/GameStates/TurnManager";

export default function WaitingBoard(): JSX.Element {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const [myId, localPlayer] = TurnManager.getMyInfo(ctx, localCtx);

    useEffect(() => {
        //TODO load context live?
        if (ctx.room.game.action.pierId === myId) {
            setMyTimer(localCtx, WaitTime.WaitReactions, () => {
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
        }
    }, []);
    return <WaitingPanel/>;
}
