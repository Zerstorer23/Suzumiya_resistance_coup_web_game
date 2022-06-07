import {setMyTimer} from "pages/components/ui/MyTimer/MyTimer";
import WaitingPanel from "pages/ingame/Center/ActionBoards/Boards/Waiter/WaitingPanel";
import {useContext, useEffect} from "react";
import LocalContext from "system/context/localInfo/local-context";
import RoomContext from "system/context/roomInfo/room-context";
import {BoardState} from "system/GameStates/States";
import {TurnManager} from "system/GameStates/TurnManager";
import * as ActionManager from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {inferWaitTime} from "pages/ingame/Center/MainTableBoard/TimeInferer";
import {DS} from "system/Debugger/DS";
import {checkGameEnd} from "pages/ingame/Center/ActionBoards/Boards/Discard/DiscardSolver";
import {useTranslation} from "react-i18next";

export default function WaitingBoard(): JSX.Element {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const board = ctx.room.game.state.board;
    const {t} = useTranslation();
    useEffect(() => {
        const waitTime = DS.infiniteWait ? 99999 : inferWaitTime(board, ctx.room.game.action);
        setMyTimer(localCtx, waitTime, () => {
            if (!TurnManager.isMyTurn(ctx, localCtx)) return;
            //If it my turn, it is very likely that I will do something about it.
            switch (board) {
                case BoardState.CalledGetTwo:
                case BoardState.CalledGetThree:
                case BoardState.CalledChangeCards:
                    ActionManager.pushAcceptedState(ctx);
                    break;
                case BoardState.DiscardingCard:
                    checkGameEnd(t, ctx);
                    break;
                default:
                    console.warn("Wtf are we waiting?");
                    break;
            }
        });

    }, [board]);
    return <WaitingPanel/>;
};
