import {KillInfo, Player} from "system/GameStates/GameTypes";
import TransitionManager, {TransitionAction} from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {ActionType, BoardState} from "system/GameStates/States";
import {DeckManager} from "system/cards/DeckManager";
import {RoomContextType} from "system/context/roomInfo/RoomContextProvider";
import {ChatFormat, sendChat,} from "pages/components/ui/ChatModule/chatInfo/ChatContextProvider";
import {CardDeck} from "system/cards/Card";
import {insert} from "lang/i18nHelper";
import {DbFields, ReferenceManager} from "system/Database/ReferenceManager";

export function checkPostDiscarding(t: any, ctx: RoomContextType) {
    const killInfo = ctx.room.game.action.param as KillInfo;
    if (killInfo.removed === undefined) return;
    const nextBoard = killInfo.nextState as BoardState;
    const winnerId = DeckManager.checkGameOver(ctx);
    if (winnerId !== "") {
        sendChat(ChatFormat.important, "", t("_notify_game_end"));
        TransitionManager.pushEndGame(ctx, winnerId);
        return;
    }
    switch (nextBoard) {
        case BoardState.GetThreeAccepted:
        case BoardState.AmbassadorAccepted:
        case BoardState.StealAccepted:
        case BoardState.ForeignAidAccepted:
        case BoardState.InquisitionAccepted:
            TransitionManager.prepareAndPushState(ctx, (newAction, newState) => {
                newState.board = nextBoard;
                return TransitionAction.Success;
            });
            break;
        default:
            TransitionManager.prepareAndPushState(ctx, () => {
                return TransitionAction.EndTurn;
            });
            break;
    }
}

export function handleCardKill(t: any, ctx: RoomContextType, index: number) {
    const deck = ctx.room.game.deck;
    DeckManager.killCardAt(deck, index);
    TransitionManager.prepareAndPushState(ctx, (newAction, newState) => {
        const killInfo = newAction.param as KillInfo;
        const player = ctx.room.playerMap.get(killInfo.ownerId)!;
        killInfo.removed[0] = index;
        newAction.param = killInfo;
        handleDeadAnnounce(t, player, killInfo);
        ReferenceManager.updateReference(DbFields.GAME_deck, deck);
        handleDeadCase(t, deck, player, killInfo);
        newState.board = BoardState.DiscardingFinished;
        return TransitionAction.Success;
    });
}

function handleDeadCase(t: any, deck: CardDeck, player: Player, killInfo: KillInfo) {
    const isDead = DeckManager.playerIsDead(deck, player);
    if (!isDead) return;
    player.isSpectating = true;
    // player.coins = 0;
    ReferenceManager.updatePlayerReference(killInfo.ownerId, player);
    sendChat(ChatFormat.important, "", insert(t, "_notify_dead_player", player.name));
}

export function handleSuicide(t: any, ctx: RoomContextType, playerId: string) {
    const deck = ctx.room.game.deck;
    TransitionManager.prepareAndPushState(ctx, (newAction, newState) => {
        const player = ctx.room.playerMap.get(playerId)!;
        DeckManager.killCardAt(deck, player.icard);
        DeckManager.killCardAt(deck, player.icard + 1);
        const killedInfo = newAction.param as KillInfo;
        killedInfo.removed[0] = player.icard;
        killedInfo.removed[1] = player.icard + 1;
        newAction.param = killedInfo;
        sendChat(ChatFormat.important, "", insert(t, "_notify_suicide", player.name));
        ReferenceManager.updateReference(DbFields.GAME_deck, deck);
        player.isSpectating = true;
        // player.coins = 0;
        ReferenceManager.updatePlayerReference(killedInfo.ownerId, player);
        newState.board = BoardState.DiscardingFinished;
        return TransitionAction.Success;
    });
}

export function handleDeadAnnounce(t: any, player: Player, killInfo: KillInfo) {
    switch (killInfo.cause) {
        case ActionType.IsALie:
            sendChat(ChatFormat.important, "", insert(t, "_notify_death_lie", player.name));
            break;
        case ActionType.Assassinate:
            sendChat(ChatFormat.important, "", insert(t, "_notify_death_assassinate", player.name));
            break;
        case ActionType.Coup:
            sendChat(ChatFormat.important, "", insert(t, "_notify_death_coup", player.name));
            break;

    }

}