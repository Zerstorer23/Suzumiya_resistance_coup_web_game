import BaseActionButton from "pages/ingame/Center/ActionBoards/Boards/ActionButtons/BaseActionButton";
import classes from "pages/ingame/Center/ActionBoards/Boards/BaseBoard/BaseBoard.module.css";
import {Fragment, useContext, useEffect} from "react";
import LocalContext from "system/context/localInfo/local-context";
import RoomContext from "system/context/roomInfo/room-context";

import {ActionType, BoardState} from "system/GameStates/States";
import {CardRole} from "system/cards/Card";
import TransitionManager, {TransitionAction} from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {playerClaimedRole} from "system/Database/RoomDatabase";
import {TurnManager} from "system/GameStates/TurnManager";
import {useShortcutEffect} from "system/hooks/useShortcut";
import useDefaultAction from "system/hooks/useDefaultAction";
import {useTranslation} from "react-i18next";

const actions = [
    ActionType.Accept,
    ActionType.IsALie,
    ActionType.DefendWithAmbassador,
    ActionType.DefendWithCaptain,
];
export default function ReactCaptainBoard(): JSX.Element {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const myEntry = TurnManager.getMyInfo(ctx, localCtx);
    const keyInfo = useShortcutEffect(actions.length);
    const {t} = useTranslation();
    useDefaultAction(ctx, localCtx, () => {
        onMakeAction(ActionType.Accept);
    });


    useEffect(() => {
        const index = keyInfo.index;
        if (index < 0) return;
        onMakeAction(actions[index]);
    }, [keyInfo]);

    const onMakeAction = (action: ActionType) => {
        //Accept or Lie
        const handled = TransitionManager.handleAcceptOrLie(ctx, action, myEntry.id);
        if (handled) return;
        //Defending Action
        TransitionManager.prepareAndPushState(ctx, (newAction, newState) => {
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
            playerClaimedRole(myEntry, action);
            return TransitionAction.Success;
        });
    };

    return (<Fragment>
            <div className={classes.header}>{t("_react_action")}</div>
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
