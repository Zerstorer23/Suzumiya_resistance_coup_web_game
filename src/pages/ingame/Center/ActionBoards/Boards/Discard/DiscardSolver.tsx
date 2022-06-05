import {LocalContextType} from "system/context/localInfo/local-context";
import {KillInfo} from "system/GameStates/GameTypes";
import {TurnManager} from "system/GameStates/TurnManager";
import * as ActionManager from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {TransitionAction} from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {setMyTimer} from "pages/components/ui/MyTimer/MyTimer";
import {WaitTime} from "system/GameConstants";
import {BoardState} from "system/GameStates/States";
import {MyCardsPanel,} from "pages/ingame/Center/ActionBoards/Boards/Discard/DiscardPanels";
import {DeckManager} from "system/cards/DeckManager";
import {DbReferences, ReferenceManager} from "system/Database/RoomDatabase";
import {DS} from "system/Debugger/DS";
import {RoomContextType} from "system/context/roomInfo/RoomContextProvider";
import WaitingPanel from "pages/ingame/Center/ActionBoards/Boards/Waiter/WaitingPanel";

export function handleDiscardState(
    ctx: RoomContextType,
    localCtx: LocalContextType,
    killInfo: KillInfo
): JSX.Element {
    const [myId] = TurnManager.getMyInfo(ctx, localCtx);
    if (myId === killInfo.ownerId) {
        return handleMyTurn(ctx, localCtx, killInfo);
    } else {
        return <WaitingPanel/>;
    }
}

function handleMyTurn(
    ctx: RoomContextType,
    localCtx: LocalContextType,
    killInfo: KillInfo
): JSX.Element {
    if (killInfo.removed < 0) {
        return <MyCardsPanel/>;
    } else {
        setMyTimer(localCtx, WaitTime.WaitConfirms, () => {
            const nextBoard = killInfo.nextState as BoardState;
            switch (nextBoard) {
                case BoardState.GetThreeAccepted:
                case BoardState.AmbassadorAccepted:
                case BoardState.StealAccepted:
                case BoardState.ForeignAidAccepted:
                    ActionManager.prepareAndPushState(ctx, (newAction, newState) => {
                        newState.board = nextBoard;
                        return TransitionAction.Success;
                    });
                    break;
                case BoardState.CalledAssassinate:
                    //NOTE Just kill all cards and set him dead.
                    // Kill both card and set spectating true
                    ActionManager.prepareAndPushState(ctx, (newAction, newState) => {
                        newState.board = BoardState.DiscardingCard;
                        return TransitionAction.Success;
                    });
                    break;
                default:
                    ActionManager.prepareAndPushState(ctx, (newAction, newState) => {
                        return TransitionAction.EndTurn;
                    });
                    break;
            }
        });
        return <WaitingPanel/>;
    }
}

export function handleCardKill(ctx: RoomContextType, index: number) {
    const deck = ctx.room.game.deck;
    DeckManager.killCardAt(deck, index);
    ActionManager.prepareAndPushState(ctx, (newAction) => {
        const killedInfo = newAction.param as KillInfo;
        killedInfo.removed = index;
        newAction.param = killedInfo;
        ReferenceManager.updateReference(DbReferences.GAME_deck, deck);
        const isDead = DeckManager.playerIsDead(
            deck,
            ctx.room.playerMap.get(killedInfo.ownerId)!
        );
        if (isDead) {
            const player = ctx.room.playerMap.get(killedInfo.ownerId)!;
            player.isSpectating = true;
            player.coins = 0;
            ReferenceManager.updatePlayerReference(killedInfo.ownerId, player);
        }
        //If it was, set spectating on
        DS.logTransition("Removed card at " + index);
        DS.logTransition(newAction);
        return TransitionAction.Success;
    });
}
