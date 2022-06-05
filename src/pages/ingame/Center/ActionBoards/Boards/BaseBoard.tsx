import {setMyTimer} from "pages/components/ui/MyTimer/MyTimer";
import BaseActionButton, {
    getRequiredCoins
} from "pages/ingame/Center/ActionBoards/Boards/ActionButtons/BaseActionButton";
import {Fragment, useContext, useEffect, useState} from "react";
import LocalContext, {LocalContextType, LocalField,} from "system/context/localInfo/local-context";
import RoomContext from "system/context/roomInfo/room-context";
import {WaitTime} from "system/GameConstants";
import {ActionInfo} from "system/GameStates/ActionInfo";
import {ActionType, StateManager} from "system/GameStates/States";
import classes from "./BaseBoard.module.css";
import * as ActionManager from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {DS} from "system/Debugger/DS";
import {GameManager} from "system/GameStates/GameManager";
import {TurnManager} from "system/GameStates/TurnManager";
import useShortcut from "system/hooks/useShortcut";
import {PlayerMap} from "system/GameStates/GameTypes";
import {RoomContextType} from "system/context/roomInfo/RoomContextProvider";
import PlayerItem from "pages/ingame/Left/PlayerBoard/PlayerItem/PlayerItem";

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

function createActionBoards(actions: ActionType[], onMakeAction: any): JSX.Element {
    return <div className={classes.container}>
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
    </div>;
}

function createTargetPlayerBoards(ctx: RoomContextType, localCtx: LocalContextType, onPlayerSelected: any): JSX.Element {
    const playerList: string[] = ctx.room.playerList;
    const playerMap: PlayerMap = ctx.room.playerMap;
    const myId = localCtx.getVal(LocalField.Id);
    return <div className={classes.playersContainer}>
        {playerList.map((playerId) => {
            if (playerId === myId) return <Fragment key={playerId}/>;
            return <PlayerItem
                key={playerId}
                playerId={playerId}
                player={playerMap.get(playerId)!}
                isSelectable={true}
                onSelect={onPlayerSelected(playerId)}
            />;
        })}
    </div>;
}

export default function BaseBoard(): JSX.Element {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const [myId, myPlayer] = TurnManager.getMyInfo(ctx, localCtx);
    const [savedAction, setSaved] = useState(ActionType.None);

    const forceCoup = myPlayer.coins >= 10;
    const [actions, setButtons] = useState<ActionType[]>(actionsDefault);
    const [elem, setJSX] = useState(<Fragment/>);
    useEffect(() => {
        console.log("Selecting? " + savedAction);
        if (savedAction === ActionType.None) {
            setJSX(createActionBoards(actions, onMakeAction));
        } else {
            setJSX(createTargetPlayerBoards(ctx, localCtx, onPlayerSelected));
        }
    }, [savedAction, actions]);

    useEffect(() => {
        setButtons((forceCoup && DS.StrictRules) ? coupAction : actionsDefault);
    }, [forceCoup]);

    useShortcut(actions.length, (n) => {
        onMakeAction(actions[n]);
    });


    function handleTargetableAction(action: ActionType): boolean {
        if (!StateManager.isTargetableAction(action)) return false;
        if (ctx.room.playerList.length === 1 && ctx.room.playerList[0] === myId) return true;
        setSaved(action);
        return true;
    }


    useEffect(() => {
        setMyTimer(localCtx, WaitTime.MakingDecision, () => {
            if (!DS.StrictRules) return;
            if (forceCoup) {
                onMakeAction(actions[5]);
            } else {
                ActionManager.pushPrepareDiscarding(ctx, GameManager.createKillInfo(ActionType.Coup, myId));
            }
        });
    }, []);

    function onPlayerSelected(playerId: string) {
        if (!StateManager.isTargetableAction(savedAction)) return;
        //Coup is special
        if (savedAction === ActionType.Coup) {
            ActionManager.pushPrepareDiscarding(ctx, GameManager.createKillInfo(ActionType.Coup, playerId));
            return;
        }
        ActionManager.pushCalledState(ctx, savedAction, myId, playerId);
    }


    function onMakeAction(action: ActionType) {
        if (action === ActionType.None) return;
        if (DS.StrictRules && getRequiredCoins(action) < myPlayer.coins) return;
        const handled = handleTargetableAction(action);
        if (handled) return;
        ActionManager.pushCalledState(ctx, action, myId);
    }


    return (
        <Fragment>
            <div className={classes.header}>Do my action...</div>
            {elem}
        </Fragment>
    );
}
