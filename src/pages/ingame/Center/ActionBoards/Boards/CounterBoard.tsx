import BaseActionButton from "pages/ingame/Center/ActionBoards/Boards/ActionButtons/BaseActionButton";
import classes from "pages/ingame/Center/ActionBoards/Boards/BaseBoard.module.css";
import {useContext} from "react";
import LocalContext, {LocalField,} from "system/context/localInfo/local-context";
import RoomContext from "system/context/roomInfo/room-context";
import {ActionInfo} from "system/GameStates/ActionInfo";
import {ActionType, BoardState} from "system/GameStates/States";
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

    function handleAccept(board: BoardState) {
        switch (board) {
            case BoardState.CalledSteal:
            case BoardState.CalledAssassinate:
            case BoardState.CalledGetTwoBlocked:
            case BoardState.StealBlocked:
            case BoardState.AssassinBlocked:
                ActionManager.pushAcceptedState(ctx);
                break;
            default:
                return;
        }
    }

    function onMakeAction(action: ActionType) {
        //TODO in some states, we are actually interested in this.
        switch (action) {
            case ActionType.Accept:
                handleAccept(ctx.room.game.state.board);
                break;
            case ActionType.IsALie:
                ActionManager.pushIsALieState(ctx, myId);
                break;
        }

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
