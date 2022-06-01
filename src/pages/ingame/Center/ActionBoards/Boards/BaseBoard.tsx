import {setMyTimer} from "pages/components/ui/MyTimer/MyTimer";
import BaseActionButton from "pages/ingame/Center/ActionBoards/Boards/ActionButtons/BaseActionButton";
import {Fragment, useContext, useEffect, useState} from "react";
import LocalContext, {LocalField,} from "system/context/localInfo/local-context";
import {CursorState} from "system/context/localInfo/LocalContextProvider";
import RoomContext from "system/context/roomInfo/room-context";
import {WaitTime} from "system/GameConstants";
import {ActionInfo} from "system/GameStates/ActionInfo";
import {ActionType, StateManager} from "system/GameStates/States";
import classes from "./BaseBoard.module.css";
import * as ActionManager from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {DS} from "system/Debugger/DS";

const actions = [
    ActionType.GetOne,
    ActionType.GetThree,
    ActionType.GetForeignAid,
    ActionType.Steal,
    ActionType.Coup,
    ActionType.Assassinate,
    ActionType.None,
    ActionType.ChangeCards,
];

export default function BaseBoard(): JSX.Element {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const myId: string = localCtx.getVal(LocalField.Id)!;
    //For target actions, save which button we pressed
    const [savedAction, setSaved] = useState(ActionType.None);
    const pSelector = localCtx.getVal(LocalField.PlayerSelector);

    function clearSelector() {
        if (savedAction === ActionType.None) return;
        setSaved(ActionType.None);
        localCtx.setVal(LocalField.PlayerSelector, CursorState.Idle);
    }

    function handleTargetableAction(action: ActionType): boolean {
        if (!StateManager.isTargetableAction(action)) return false;
        setSaved(action);
        localCtx.setVal(
            LocalField.PlayerSelector,
            pSelector === CursorState.Selecting
                ? CursorState.Idle
                : CursorState.Selecting
        );
        return true;
    }


    useEffect(() => {
        setMyTimer(localCtx, WaitTime.MakingDecision, () => {
            if (DS.AutoEnd) {
                onMakeAction(actions[0]);
            }
        });
    }, []);

    useEffect(() => {
        //Only do something whenn selector has name AND we saved Action.
        if (pSelector === CursorState.Selecting || pSelector === CursorState.Idle)
            return;
        if (!StateManager.isTargetableAction(savedAction)) return;
        //You selected something
        ActionManager.pushCalledState(ctx, savedAction, myId, pSelector);
        //Clear states
        clearSelector();
    }, [pSelector, savedAction]);


    function onMakeAction(action: ActionType) {
        //Target Actions
        const handled = handleTargetableAction(action);
        if (handled) return;
        //Non Target Actions
        clearSelector();
        ActionManager.pushCalledState(ctx, action, myId);
    }

    return (
        <Fragment>
            <div className={classes.header}>Do my action...</div>
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
        </Fragment>
    );
}
