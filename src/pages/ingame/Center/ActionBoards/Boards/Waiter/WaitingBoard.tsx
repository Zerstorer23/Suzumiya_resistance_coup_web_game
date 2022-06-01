import {setMyTimer} from "pages/components/ui/MyTimer/MyTimer";
import * as Waiter from "pages/ingame/Center/ActionBoards/Boards/Waiter/Waiter";
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
    const myId: string = localCtx.getVal(LocalField.Id)!;
    const playerList: string[] = localCtx.getVal(LocalField.SortedList);
    const currentTurn = ctx.room.game.state.turn;
    const currentTurnId = playerList[currentTurn];

    useEffect(() => {
        const board = ctx.room.game.state.board;
        const [pier, target, challenger] = TurnManager.getShareholders(ctx);
        const [myId, localPlayer] = TurnManager.getMyInfo(ctx, localCtx);
        //TODO load context live?
        if (ctx.room.game.action.pierId === myId) {
            setMyTimer(localCtx, WaitTime.WaitReactions, () => {
                switch (ctx.room.game.state.board) {
                    case BoardState.CalledGetTwo:
                        Waiter.handleGetTwo(ctx, localCtx);
                        break;
                    case BoardState.CalledGetThree:
                        Waiter.handleGetThree(ctx, localCtx);
                        break;
                    case BoardState.CalledSteal:
                        Waiter.handleSteal(ctx, localCtx);
                        break;
                    case BoardState.CalledChangeCards:
                        Waiter.handleAmbassador(ctx, myId);
                        break;
                    case BoardState.CalledAssassinate:
                        Waiter.handleAssassinate(ctx, myId);
                        break;
                    case BoardState.AssassinBlocked:
                        Waiter.handleContessa(ctx, localCtx);
                        break;
                    default:
                        console.warn("Wtf are we waiting?");
                        break;
                }
            });
        } else {
        }
    }, []);
    return <WaitingPanel/>;
}
