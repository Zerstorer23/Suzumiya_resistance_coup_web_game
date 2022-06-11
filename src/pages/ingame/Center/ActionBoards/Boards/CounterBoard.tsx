import BaseActionButton from "pages/ingame/Center/ActionBoards/Boards/ActionButtons/BaseActionButton";
import classes from "pages/ingame/Center/ActionBoards/Boards/BaseBoard/BaseBoard.module.css";
import {Fragment, useContext, useEffect} from "react";
import LocalContext, {LocalField,} from "system/context/localInfo/local-context";
import RoomContext from "system/context/roomInfo/room-context";
import {ActionType} from "system/GameStates/States";
import TransitionManager from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {useShortcutEffect} from "system/hooks/useShortcut";
import {useTranslation} from "react-i18next";
import {IProps} from "system/types/CommonTypes";
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
const actionsAcceptable = [ActionType.Accept, ActionType.IsALie];
const actionsNonAcceptable = [ActionType.None, ActionType.IsALie];
type Props = IProps & { canAccept: boolean }
export default function CounterBoard(props: Props): JSX.Element {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const myId = localCtx.getVal(LocalField.Id);
    const actions = props.canAccept ? actionsAcceptable : actionsNonAcceptable;
    const {t} = useTranslation();

    const keyInfo = useShortcutEffect(actions.length);
    useEffect(() => {
        if (keyInfo.index < 0) return;
        onMakeAction(actions[keyInfo.index]);
    }, [keyInfo]);

    function handleAccept() {
        if (!props.canAccept) return;
        TransitionManager.pushAcceptedState(ctx);
    }

    const onMakeAction = (action: ActionType) => {
        //NOTE in some states, we are actually interested in this.
        switch (action) {
            case ActionType.Accept:
                handleAccept();
                break;
            case ActionType.IsALie:
                TransitionManager.pushIsALieState(ctx, myId);
                break;
        }
    };


    return (
        <Fragment>
            <div className={classes.header}>{t("_react_action")}</div>
            <div className={classes.container}>
                {actions.map((action: ActionType, index: number) => {
                    return (
                        <BaseActionButton
                            key={index}
                            index={index}
                            isCardRole={false}
                            param={action}
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
