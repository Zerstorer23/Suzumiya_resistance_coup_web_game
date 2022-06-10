import BaseActionButton, {
    getRequiredCoins
} from "pages/ingame/Center/ActionBoards/Boards/ActionButtons/BaseActionButton";
import {Fragment, useContext, useEffect, useState} from "react";
import LocalContext, {LocalContextType, LocalField,} from "system/context/localInfo/local-context";
import RoomContext from "system/context/roomInfo/room-context";
import {actionPool} from "system/GameStates/ActionInfo";
import {ActionType, StateManager} from "system/GameStates/States";
import classes from "./BaseBoard.module.css";
import TransitionManager from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {DS} from "system/Debugger/DS";
import {TurnManager} from "system/GameStates/TurnManager";
import {useShortcutEffect} from "system/hooks/useShortcut";
import {PlayerMap} from "system/GameStates/GameTypes";
import {RoomContextType} from "system/context/roomInfo/RoomContextProvider";
import MiniPlayerItem from "pages/ingame/Center/ActionBoards/Boards/PlayerItem/MiniPlayerItem";
import useDefaultAction from "system/hooks/useDefaultAction";
import {useTranslation} from "react-i18next";

const actionsDefault = [
    ActionType.GetOne,
    ActionType.GetThree,
    ActionType.GetForeignAid,
    ActionType.Steal,
    ActionType.Coup,
    ActionType.Assassinate,
    ActionType.ChangeCards,
];
const coupAction = [ActionType.None, ActionType.None, ActionType.None, ActionType.None, ActionType.Coup];

function createActionBoards(t: any, actions: ActionType[], onMakeAction: any): JSX.Element {
    return <Fragment>
        <div className={classes.header}>{t("_do_my_action")}</div>
        <div className={classes.container}>
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
    </Fragment>;

}

function createTargetPlayerBoards(t: any, ctx: RoomContextType, localCtx: LocalContextType, onPlayerSelected: (id: string) => void): JSX.Element {
    const playerList: string[] = ctx.room.playerList;
    const playerMap: PlayerMap = ctx.room.playerMap;
    const myId = localCtx.getVal(LocalField.Id);
    return <Fragment>
        <div className={classes.header}>{t("_do_my_action")}</div>
        <div className={classes.playersContainer}>
            {playerList.map((playerId, index) => {
                if (playerId === myId) return <Fragment key={playerId}/>;
                return <MiniPlayerItem
                    key={playerId}
                    index={index}
                    playerId={playerId}
                    player={playerMap.get(playerId)!}
                    onSelect={onPlayerSelected}
                />;
            })}
        </div>
    </Fragment>;
}

export default function BaseBoard(): JSX.Element {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const [myId, myPlayer] = TurnManager.getMyInfo(ctx, localCtx);
    const [savedAction, setSaved] = useState(ActionType.None);
    const {t} = useTranslation();
    const forceCoup = myPlayer.coins >= 10;
    const [actions, setButtons] = useState<ActionType[]>(actionsDefault);
    const [elem, setJSX] = useState(<Fragment/>);
    useEffect(() => {
        if (savedAction === ActionType.None) {
            setJSX(createActionBoards(t, actions, onMakeAction));
        } else {
            setJSX(createTargetPlayerBoards(t, ctx, localCtx, onPlayerSelected));
        }
    }, [savedAction, actions]);

    useEffect(() => {
        setButtons((forceCoup && DS.StrictRules) ? coupAction : actionsDefault);
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
            if (targetId === myId) return;
            onPlayerSelected(targetId);
        }
    }, [keyInfo, actions]);

    useDefaultAction(ctx, localCtx, () => {
        if (forceCoup) {
            TransitionManager.pushCalledState(ctx, ActionType.Coup, {id: myId, player: myPlayer}, myId);
        } else {
            onMakeAction(ActionType.GetOne);
        }
    });


    function handleTargetableAction(action: ActionType): boolean {
        if (!StateManager.isTargetableAction(action)) return false;
        if (ctx.room.playerList.length === 1 && ctx.room.playerList[0] === myId) return true;
        setSaved(action);
        return true;
    }


    function onPlayerSelected(playerId: string) {
        if (!StateManager.isTargetableAction(savedAction)) return;
        console.log("Selected player " + playerId);
        TransitionManager.pushCalledState(ctx, savedAction, {id: myId, player: myPlayer}, playerId);
    }


    function onMakeAction(action: ActionType) {
        if (action === ActionType.None) return;
        if (DS.StrictRules && getRequiredCoins(action) > myPlayer.coins) return;
        const handled = handleTargetableAction(action);
        if (handled) return;
        TransitionManager.pushCalledState(ctx, action, {id: myId, player: myPlayer});
    }

    return (elem);
}
