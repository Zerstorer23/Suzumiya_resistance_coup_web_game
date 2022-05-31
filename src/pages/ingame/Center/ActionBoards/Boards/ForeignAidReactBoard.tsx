import BaseActionButton from "pages/ingame/Center/ActionBoards/Boards/ActionButtons/BaseActionButton";
import classes from "pages/ingame/Center/ActionBoards/Boards/BaseBoard.module.css";
import {useContext} from "react";
import LocalContext, {
    LocalField,
} from "system/context/localInfo/local-context";
import RoomContext from "system/context/room-context";
import {ActionInfo} from "system/GameStates/ActionInfo";
import {ActionType, BoardState, StateManager} from "system/GameStates/States";
import * as ActionManager from "pages/ingame/Center/ActionBoards/StateManagers/ActionManager";

const actions = [ActionType.Accept, ActionType.DukeBlocksForeignAid];
export default function ForeignAidReactBoard(): JSX.Element {
    //TODO change by board state
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const myId = localCtx.getVal(LocalField.Id);

    function onMakeAction(action: ActionType) {
        if (action !== ActionType.DukeBlocksForeignAid) return;
        //Only interested in when it is blocked
        const [newAction, newState] = ActionManager.prepareActionState(ctx);
        //Target == the one who blocks
        newAction.targetId = myId;
        newState.board = BoardState.AidBlocked;
        ActionManager.pushActionState(newAction, newState);
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
