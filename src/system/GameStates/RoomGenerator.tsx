import {Game, GameAction, Player, PlayerMap, Room, RoomHeader, TurnState,} from "system/GameStates/GameTypes";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import {getRandomSeed} from "system/GameConstants";
import {BoardState} from "system/GameStates/States";
import {DbReferences, ReferenceManager} from "system/Database/RoomDatabase";
import {DeckManager} from "system/cards/DeckManager";
import {CardRole} from "system/cards/Card";
import {TurnManager} from "system/GameStates/TurnManager";
import {GameManager} from "system/GameStates/GameManager";

export function getDefaultAction(): GameAction {
    return {
        pierId: "",
        targetId: "",
        challengerId: "",
        param: "",
        time: firebase.database.ServerValue.TIMESTAMP,
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
    const numPlayer = room.playerMap.size;
    const seed = getRandomSeed();
    //Set Header
    ReferenceManager.updateReference(DbReferences.HEADER_seed, seed);
    //Set Player Cards
    room.playerList.forEach((playerId, index) => {
        const player = room.playerMap.get(playerId)!;
        player.coins = 2;
        player.icard = index * 2;
        player.isSpectating = false;
        ReferenceManager.updatePlayerReference(playerId, player);
    });
    //Set Room
    const action = GameManager.createGameAction(room.playerList[seed % room.playerList.length]);
    ReferenceManager.updateReference(DbReferences.GAME_action, action);
    const deck: CardRole[] = DeckManager.generateStartingDeck(numPlayer);
    const state: TurnState = {
        turn: TurnManager.getFirstTurn(seed, room.playerList.length),
        board: BoardState.ChoosingBaseAction
    };
    ReferenceManager.updateReference(DbReferences.GAME_deck, deck);
    ReferenceManager.updateReference(DbReferences.GAME_state, state);
}
