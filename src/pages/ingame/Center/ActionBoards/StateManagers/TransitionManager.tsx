import {ChallengeState, GameAction, KillInfo, PlayerEntry, TurnState,} from "system/GameStates/GameTypes";
import {GameManager} from "system/GameStates/GameManager";
import {playerClaimedRole} from "system/Database/RoomDatabase";
import {ActionType, BoardState, StateManager} from "system/GameStates/States";
import {TurnManager} from "system/GameStates/TurnManager";
import {CardRole} from "system/cards/Card";
import {RoomContextType} from "system/context/roomInfo/RoomContextProvider";
import {ChatFormat, sendChat} from "pages/components/ui/ChatModule/chatInfo/ChatContextProvider";
import {DbFields, ReferenceManager} from "system/Database/ReferenceManager";


export enum TransitionAction {
    Success,
    Abort,
    EndTurn,
}

export default class TransitionManager {

    /**
     * Do something and END
     * DO chanes in CHanger.
     * Return results TransitionAction
     */
    public static prepareAndPushState(
        ctx: RoomContextType,
        changer: (newAction: GameAction, newState: TurnState) => TransitionAction
    ) {
        const [newAction, newState] = this.prepareActionState(ctx);
        const result = changer(newAction, newState);
        if (result === TransitionAction.Abort) {
            console.trace("Aborted state");
            return;
        }
        console.log("Next state " + newState.board);
        if (result === TransitionAction.EndTurn) {
            const res = this.setEndTurn(ctx, newAction, newState);
            if (!res) return;

            const nextPlayer = ctx.room.playerMap.get(ctx.room.playerList[newState.turn]);
            if (nextPlayer !== undefined) {
                sendChat(ChatFormat.announcement, "", `${nextPlayer.name}님의 턴`);
            }
        }
        this.pushActionState(newAction, newState);
    }

    /**
     * Prepares varialbes for puhsing new action
     * */
    public static prepareActionState(ctx: RoomContextType): [GameAction, TurnState] {
        const gameAction = GameManager.copyGameAction(ctx.room.game.action);
        return [gameAction, {...ctx.room.game.state}];
    }

    public static pushIsALieState(ctx: RoomContextType, challengerId: string) {
        this.prepareAndPushState(ctx, (newAction, newState) => {
            const board = StateManager.getChallengedState(ctx.room.game.state.board);
            if (board === null) return TransitionAction.Abort;
            newState.board = board;
            newAction.challengerId = challengerId;
            const susCard = this.inferLieCard(ctx.room.game.state.board, newAction);
            if (susCard === CardRole.None) return TransitionAction.Abort;
            //We dont know who target is yet.
            const killInfo = GameManager.createKillInfo(ActionType.IsALie, board, "");
            killInfo.challengedCard = susCard;
            killInfo.nextState = ChallengeState.Notify;
            newAction.param = killInfo;
            return TransitionAction.Success;
        });
    }

    /**
     * Only use for ACTUAL ACCEPTED state
     * @param ctx
     */

    public static pushAcceptedState(ctx: RoomContextType) {
        this.prepareAndPushState(ctx, (newAction, newState) => {
            const board = StateManager.getAcceptedState(ctx.room.game.state.board);
            if (board === null) return TransitionAction.Abort;
            newState.board = board;
            return TransitionAction.Success;
        });
    }

    public static pushCalledState(
        ctx: RoomContextType,
        action: ActionType,
        playerEntry: PlayerEntry,
        targetId = ""
    ) {
        this.prepareAndPushState(ctx, (newAction, newState) => {
            const newBoard = StateManager.getCalledState(action);
            if (newBoard === null) return TransitionAction.Abort;
            playerClaimedRole(playerEntry, action);
            newState.board = newBoard;
            newAction.pierId = playerEntry.id;
            newAction.targetId = targetId;
            console.log("New state = ", newState);
            this.payCost(playerEntry, action);
            if (newBoard === BoardState.CalledCoup) {
                newAction.param = GameManager.createKillInfo(ActionType.Coup, newBoard, targetId);
            }

            return TransitionAction.Success;
        });
    }

    public static pushPrepareDiscarding(
        ctx: RoomContextType,
        killInfo: KillInfo,
    ) {
        this.prepareAndPushState(ctx, (newAction, newState) => {
            newState.board = BoardState.DiscardingCard;
            newAction.param = killInfo;
            return TransitionAction.Success;
        });
    }

    public static pushEndGame(ctx: RoomContextType, winnerId: string) {
        const [newAction, newState] = this.prepareActionState(ctx);
        this.resetAction(newAction, winnerId);
        newState.board = BoardState.ChoosingBaseAction;
        newState.turn = -2;
        this.pushActionState(newAction, newState);
    }

    public static pushEndTurn(ctx: RoomContextType) {
        this.prepareAndPushState(ctx, () => {
            return TransitionAction.EndTurn;
        });
    }

    public static pushLobby(numGames: number) {
        const state: TurnState = {turn: -1, board: 0,};
        ReferenceManager.atomicDelta(DbFields.HEADER_games, -1);
        ReferenceManager.updateReference(DbFields.GAME_state, state);
    }

    public static handleAcceptOrLie(
        ctx: RoomContextType,
        action: ActionType,
        myId: string
    ): boolean {
        if (action === ActionType.IsALie) {
            TransitionManager.pushIsALieState(ctx, myId);
            return true;
        }
        if (action === ActionType.Accept) {
            TransitionManager.pushAcceptedState(ctx);
            return true;
        }
        return false;
    }

    private static setEndTurn(ctx: RoomContextType, newAction: GameAction, newState: TurnState): boolean {
        console.log(`END TURN prev state = ${newState.board} / t ${newState.turn}`);
        newState.board = BoardState.ChoosingBaseAction;
        newState.turn = TurnManager.getNextTurn(
            ctx.room.playerMap,
            ctx.room.playerList,
            newState.turn
        );
        this.resetAction(newAction, ctx.room.playerList[newState.turn]);
        console.log(`next turn state = ${newState.board} / t ${newState.turn} / ${newAction.pierId}`);
        return true;
    }

    /**
     * Call this to apply action to DB
     */
    private static pushActionState(gameAction: GameAction, newState: TurnState) {
        ReferenceManager.updateReference(DbFields.GAME_action, gameAction);
        ReferenceManager.updateReference(DbFields.GAME_state, newState);
    }

    private static inferLieCard(board: BoardState, action: GameAction): CardRole {
        switch (board) {
            case BoardState.CalledGetTwoBlocked:
            case BoardState.CalledGetThree:
                return CardRole.Duke;
            case BoardState.CalledChangeCards:
                return CardRole.Ambassador;
            case BoardState.CalledSteal:
                return CardRole.Captain;
            case BoardState.CalledAssassinate:
                return CardRole.Assassin;
            case BoardState.AssassinBlocked:
                return CardRole.Contessa;
            case BoardState.CalledInquisition:
                return CardRole.Inquisitor;
            case BoardState.StealBlocked:
                return action.param as CardRole;
        }
        return CardRole.None;
    }

    private static payCost(playerEntry: PlayerEntry, action: ActionType) {
        let cost = 0;
        if (action === ActionType.Coup) {
            cost = 7;
        } else if (action === ActionType.Assassinate) {
            cost = 3;
        }
        if (cost === 0) return;
        if (playerEntry.player === undefined) return;
        playerEntry.player.coins -= cost;
        ReferenceManager.updatePlayerReference(playerEntry.id, playerEntry.player);
    }

    private static resetAction(newAction: GameAction, newPier: string) {
        newAction.param = "";
        newAction.pierId = newPier;
        newAction.challengerId = "";
        newAction.targetId = "";
    }
}
