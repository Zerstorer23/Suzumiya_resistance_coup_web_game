import {setMyTimer} from "pages/components/ui/MyTimer/MyTimer";
import {LocalContextType} from "system/context/localInfo/local-context";
import {BoardState} from "system/GameStates/States";
import {PlayerType, TurnManager} from "system/GameStates/TurnManager";
import TransitionManager, {TransitionAction} from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {RoomContextType} from "system/context/roomInfo/RoomContextProvider";
import {DbFields, PlayerDbFields, ReferenceManager} from "system/Database/ReferenceManager";
import {PlayerEntry} from "system/GameStates/GameTypes";
import {CardDeck, CardRole} from "system/cards/Card";
import {DeckManager} from "system/cards/DeckManager";

export function waitAndEnd(ctx: RoomContextType, localCtx: LocalContextType) {
    setMyTimer(ctx, localCtx, () => {
        TransitionManager.prepareAndPushState(ctx, (newAction, newState) => {
            return TransitionAction.EndTurn;
        });
    });
}


export function solveState(ctx: RoomContextType, localCtx: LocalContextType) {
    const board = ctx.room.game.state.board;
    switch (board) {
        case BoardState.GetOneAccepted:
            handleGetCoins(ctx, localCtx, true, 1);
            break;
        case BoardState.ForeignAidAccepted:
            handleGetCoins(ctx, localCtx, true, 2);
            break;
        case BoardState.GetThreeAccepted:
            handleGetCoins(ctx, localCtx, true, 3);
            break;
        case BoardState.StealAccepted:
            handleSteal(ctx, localCtx);
            break;
        case BoardState.DiscardingCard:
            break;
        case BoardState.ChoosingBaseAction:
            console.trace("Why solve this??");
            return;
        case BoardState.InquisitionAccepted:
            handleInquisition(ctx, localCtx);
            return;
        case BoardState.StealBlockAccepted:
        case BoardState.DukeBlocksAccepted:
        case BoardState.ContessaAccepted:
        default:
            waitAndEnd(ctx, localCtx);
            break;
    }
}

/*


Ambassador: ?ChangeCards->[CalledChangeCards : Wait]
                          Unchallenged->[AmbassadorAccepted: Solve Wait NextTurn]
                          /Lie->        [AmbassadorChallenged: Solve Wait NextTurn]
Assassin: ?Assassin->[CalledAssassinate: Wait]
                      /Accept-> [AssissinateAccepted :Solve Wait NextTurn]
                      /Lie->    [AssassinateChallenged:Solve Wait NextTurn]
                      /Block->  [AssassinateChallengedWithContessa : Wait]
                                        ?Lie->[ContessaChallenged:Solve Wait NextTurn]
                                        ?Accept->[ContessaAccepted:Solve Wait NextTurn]
*/

//Get 1 : ?GetOne-> [GetOneAccepted : Solve Wait NextTurn]
function handleGetCoins(ctx: RoomContextType, localCtx: LocalContextType, wait: boolean, amount: number) {
    const pierEntry = TurnManager.getPlayerInfo(ctx, PlayerType.Pier);
    if (wait) {
        setMyTimer(ctx, localCtx, () => {
            incrementCoins(ctx, pierEntry.id, amount);
        });
    } else {
        incrementCoins(ctx, pierEntry.id, amount);
    }
}

function incrementCoins(ctx: RoomContextType, playerId: string, amount: number) {
    TransitionManager.prepareAndPushState(ctx, () => {
        ReferenceManager.atomicDeltaByPlayerField(playerId, PlayerDbFields.PLAYER_coins, amount);
        return TransitionAction.EndTurn;
    });
}

/**
 * Captain: ?Steal-> [CalledSteal:Wait]
 /Accept->     [StealAccepted: Solve NextTurn]
 /Lie->        [StealChallenged:Solve Wait NextTurn]
 /Block;param->[StealBlocked: Wait]
 ?Accept;param->[StealBlockedAccepted: Solve Wait NextTurn]
 ?Lie;param->[StealBlockedChallenged: Solve Wait NextTurn]
 * @param ctx
 * @param localCtx
 */
/**
 * max +2
 * add to pier
 * take from target
 */
export function handleSteal(ctx: RoomContextType, localCtx: LocalContextType) {
    const pierEntry = TurnManager.getPlayerInfo(ctx, PlayerType.Pier);
    const targetEntry = TurnManager.getPlayerInfo(ctx, PlayerType.Target);
    setMyTimer(ctx, localCtx, () => {
        TransitionManager.prepareAndPushState(ctx, (newAction, newState) => {
            const stealAmount = Math.min(targetEntry.player.coins, 2);
            ReferenceManager.atomicDeltaByPlayerField(pierEntry.id, PlayerDbFields.PLAYER_coins, stealAmount);
            ReferenceManager.atomicDeltaByPlayerField(targetEntry.id, PlayerDbFields.PLAYER_coins, -stealAmount);
            return TransitionAction.EndTurn;
        });
    });

}

export function handleInquisition(ctx: RoomContextType, localCtx: LocalContextType) {
    const pierEntry = TurnManager.getPlayerInfo(ctx, PlayerType.Pier);
    const targetEntry = TurnManager.getPlayerInfo(ctx, PlayerType.Target);
    const deck = ctx.room.game.deck;
    setMyTimer(ctx, localCtx, () => {
        TransitionManager.prepareAndPushState(ctx, (newAction, newState) => {
            inquisiteTarget(ctx, targetEntry, deck);
            inquisitePier(ctx, pierEntry, deck);
            ReferenceManager.updateReference(DbFields.GAME_deck, deck);
            return TransitionAction.EndTurn;
        });
    });
}

export function inquisiteTarget(ctx: RoomContextType, entry: PlayerEntry, deck: CardDeck) {
    if (entry.player === null || entry.player === undefined) return;
    //If not alive, return
    if (DeckManager.playerIsDead(deck, entry.player)) return;
    //If alive, find kyon or random
    const index = DeckManager.getRandomFromPlayer(entry.player, deck, CardRole.Contessa);
    if (index === null) return;
    const randomDeckIndex = DeckManager.getRandomFromDeck(ctx);
    //swap
    console.log("Swapped Target");
    DeckManager.swap(index, randomDeckIndex, deck);
    // return deck no need though
    return deck;
}

export function inquisitePier(ctx: RoomContextType, entry: PlayerEntry, deck: CardDeck) {
    if (entry.player === null || entry.player === undefined) return;
    //If not alive, return
    if (DeckManager.playerIsDead(deck, entry.player)) return;
    //If alive, find mikuru
    const index = DeckManager.getRandomFromPlayer(entry.player, deck, CardRole.Inquisitor);
    if (index === null) return;
    //if mikuru no exist, return
    if (deck[index] !== CardRole.Inquisitor) return;
    const randomDeckIndex = DeckManager.getRandomFromDeck(ctx);
    //if mikuru exists , swap
    console.log("Swapped pier");
    DeckManager.swap(index, randomDeckIndex, deck);
    // return deck
    return deck;
}