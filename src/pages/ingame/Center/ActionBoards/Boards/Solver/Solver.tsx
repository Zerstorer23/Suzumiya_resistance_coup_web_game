import { SolvingState } from "pages/ingame/Center/ActionBoards/Boards/Solver/SolverBoard";
import { LocalContextType } from "system/context/localInfo/local-context";
import { RoomContextType } from "system/context/room-context";
import { DbReferences, ReferenceManager } from "system/Database/RoomDatabase";
import { TurnState } from "system/GameStates/GameTypes";
import { BoardState, StateManager } from "system/GameStates/States";
import { TurnManager } from "system/GameStates/TurnManager";
import { isReturnStatement } from "typescript";
type StateSolverFunc = (state: SolvingState) => void;

const DEFAULT_NEXT_TURN_TEXT = <p>`Go to next turn...`</p>;
export function proceedTurn() {
  //Clear board and go to next turn
  const turnState: TurnState = {
    board: BoardState.ChoosingBaseAction,
    turn: TurnManager.getNextTurn(),
    //
  };
  ReferenceManager.updateReference(DbReferences.GAME_state, turnState);
}
/*
Coup  : ?Coup-> [CalledCoup: Wait]
                /Accept->[CoupAccepted :param, Solve Wait NextTurn]
//==Anyone can challenge
Duke  : ?GetThree->[CalledGetThree: Wait]
                   Unchanged->  Solve NextTurn
                  /Lie-> [GetThreeChallenged:Solve Wait NextTurn]
Ambassador: ?ChangeCards->[CalledChangeCards : Wait]
                          Unchallenged->[AmbassadorAccepted: Solve Wait NextTurn]
                          /Lie->        [AmbassadorChallenged: Solve Wait NextTurn]

Captain: ?Steal-> [CalledSteal:Wait]
                  /Accept->     [StealAccepted: Solve NextTurn]
                  /Lie->        [StealChallenged:Solve Wait NextTurn]
                  /Block;param->[StealBlocked: Wait]
                                ?Accept;param->[StealBlockedAccepted: Solve Wait NextTurn]
                                ?Lie;param->[StealBlockedChallenged: Solve Wait NextTurn]
Assassin: ?Assassin->[CalledAssassinate: Wait]
                      /Accept-> [AssissinateAccepted :Solve Wait NextTurn]
                      /Lie->    [AssassinateChallenged:Solve Wait NextTurn]
                      /Block->  [AssassinateChallengedWithContessa : Wait]
                                        ?Lie->[ContessaChallenged:Solve Wait NextTurn]
                                        ?Accept->[ContessaAccepted:Solve Wait NextTurn]
*/

//Get 1 : ?GetOne-> [GetOneAccepted : Solve Wait NextTurn]
export function handleGetOne(
  ctx: RoomContextType,
  localCtx: LocalContextType,
  state: SolvingState,
  setState: StateSolverFunc
) {
  const [myId, localPlayer] = TurnManager.getMyInfo(ctx, localCtx);
  switch (state) {
    case SolvingState.Init:
      localPlayer.coins++;
      ReferenceManager.updatePlayerReference(myId, localPlayer);
      setState(SolvingState.TriggerWait);
      break;
    case SolvingState.Finished:
      setState(SolvingState.Init);
      proceedTurn();
      return DEFAULT_NEXT_TURN_TEXT;
  }
}

/*
Get 2 : ?GetTwo-> [CalledGetTwo: Wait] 
                  Unchanged-> Solve NextTurn
                  /Duke-> [DukeBlocks: Wait]
                          ?Accept->[DukeBlocksAccepted:Solve Wait NextTurn]
                          ?Lie->   [DukeBlocksChallenged: Solve Wait NextTurn]
*/
export function handleGetTwo(
  ctx: RoomContextType,
  localCtx: LocalContextType,
  state: SolvingState,
  setState: StateSolverFunc
) {
  const [myId, localPlayer] = TurnManager.getMyInfo(ctx, localCtx);
  switch (state) {
    case SolvingState.Init:
      setState(SolvingState.TriggerWait);
      return (
        <p>{`${localPlayer.name} claimed Duke and will gain 2 coins... \n`}</p>
      );
    case SolvingState.Finished:
      //If unchanged.. proceed
      console.log("Finished Called");
      if (ctx.room.game.state.board === BoardState.CalledGetTwo) {
        console.log("Solve get two");
        localPlayer.coins += 2;
        ReferenceManager.updatePlayerReference(myId, localPlayer);
        setState(SolvingState.Init);
        proceedTurn();
      }
      return DEFAULT_NEXT_TURN_TEXT;
  }
  return <p>{`${localPlayer.name} gained 1 coin...`}</p>;
}
