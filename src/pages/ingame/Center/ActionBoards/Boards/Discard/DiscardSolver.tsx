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
        return handleLoserTurn(ctx, localCtx, killInfo);
    } else {
        return handleWinnerTurn(ctx, localCtx, killInfo);
    }
}

function handleLoserTurn(
    ctx: RoomContextType,
    localCtx: LocalContextType,
    killInfo: KillInfo
): JSX.Element {
    if (killInfo.nextState === BoardState.CalledAssassinate) {
        const numAlive = DeckManager.playerCardNum(ctx.room.game.deck, ctx.room.playerMap.get(killInfo.ownerId)!.icard);
        if (numAlive === 2) {
            handleSuicide(ctx, killInfo.ownerId);
        }
        return <WaitingPanel/>;
    }
    if (killInfo.removed[0] < 0) {
        return <MyCardsPanel/>;
    } else {
        return <WaitingPanel/>;
    }
}

function handleWinnerTurn(
    ctx: RoomContextType,
    localCtx: LocalContextType,
    killInfo: KillInfo
): JSX.Element {
    if (killInfo.removed[0] < 0) {
        return <WaitingPanel/>;
    } else {
        hostEndsState(ctx, localCtx, killInfo);
        return <WaitingPanel/>;
    }
}

function hostEndsState(ctx: RoomContextType,
                       localCtx: LocalContextType,
                       killInfo: KillInfo) {
    //TODO Host handles ending discarding state.
    const amHost = TurnManager.amHost(ctx, localCtx);
    if (!amHost) return;
    setMyTimer(localCtx, WaitTime.WaitConfirms, () => {
        const nextBoard = killInfo.nextState as BoardState;
        //TODO if alive player number <= 1, set turn -2 . return success. [endturn will clear turn]
        //else do next board switch
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
            default:
                ActionManager.prepareAndPushState(ctx, (newAction, newState) => {
                    return TransitionAction.EndTurn;
                });
                break;
        }
    });
}


export function handleCardKill(ctx: RoomContextType, index: number) {
    const deck = ctx.room.game.deck;
    DeckManager.killCardAt(deck, index);
    ActionManager.prepareAndPushState(ctx, (newAction) => {
        const killedInfo = newAction.param as KillInfo;
        killedInfo.removed[0] = index;
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

export function handleSuicide(ctx: RoomContextType, playerId: string) {
    const deck = ctx.room.game.deck;
    ActionManager.prepareAndPushState(ctx, (newAction) => {
        const player = ctx.room.playerMap.get(playerId)!;
        DeckManager.killCardAt(deck, player.icard);
        DeckManager.killCardAt(deck, player.icard + 1);
        const killedInfo = newAction.param as KillInfo;
        killedInfo.removed[0] = player.icard;
        killedInfo.removed[1] = player.icard + 1;
        newAction.param = killedInfo;
        ReferenceManager.updateReference(DbReferences.GAME_deck, deck);
        player.isSpectating = true;
        player.coins = 0;
        ReferenceManager.updatePlayerReference(killedInfo.ownerId, player);
        return TransitionAction.Success;
    });
}