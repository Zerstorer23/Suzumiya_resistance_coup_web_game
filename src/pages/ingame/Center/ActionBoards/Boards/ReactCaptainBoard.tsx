import BaseActionButton from "pages/ingame/Center/ActionBoards/Boards/ActionButtons/BaseActionButton";
import classes from "pages/ingame/Center/ActionBoards/Boards/BaseBoard.module.css";
import {useContext} from "react";
import LocalContext from "system/context/localInfo/local-context";
import RoomContext from "system/context/roomInfo/room-context";
import {ActionInfo} from "system/GameStates/ActionInfo";
import {ActionType, BoardState} from "system/GameStates/States";
import {CardRole} from "system/cards/Card";
import * as ActionManager from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {TransitionAction} from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {playerClaimedRole} from "system/Database/RoomDatabase";
import {TurnManager} from "system/GameStates/TurnManager";
import useShortcut from "system/hooks/useShortcut";

const actions = [
    ActionType.Accept,
    ActionType.IsALie,
    ActionType.DefendWithAmbassador,
    ActionType.DefendWithCaptain,
];
export default function ReactCaptainBoard(): JSX.Element {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const [myId, myPlayer] = TurnManager.getMyInfo(ctx, localCtx);
    useShortcut(actions.length, (n) => {
        onMakeAction(actions[n]);//Block Accept will be filtered anyway
    });

    const onMakeAction = (action: ActionType) => {
        //Accept or Lie
        const handled = ActionManager.handleAcceptOrLie(ctx, action, myId);
        if (handled) return;
        //Defending Action
        ActionManager.prepareAndPushState(ctx, (newAction, newState) => {
            switch (action) {
                case ActionType.DefendWithAmbassador:
                    newState.board = BoardState.StealBlocked;
                    newAction.param = CardRole.Ambassador;
                    break;
                case ActionType.DefendWithCaptain:
                    newState.board = BoardState.StealBlocked;
                    newAction.param = CardRole.Captain;
                    break;
                default:
                    return TransitionAction.Abort;
            }
            playerClaimedRole(myId, myPlayer, action);
            return TransitionAction.Success;
        });
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
