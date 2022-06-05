import BaseActionButton from "pages/ingame/Center/ActionBoards/Boards/ActionButtons/BaseActionButton";
import classes from "pages/ingame/Center/ActionBoards/Boards/BaseBoard.module.css";
import {Fragment, useContext, useEffect} from "react";
import LocalContext from "system/context/localInfo/local-context";
import RoomContext from "system/context/roomInfo/room-context";
import {ActionInfo} from "system/GameStates/ActionInfo";
import {ActionType, BoardState} from "system/GameStates/States";
import * as ActionManager from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {TransitionAction} from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {TurnManager} from "system/GameStates/TurnManager";
import {GameManager} from "system/GameStates/GameManager";
import {playerClaimedRole} from "system/Database/RoomDatabase";
import {keyCodeToIndex} from "pages/ingame/Center/ActionBoards/Boards/BaseBoard";

const baseActions = [
    ActionType.Accept,
    ActionType.IsALie,
    ActionType.ContessaBlocksAssassination,
];
export default function ReactAssassinBoard(): JSX.Element {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const [myId, myPlayer] = TurnManager.getMyInfo(ctx, localCtx);
    useEffect(() => {
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, []);

    function onKeyDown(event: any) {
        const idx = keyCodeToIndex(event.keyCode, baseActions.length - 1);
        if (idx < 0) return;
        onMakeAction(baseActions[idx]);
    }

    function onMakeAction(action: ActionType) {
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
    }

    return (
        <Fragment>
            <h1>Tsukomi</h1>
            <div className={classes.halfContainer}>
                {baseActions.map((action: ActionType, index: number) => {
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
