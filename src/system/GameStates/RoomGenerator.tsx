import {Game, GameAction, Player, PlayerMap, Room, RoomHeader, TurnState,} from "system/GameStates/GameTypes";
import "firebase/compat/database";
import {getRandomSeed} from "system/GameConstants";
import {BoardState} from "system/GameStates/States";
import {DeckManager} from "system/cards/DeckManager";
import {CardRole} from "system/cards/Card";
import {TurnManager} from "system/GameStates/TurnManager";
import {GameManager} from "system/GameStates/GameManager";
import {DS} from "system/Debugger/DS";
import {DbFields, ReferenceManager} from "system/Database/ReferenceManager";
import {GameConfigs} from "system/Debugger/GameConfigs";

export function getDefaultAction(): GameAction {
    return {
        pierId: "",
        targetId: "",
        challengerId: "",
        param: "",
    };
}

export function getDefaultGame(): Game {
    return {
        deck: [],
        state: {
            turn: -1,
            board: BoardState.ChoosingBaseAction,
        },
        action: getDefaultAction(),
    };
}

export function getDefaultHeader(): RoomHeader {
    return {
        hostId: "",
        seed: getRandomSeed(),
        games: GameConfigs.defaultGames,
        topIndex: -1,
        settings: {expansion: false},
    };
}

export function getDefaultRoom(): Room {
    return {
        playerMap: new Map<string, Player>(),
        playerList: [],
        game: getDefaultGame(),
        header: getDefaultHeader(),
    };
}

/**
 *
 * @param map
 * @returns Sorted list that is used for determining turns
 */
export function getSortedListFromMap(map: PlayerMap): string[] {
    const arr: string[] = [];
    map.forEach((_player, id) => {
        arr.push(id);
    });
    return arr.sort((e1: string, e2: string) =>
        e1 > e2 ? 1 : e1 < e2 ? -1 : 0
    );
}

/**
 *
 * Called by Player Panel to initialise the game start state
 * @param room
 */
export function setStartingRoom(room: Room) {
    //Set  , is uniform. send at once
    const newHeader = room.header;
    newHeader.seed = getRandomSeed();
    newHeader.topIndex = room.playerList.length * 2;
    ReferenceManager.updateReference(DbFields.HEADER, newHeader);
    //Set Players. is one by one uniform
    room.playerList.forEach((playerId, index) => {
        const player = room.playerMap.get(playerId)!;
        player.coins = (DS.abundantCoins) ? 7 : GameConfigs.startingCoins;
        player.icard = index * 2;
        player.isSpectating = false;
        player.isReady = false;
        player.lastClaimed = CardRole.None;
        ReferenceManager.updatePlayerReference(playerId, player);
    });
    //Set Room, is one by one
    const action = GameManager.createGameAction(room.playerList[newHeader.seed % room.playerList.length]);
    const deck: CardRole[] = DeckManager.generateStartingDeck(room);
    const state: TurnState = {
        turn: TurnManager.getFirstTurn(newHeader.seed, room.playerList.length),
        board: BoardState.ChoosingBaseAction
    };
    ReferenceManager.updateReference(DbFields.GAME_action, action);
    ReferenceManager.updateReference(DbFields.GAME_deck, deck);
    ReferenceManager.updateReference(DbFields.GAME_state, state);
}
