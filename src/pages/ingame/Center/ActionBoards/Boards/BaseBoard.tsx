import {setMyTimer} from "pages/components/ui/MyTimer/MyTimer";
import BaseActionButton, {
    getRequiredCoins
} from "pages/ingame/Center/ActionBoards/Boards/ActionButtons/BaseActionButton";
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
import {GameManager} from "system/GameStates/GameManager";
import {TurnManager} from "system/GameStates/TurnManager";
import useShortcut from "pages/ingame/Center/ActionBoards/Boards/ActionButtons/useShortcut";

const actionsDefault = [
    ActionType.GetOne,
    ActionType.GetThree,
    ActionType.GetForeignAid,
    ActionType.Steal,
    ActionType.Coup,
    ActionType.Assassinate,
    ActionType.ChangeCards,
];
const coupAction = [ActionType.None, ActionType.None, ActionType.None, ActionType.None, ActionType.Coup];

export default function BaseBoard(): JSX.Element {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const [myId, myPlayer] = TurnManager.getMyInfo(ctx, localCtx);
    //For target actions, save which button we pressed
    const [savedAction, setSaved] = useState(ActionType.None);
    const pSelector = localCtx.getVal(LocalField.PlayerSelector);
    const forceCoup = myPlayer.coins >= 10;
    const [actions, setButtons] = useState<ActionType[]>(actionsDefault);
    useEffect(() => {
        setButtons((forceCoup && DS.StrictRules) ? coupAction : actionsDefault);
    }, [forceCoup]);

    useShortcut(actions.length, (n) => {
        onMakeAction(actions[n]);
    });

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
        DS.logTransition("I am choosing ....");
        DS.logTransition(ctx.room);
        setMyTimer(localCtx, WaitTime.MakingDecision, () => {
            if (!DS.StrictRules) return;
            if (forceCoup) {
                onMakeAction(actions[5]);
            } else {
                ActionManager.pushPrepareDiscarding(ctx, GameManager.createKillInfo(ActionType.Coup, myId));
            }
        });
    }, []);

    useEffect(() => {
        //Only do something whenn selector has name AND we saved Action.
        if (pSelector === CursorState.Selecting || pSelector === CursorState.Idle)
            return;
        if (!StateManager.isTargetableAction(savedAction)) return;
        //Coup is special
        if (savedAction === ActionType.Coup) {
            ActionManager.pushPrepareDiscarding(ctx, GameManager.createKillInfo(ActionType.Coup, pSelector));
            return;
        }
        //You selected something
        ActionManager.pushCalledState(ctx, savedAction, myId, pSelector);
        //Clear states
        clearSelector();
    }, [pSelector, savedAction]);


    function onMakeAction(action: ActionType) {
        console.log("Pressed " + action);
        if (action === ActionType.None) return;
        if (DS.StrictRules && getRequiredCoins(action) < myPlayer.coins) return;
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
        </Fragment>
    );
}
