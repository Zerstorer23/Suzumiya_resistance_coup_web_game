import BaseActionButton from "pages/ingame/Center/ActionBoards/Boards/ActionButtons/BaseActionButton";
import classes from "pages/ingame/Center/ActionBoards/Boards/BaseBoard.module.css";
import {useContext, useEffect, useState} from "react";
import LocalContext, {LocalField,} from "system/context/localInfo/local-context";
import RoomContext from "system/context/roomInfo/room-context";
import {ActionInfo} from "system/GameStates/ActionInfo";
import {ActionType, BoardState, StateManager} from "system/GameStates/States";
import * as ActionManager from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {useShortcutEffect} from "system/hooks/useShortcut";
/*
    case BoardState.CalledGetThree:
    case BoardState.CalledChangeCards:
    case BoardState.CalledSteal:
    case BoardState.CalledAssassinate:
    case BoardState.AidBlocked:
    case BoardState.StealBlocked:
    case BoardState.AssassinBlocked:

    This is a board when someone called and see if we want to challenge it or not.
    So only intersted in challenge state.
*/
const actionsAcceptable = [ActionType.Accept, ActionType.IsALie];
const actionsNonAcceptable = [ActionType.None, ActionType.IsALie];
export default function CounterBoard(): JSX.Element {

    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const myId = localCtx.getVal(LocalField.Id);
    const board = ctx.room.game.state.board;
    const [actions, setActions] = useState<ActionType[]>(actionsAcceptable);
    useEffect(() => {
        setActions((StateManager.isBlockedState(board)) ? actionsAcceptable : actionsNonAcceptable);
    }, [board]);
    const keyInfo = useShortcutEffect(actions.length);
    useEffect(() => {
        if (keyInfo.index < 0) return;
        onMakeAction(actions[keyInfo.index]);
    }, [keyInfo]);

    function handleAccept(board: BoardState) {
        if (!StateManager.isBlockedState(board)) return;
        ActionManager.pushAcceptedState(ctx);
    }

    const onMakeAction = (action: ActionType) => {
        //NOTE in some states, we are actually interested in this.
        switch (action) {
            case ActionType.Accept:
                handleAccept(board);
                break;
            case ActionType.IsALie:
                ActionManager.pushIsALieState(ctx, myId);
                break;
        }
    };


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
