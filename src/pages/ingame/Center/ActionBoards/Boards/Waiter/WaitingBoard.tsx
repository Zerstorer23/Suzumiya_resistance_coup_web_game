import {setMyTimer} from "pages/components/ui/MyTimer/MyTimer";
import WaitingPanel from "pages/ingame/Center/ActionBoards/Boards/Waiter/WaitingPanel";
import {useContext, useEffect} from "react";
import LocalContext from "system/context/localInfo/local-context";
import RoomContext from "system/context/roomInfo/room-context";
import {BoardState} from "system/GameStates/States";
import {TurnManager} from "system/GameStates/TurnManager";
import * as ActionManager from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {TransitionAction} from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {checkPostDiscarding} from "pages/ingame/Center/ActionBoards/Boards/Discard/DiscardSolver";
import {useTranslation} from "react-i18next";
import {RoomContextType} from "system/context/roomInfo/RoomContextProvider";
import {ChatFormat, sendChat} from "pages/components/ui/ChatModule/chatInfo/ChatContextProvider";

export default function WaitingBoard(): JSX.Element {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const board = ctx.room.game.state.board;
    const amHost = TurnManager.amHost(ctx, localCtx);
    const {t} = useTranslation();
    useEffect(() => {
        let timer: any = null;

        setMyTimer(ctx, localCtx, () => {
            if (amHost) {
                timer = handleAFKplayers(ctx, t);
            }
            if (!TurnManager.isMyTurn(ctx, localCtx)) return;
            //If it my turn, it is very likely that I will do something about it.
            switch (board) {
                case BoardState.CalledGetTwo:
                case BoardState.CalledGetThree:
                case BoardState.CalledChangeCards:
                    ActionManager.pushAcceptedState(ctx);
                    break;
                case BoardState.DiscardingFinished:
                    checkPostDiscarding(t, ctx);
                    break;
                default:
                    console.warn("Wtf are we waiting?");
                    break;
            }

        });
        return () => {
            if (timer !== null)
                clearTimeout(timer);
        };
    }, [board]);
    return <WaitingPanel/>;
};

function handleAFKplayers(ctx: RoomContextType, t: any): any {
    //Wait 2 more seconds and end turn
    return setTimeout(() => {
        sendChat(ChatFormat.important, "", t("_seems_afk"));
        ActionManager.prepareAndPushState(ctx, () => {
            return TransitionAction.EndTurn;
        });
    }, 2000);

}