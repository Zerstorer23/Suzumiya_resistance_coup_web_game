import BaseActionButton from "pages/ingame/Center/ActionBoards/Boards/BaseActionButton";
import classes from "pages/ingame/Center/ActionBoards/Boards/BaseBoard.module.css";
import {useContext} from "react";
import LocalContext, {
    LocalField,
} from "system/context/localInfo/local-context";
import RoomContext from "system/context/room-context";
import {ActionInfo} from "system/GameStates/ActionInfo";
import {GameManager} from "system/GameStates/GameManager";
import {ActionType, BoardState, StateManager} from "system/GameStates/States";
import {pushIsALieState} from "pages/ingame/Center/ActionBoards/Boards/Solver/IsALieSolver";

export default function ReactAssassinBoard(): JSX.Element {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const myId = localCtx.getVal(LocalField.Id);

    const actions = [
        ActionType.Accept,
        ActionType.IsALie,
        ActionType.ContessaBlocksAssassination,
    ];

    function onMakeAction(action: ActionType) {
        const board = ctx.room.game.state.board;
        let newBoard = null;
        switch (action) {
            case ActionType.IsALie:
                pushIsALieState(ctx, myId);
                return;
            case ActionType.Accept:
                newBoard = StateManager.getAcceptedState(board);
                break;
            case ActionType.ContessaBlocksAssassination:
                newBoard = BoardState.AssassinBlocked;
                break;
            default:
                return;
        }
        if (newBoard === null) return;
        StateManager.createState(ctx.room.game.state, newBoard);
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
