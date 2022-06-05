import BaseActionButton from "pages/ingame/Center/ActionBoards/Boards/ActionButtons/BaseActionButton";
import classes from "pages/ingame/Center/ActionBoards/Boards/BaseBoard.module.css";
import {useContext, useEffect} from "react";
import LocalContext from "system/context/localInfo/local-context";
import RoomContext from "system/context/roomInfo/room-context";
import {ActionInfo} from "system/GameStates/ActionInfo";
import {ActionType, BoardState} from "system/GameStates/States";
import * as ActionManager from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {TransitionAction} from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {DS} from "system/Debugger/DS";
import {playerClaimedRole} from "system/Database/RoomDatabase";
import {TurnManager} from "system/GameStates/TurnManager";
import {keyCodeToIndex} from "pages/ingame/Center/ActionBoards/Boards/BaseBoard";

const actions = [ActionType.None, ActionType.DukeBlocksForeignAid];
export default function ReactForeignAidBoard(): JSX.Element {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const [myId, myPlayer] = TurnManager.getMyInfo(ctx, localCtx);

    useEffect(() => {
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, []);

    function onKeyDown(event: any) {
        const idx = keyCodeToIndex(event.keyCode, actions.length - 1);
        if (idx < 0) return;
        onMakeAction(actions[idx]);
    }


    function onMakeAction(action: ActionType) {
        if (action !== ActionType.DukeBlocksForeignAid) return;
        //Only interested in when it is blocked
        ActionManager.prepareAndPushState(ctx, (newAction, newState) => {
            //Target == the one who blocks
            newAction.targetId = myId;
            newState.board = BoardState.CalledGetTwoBlocked;
            playerClaimedRole(myId, myPlayer, action);
            DS.logTransition("Block aid");
            DS.logTransition(newAction);
            return TransitionAction.Success;
        });
    }

    return (
        <div className={classes.container}>
            {actions.map((action: ActionType, index: number) => {
                return (
                    <BaseActionButton
                        key={index}
                        index={index}
                        param={new ActionInfo(action)}
                        onClickButton={() => {
                            onMakeAction(action);
                        }}
                    />
                );
            })}
        </div>
    );
}
