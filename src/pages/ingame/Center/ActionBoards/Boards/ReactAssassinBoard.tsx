import BaseActionButton from "pages/ingame/Center/ActionBoards/Boards/ActionButtons/BaseActionButton";
import classes from "pages/ingame/Center/ActionBoards/Boards/BaseBoard.module.css";
import {Fragment, useContext, useEffect} from "react";
import LocalContext from "system/context/localInfo/local-context";
import RoomContext from "system/context/roomInfo/room-context";
import {actionPool} from "system/GameStates/ActionInfo";
import {ActionType, BoardState} from "system/GameStates/States";
import * as ActionManager from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {TransitionAction} from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {TurnManager} from "system/GameStates/TurnManager";
import {GameManager} from "system/GameStates/GameManager";
import {playerClaimedRole} from "system/Database/RoomDatabase";
import {useShortcutEffect} from "system/hooks/useShortcut";
import useDefaultAction from "system/hooks/useDefaultAction";
import {useTranslation} from "react-i18next";

const actions = [
    ActionType.Accept,
    ActionType.IsALie,
    ActionType.ContessaBlocksAssassination,
];
export default function ReactAssassinBoard(): JSX.Element {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const [myId, myPlayer] = TurnManager.getMyInfo(ctx, localCtx);
    const keyInfo = useShortcutEffect(actions.length);
    useDefaultAction(ctx, localCtx, () => {
        onMakeAction(ActionType.Accept);
    });
    useEffect(() => {
        const index = keyInfo.index;
        if (index < 0) return;
        onMakeAction(actions[index]);
    }, [keyInfo]);
    const {t} = useTranslation();

    const onMakeAction = (action: ActionType) => {
        switch (action) {
            case ActionType.Accept:
                const killInfo = GameManager.createKillInfo(ActionType.Assassinate, BoardState.CalledAssassinate, myId);
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
            <div className={classes.header}>{t("_react_action")}</div>
            <div className={classes.halfContainer}>
                {actions.map((action: ActionType, index: number) => {
                    return (
                        <BaseActionButton
                            key={index}
                            index={index}
                            param={actionPool.get(action)}
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
