import BaseActionButton from "pages/ingame/Center/ActionBoards/Boards/ActionButtons/BaseActionButton";
import classes from "pages/ingame/Center/ActionBoards/Boards/BaseBoard.module.css";
import {useContext} from "react";
import LocalContext, {LocalField,} from "system/context/localInfo/local-context";
import RoomContext from "system/context/room-context";
import {ActionInfo} from "system/GameStates/ActionInfo";
import {ActionType, StateManager} from "system/GameStates/States";
import {TurnManager} from "system/GameStates/TurnManager";
import * as ActionManager from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
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
const actions = [ActionType.Accept, ActionType.IsALie];
export default function CounterBoard(): JSX.Element {

    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const myId = localCtx.getVal(LocalField.Id);

    function onMakeAction(action: ActionType) {
        if (action !== ActionType.IsALie) return;
        ActionManager.pushIsALieState(ctx, myId);
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
