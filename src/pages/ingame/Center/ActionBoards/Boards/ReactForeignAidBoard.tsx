import BaseActionButton from "pages/ingame/Center/ActionBoards/Boards/ActionButtons/BaseActionButton";
import classes from "pages/ingame/Center/ActionBoards/Boards/BaseBoard/BaseBoard.module.css";
import {Fragment, useContext, useEffect} from "react";
import LocalContext from "system/context/localInfo/local-context";
import RoomContext from "system/context/roomInfo/room-context";

import {ActionType, BoardState} from "system/GameStates/States";
import TransitionManager, {TransitionAction} from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {playerClaimedRole} from "system/Database/RoomDatabase";
import {TurnManager} from "system/GameStates/TurnManager";
import {useShortcutEffect} from "system/hooks/useShortcut";
import {useTranslation} from "react-i18next";

const actions = [ActionType.None, ActionType.DukeBlocksForeignAid];
export default function ReactForeignAidBoard(): JSX.Element {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const myEntry = TurnManager.getMyInfo(ctx, localCtx);
    const keyInfo = useShortcutEffect(actions.length);
    const {t} = useTranslation();
    useEffect(() => {
        const index = keyInfo.index;
        if (index < 0) return;
        onMakeAction(actions[index]);
    }, [keyInfo]);

    const onMakeAction = (action: ActionType) => {
        if (action !== ActionType.DukeBlocksForeignAid) return;
        //Only interested in when it is blocked
        TransitionManager.prepareAndPushState(ctx, (newAction, newState) => {
            //Target == the one who blocks
            newAction.targetId = myEntry.id;
            newState.board = BoardState.CalledGetTwoBlocked;
            playerClaimedRole(myEntry, action);
            return TransitionAction.Success;
        });
    };

    return (<Fragment>
            <div className={classes.playerHeader}>{t("_react_action")}</div>
            <div className={classes.container}>
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
