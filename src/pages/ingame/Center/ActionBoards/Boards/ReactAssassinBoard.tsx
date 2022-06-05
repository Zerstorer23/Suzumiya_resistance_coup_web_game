import BaseActionButton from "pages/ingame/Center/ActionBoards/Boards/ActionButtons/BaseActionButton";
import classes from "pages/ingame/Center/ActionBoards/Boards/BaseBoard.module.css";
import {Fragment, useContext} from "react";
import LocalContext from "system/context/localInfo/local-context";
import RoomContext from "system/context/roomInfo/room-context";
import {ActionInfo} from "system/GameStates/ActionInfo";
import {ActionType, BoardState} from "system/GameStates/States";
import * as ActionManager from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {TransitionAction} from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {TurnManager} from "system/GameStates/TurnManager";
import {GameManager} from "system/GameStates/GameManager";
import {playerClaimedRole} from "system/Database/RoomDatabase";
import useShortcut from "system/hooks/useShortcut";

const actions = [
    ActionType.Accept,
    ActionType.IsALie,
    ActionType.ContessaBlocksAssassination,
];
export default function ReactAssassinBoard(): JSX.Element {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const [myId, myPlayer] = TurnManager.getMyInfo(ctx, localCtx);
    useShortcut(actions.length, (n) => {
        onMakeAction(actions[n]);//Block Accept will be filtered anyway
    });

    const onMakeAction = (action: ActionType) => {
        switch (action) {
            case ActionType.Accept:
                const killInfo = GameManager.createKillInfo(ActionType.Assassinate, myId);
                ActionManager.pushPrepareDiscarding(ctx, killInfo);
                break;
            case ActionType.IsALie:
                ActionManager.pushIsALieState(ctx, myId);
                break;
            case ActionType.ContessaBlocksAssassination:
                ActionManager.prepareAndPushState(ctx, (newAction, newState) => {
                    newState.board = BoardState.AssassinBlocked;
                    playerClaimedRole(myId, myPlayer, action);
                    return TransitionAction.Success;
                });
                break;
        }
    };

    return (
        <Fragment>
            <h1>Tsukomi</h1>
            <div className={classes.halfContainer}>
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
