import BaseActionButton from "pages/ingame/Center/ActionBoards/Boards/ActionButtons/BaseActionButton";
import classes from "pages/ingame/Center/ActionBoards/Boards/BaseBoard.module.css";
import {useContext} from "react";
import LocalContext, {LocalField,} from "system/context/localInfo/local-context";
import RoomContext from "system/context/roomInfo/room-context";
import {ActionInfo} from "system/GameStates/ActionInfo";
import {ActionType, BoardState} from "system/GameStates/States";
import * as ActionManager from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {TransitionAction} from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {DS} from "system/Debugger/DS";

const actions = [ActionType.None, ActionType.DukeBlocksForeignAid];
export default function ReactForeignAidBoard(): JSX.Element {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const myId = localCtx.getVal(LocalField.Id);
    console.log("Loaded React foreign aid " + ctx.room.game.state.board);

    function onMakeAction(action: ActionType) {
        if (action !== ActionType.DukeBlocksForeignAid) return;
        //Only interested in when it is blocked
        ActionManager.prepareAndPushState(ctx, (newAction, newState) => {
            //Target == the one who blocks
            newAction.targetId = myId;
            newState.board = BoardState.CalledGetTwoBlocked;
            DS.logTransition("Block aid");
            DS.logTransition(newAction);
            return TransitionAction.Success;
        });
    }

    return (
        <div className={classes.container}>
            {actions.map((action: ActionType, index: number) => {
                const baseIndex = index + 1;
                const cssName = classes[`cell${baseIndex}`];
                return (
                    <BaseActionButton
                        key={index}
                        className={`${cssName}`}
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
