import {ChallengeState, GameAction, KillInfo, Player, TurnState,} from "system/GameStates/GameTypes";
import {GameManager} from "system/GameStates/GameManager";
import {playerClaimedRole} from "system/Database/RoomDatabase";
import {ActionType, BoardState, StateManager} from "system/GameStates/States";
import {TurnManager} from "system/GameStates/TurnManager";
import {CardRole} from "system/cards/Card";
import {RoomContextType} from "system/context/roomInfo/RoomContextProvider";
import {ChatFormat, sendChat} from "pages/components/ui/ChatModule/chatInfo/ChatContextProvider";
import {DbReferences, ReferenceManager} from "system/Database/ReferenceManager";


export enum TransitionAction {
    Success,
    Abort,
    EndTurn,
}

class _TransitionManager {

    /**
     * Do something and END
     * DO chanes in CHanger.
     * Return results TransitionAction
     */
    public prepareAndPushState(
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
    public prepareActionState(ctx: RoomContextType): [GameAction, TurnState] {
        const gameAction = GameManager.copyGameAction(ctx.room.game.action);
        return [gameAction, {...ctx.room.game.state}];
    }

    public handleAcceptOrLie(
        ctx: RoomContextType,
        action: ActionType,
        myId: string
    ): boolean {
        if (action === ActionType.IsALie) {
            this.pushIsALieState(ctx, myId);
            return true;
        }
        if (action === ActionType.Accept) {
            this.pushAcceptedState(ctx);
            return true;
        }
        return false;
    }

    public pushIsALieState(ctx: RoomContextType, challengerId: string) {
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

    public pushAcceptedState(ctx: RoomContextType) {
        this.prepareAndPushState(ctx, (newAction, newState) => {
            const board = StateManager.getAcceptedState(ctx.room.game.state.board);
            if (board === null) return TransitionAction.Abort;
            newState.board = board;
            return TransitionAction.Success;
        });
    }

    public pushCalledState(
        ctx: RoomContextType,
        action: ActionType,
        myId: string,
        myPlayer: Player,
        targetId = ""
    ) {
        this.prepareAndPushState(ctx, (newAction, newState) => {
            const newBoard = StateManager.getCalledState(action);
            if (newBoard === null) return TransitionAction.Abort;
            playerClaimedRole(myId, myPlayer, action);
            newState.board = newBoard;
            newAction.pierId = myId;
            newAction.targetId = targetId;
            console.log("New state = ", newState);
            if (newBoard === BoardState.CalledCoup) {
                newAction.param = GameManager.createKillInfo(ActionType.Coup, newBoard, targetId);
                this.payCost(ctx, newAction);
            }

            return TransitionAction.Success;
        });
    }

    public pushPrepareDiscarding(
        ctx: RoomContextType,
        killInfo: KillInfo,
    ) {
        this.prepareAndPushState(ctx, (newAction, newState) => {
            newState.board = BoardState.DiscardingCard;
            newAction.param = killInfo;
            this.payCost(ctx, newAction);
            return TransitionAction.Success;
        });
    }

    public pushEndGame(ctx: RoomContextType, winnerId: string) {
        const [newAction, newState] = this.prepareActionState(ctx);
        this.resetAction(newAction, winnerId);
        newState.board = BoardState.ChoosingBaseAction;
        newState.turn = -2;
        this.pushActionState(newAction, newState);
    }

    public pushEndTurn(ctx: RoomContextType) {
        this.prepareAndPushState(ctx, () => {
            return TransitionAction.EndTurn;
        });
    }

    private setEndTurn(ctx: RoomContextType, newAction: GameAction, newState: TurnState): boolean {
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
    private pushActionState(gameAction: GameAction, newState: TurnState) {
        ReferenceManager.updateReference(DbReferences.GAME_action, gameAction);
        ReferenceManager.updateReference(DbReferences.GAME_state, newState);
    }

    private inferLieCard(board: BoardState, action: GameAction): CardRole {
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
            case BoardState.StealBlocked:
                return action.param as CardRole;
        }
        return CardRole.None;
    }

    private payCost(ctx: RoomContextType, newAction: GameAction) {
        const killInfo = newAction.param as KillInfo;
        let cost = 0;
        if (killInfo.cause === ActionType.Coup) {
            cost = 7;
        } else if (killInfo.cause === ActionType.Assassinate) {
            cost = 3;
        }
        if (cost > 0) {
            const player = ctx.room.playerMap.get(newAction.pierId);
            if (player === undefined) return;
            player.coins -= cost;
            ReferenceManager.updatePlayerReference(newAction.pierId, player);
        }
    }

    private resetAction(newAction: GameAction, newPier: string) {
        newAction.param = "";
        newAction.pierId = newPier;
        newAction.challengerId = "";
        newAction.targetId = "";
    }
}

const TransitionManager = new _TransitionManager();
export default TransitionManager;