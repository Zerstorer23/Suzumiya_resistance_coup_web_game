import {getRequiredCoins} from "pages/ingame/Center/ActionBoards/Boards/ActionButtons/BaseActionButton";
import {Fragment, useContext, useEffect, useState} from "react";
import LocalContext from "system/context/localInfo/local-context";
import RoomContext from "system/context/roomInfo/room-context";
import {ActionType, StateManager} from "system/GameStates/States";
import TransitionManager from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {DS} from "system/Debugger/DS";
import {TurnManager} from "system/GameStates/TurnManager";
import {useShortcutEffect} from "system/hooks/useShortcut";
import useDefaultAction from "system/hooks/useDefaultAction";
import {ActionPanel, TargetPlayerPanel} from "pages/ingame/Center/ActionBoards/Boards/BaseBoard/BaseBoardPanel";

const actionsDefault = [
    ActionType.GetOne,
    ActionType.GetThree,
    ActionType.GetForeignAid,
    ActionType.Steal,
    ActionType.Coup,
    ActionType.Assassinate,
    ActionType.ChangeCards,
];
const actionsExpansion = [
    ActionType.GetOne,
    ActionType.GetThree,
    ActionType.GetForeignAid,
    ActionType.Steal,
    ActionType.Coup,
    ActionType.Assassinate,
    ActionType.InquisiteCards,
];
const coupAction = [ActionType.None, ActionType.None, ActionType.None, ActionType.None, ActionType.Coup];

export default function BaseBoard(): JSX.Element {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const myEntry = TurnManager.getMyInfo(ctx, localCtx);
    const [savedAction, setSaved] = useState(ActionType.None);
    const forceCoup = myEntry.player.coins >= 10;
    const baseActions = ctx.room.header.settings.expansion ? actionsExpansion : actionsDefault;
    const [actions, setButtons] = useState<ActionType[]>(baseActions);
    const [elem, setJSX] = useState(<Fragment/>);
    useEffect(() => {
        if (savedAction === ActionType.None) {
            setJSX(<ActionPanel actions={actions} onMakeAction={onMakeAction}/>);
        } else {
            setJSX(<TargetPlayerPanel onPlayerSelected={onPlayerSelected}/>);
        }
    }, [savedAction, actions]);

    useEffect(() => {
        setButtons((forceCoup && DS.StrictRules) ? coupAction : baseActions);
    }, [forceCoup]);

    const keyInfo = useShortcutEffect(8);

    useEffect(() => {
        const index = keyInfo.index;
        if (index < 0) return;
        if (savedAction === ActionType.None) {
            if (index >= actions.length) return;
            onMakeAction(actions[index]);
        } else {
            const targetId = ctx.room.playerList[index];
            if (targetId === undefined || targetId === null) return;
            if (targetId === myEntry.id) return;
            onPlayerSelected(targetId);
        }
    }, [keyInfo, actions]);

    useDefaultAction(ctx, localCtx, () => {
        if (forceCoup) {
            TransitionManager.pushCalledState(ctx, ActionType.Coup, myEntry, myEntry.id);
        } else {
            onMakeAction(ActionType.GetOne);
        }
    });


    function handleTargetableAction(action: ActionType): boolean {
        if (!StateManager.isTargetableAction(action)) return false;
        if (ctx.room.playerList.length === 1 && ctx.room.playerList[0] === myEntry.id) return true;
        setSaved(action);
        return true;
    }


    function onPlayerSelected(playerId: string) {
        if (!StateManager.isTargetableAction(savedAction)) return;
        TransitionManager.pushCalledState(ctx, savedAction, myEntry, playerId);
    }


    function onMakeAction(action: ActionType) {
        if (action === ActionType.None) return;
        if (DS.StrictRules && getRequiredCoins(action) > myEntry.player.coins) return;
        const handled = handleTargetableAction(action);
        if (handled) return;
        TransitionManager.pushCalledState(ctx, action, myEntry);
    }

    return (elem);
}
