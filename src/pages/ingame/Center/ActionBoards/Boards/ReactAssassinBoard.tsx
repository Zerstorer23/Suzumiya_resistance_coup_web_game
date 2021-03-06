import BaseActionButton from "pages/ingame/Center/ActionBoards/Boards/ActionButtons/BaseActionButton";
import classes from "pages/ingame/Center/ActionBoards/Boards/BaseBoard/BaseBoard.module.css";
import {Fragment, useContext, useEffect} from "react";
import LocalContext from "system/context/localInfo/local-context";
import RoomContext from "system/context/roomInfo/room-context";

import {ActionType, BoardState} from "system/GameStates/States";
import TransitionManager, {TransitionAction} from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
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
    const myEntry = TurnManager.getMyInfo(ctx, localCtx);
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
                const killInfo = GameManager.createKillInfo(ActionType.Assassinate, BoardState.CalledAssassinate, myEntry.id);
                TransitionManager.pushPrepareDiscarding(ctx, killInfo);
                break;
            case ActionType.IsALie:
                TransitionManager.pushIsALieState(ctx, myEntry.id);
                break;
            case ActionType.ContessaBlocksAssassination:
                TransitionManager.prepareAndPushState(ctx, (newAction, newState) => {
                    newState.board = BoardState.AssassinBlocked;
                    playerClaimedRole(myEntry, action);
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
                            isCardRole={false}
                            param={(action)}
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
