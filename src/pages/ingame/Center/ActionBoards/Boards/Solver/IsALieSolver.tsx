import {BoardState, StateManager} from "system/GameStates/States";
import {GameManager} from "system/GameStates/GameManager";
import {RoomContextType} from "system/context/room-context";

export function pushIsALieState(ctx:RoomContextType, myId:string){
    const board = ctx.room.game.state.board;
    const gameAction = GameManager.copyGameAction(ctx.room.game.action);
    const newBoard = StateManager.getChallengedState(board);
    gameAction.challengerId = myId;
    if (newBoard === null) return;
    StateManager.createState(ctx.room.game.state, newBoard);
}