import {LocalContextType} from "system/context/localInfo/local-context";
import {KillInfo} from "system/GameStates/GameTypes";
import {TurnManager} from "system/GameStates/TurnManager";
import * as ActionManager from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {TransitionAction} from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {setMyTimer} from "pages/components/ui/MyTimer/MyTimer";
import {WaitTime} from "system/GameConstants";
import {BoardState} from "system/GameStates/States";
import {
    createWaitingBoard,
    MyCardsPanel,
    PostKillPanel
} from "pages/ingame/Center/ActionBoards/Boards/Discard/DiscardPanels";
import {DeckManager} from "system/cards/DeckManager";
import {DbReferences, ReferenceManager} from "system/Database/RoomDatabase";
import {DS} from "system/Debugger/DS";
import {RoomContextType} from "system/context/roomInfo/RoomContextProvider";


export function handleDiscardState(ctx: RoomContextType, localCtx: LocalContextType, killInfo: KillInfo): JSX.Element {
    const [myId, myPlayer] = TurnManager.getMyInfo(ctx, localCtx);
    console.log("Discard receive info");
    console.log(killInfo);
    if (myId === killInfo.ownerId) {
        return handleMyTurn(ctx, localCtx, killInfo);
    } else {
        return handleOtherTurn(ctx, localCtx, killInfo);
    }
}

function handleMyTurn(ctx: RoomContextType, localCtx: LocalContextType, killInfo: KillInfo): JSX.Element {
    if (killInfo.removed < 0) {
        return (<MyCardsPanel/>);
    } else {
        setMyTimer(localCtx, WaitTime.WaitConfirms, () => {
            const nextBoard = killInfo.nextState as BoardState;
            switch (nextBoard) {
                case BoardState.GetThreeAccepted:
                case BoardState.AmbassadorAccepted:
                case BoardState.StealAccepted:
                    ActionManager.prepareAndPushState(ctx, (newAction, newState) => {
                        newState.board = nextBoard;
                        return TransitionAction.Success;
                    });
                    break;
                case BoardState.CalledAssassinate:
                    //TODO this person is dead.
                    //Kill both card and set spectating true
                    ActionManager.prepareAndPushState(ctx, (newAction, newState) => {
                        newState.board = BoardState.DiscardingCard;
                        return TransitionAction.Success;
                    });
                    break;
                default:
                    ActionManager.pushJustEndTurn(ctx);
                    break;
            }
        });
        return (<PostKillPanel/>);
    }
}

function handleOtherTurn(ctx: RoomContextType, localCtx: LocalContextType, killInfo: KillInfo): JSX.Element {
    if (killInfo.removed < 0) {
        const targetPlayer = ctx.room.playerMap.get(killInfo.ownerId)!;
        return (createWaitingBoard(targetPlayer));
    } else {
        return (<PostKillPanel/>);
    }
}

export function handlePlayerKill(ctx: RoomContextType, index: number) {
    const deck = ctx.room.game.deck;
    DeckManager.killCardAt(deck, index);
    ActionManager.prepareAndPushState(ctx, (newAction, newState) => {
        const killedInfo = newAction.param as KillInfo;
        killedInfo.removed = index;
        newAction.param = killedInfo;
        ReferenceManager.updateReference(DbReferences.GAME_deck, deck);
        //TODO check if that was last card.
        //If it was, set spectating on
        DS.logTransition("Removed card at " + index);
        DS.logTransition(newAction);
        return TransitionAction.Success;
    });
}

