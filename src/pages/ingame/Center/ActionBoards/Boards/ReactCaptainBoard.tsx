import BaseActionButton from "pages/ingame/Center/ActionBoards/Boards/ActionButtons/BaseActionButton";
import classes from "pages/ingame/Center/ActionBoards/Boards/BaseBoard.module.css";
import {useContext} from "react";
import LocalContext, {LocalField,} from "system/context/localInfo/local-context";
import RoomContext from "system/context/room-context";
import {ActionInfo} from "system/GameStates/ActionInfo";
import {GameManager} from "system/GameStates/GameManager";
import {ActionType, BoardState, StateManager} from "system/GameStates/States";
import {CardRole} from "system/cards/Card";
import * as ActionManager from "pages/ingame/Center/ActionBoards/Boards/ActionManager";
import {DbReferences, ReferenceManager} from "system/Database/RoomDatabase";
import {GameAction} from "system/GameStates/GameTypes";

const actions = [
    ActionType.Accept,
    ActionType.IsALie,
    ActionType.DefendWithAmbassador,
    ActionType.DefendWithCaptain,
];
export default function ReactCaptainBoard(): JSX.Element {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const myId = localCtx.getVal(LocalField.Id);


    function setDefendAction(gameAction: GameAction, cardRole: CardRole) {
        gameAction.param = GameManager.createChallengeInfo();
        gameAction.param.with = cardRole;
    }

    function onMakeAction(action: ActionType) {
        //Accept or Lie
        const handled = ActionManager.handleAcceptOrLie(ctx, action, myId);
        if (handled) return;
        //Defending Action
        const [newAction, newState] = ActionManager.prepareActionState(ctx);
        switch (action) {
            case ActionType.DefendWithAmbassador:
                newState.board = BoardState.StealBlocked;
                setDefendAction(newAction, CardRole.Ambassador);
                break;
            case ActionType.DefendWithCaptain:
                newState.board = BoardState.StealBlocked;
                setDefendAction(newAction, CardRole.Captain);
                break;
            default:
                return;
        }
        ActionManager.pushActionState(newAction, newState);
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
