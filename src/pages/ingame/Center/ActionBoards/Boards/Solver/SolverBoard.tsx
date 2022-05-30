import classes from "pages/ingame/Center/ActionBoards/BaseBoard/BaseBoard.module.css";
import WaitingBoard from "pages/ingame/Center/ActionBoards/BaseBoard/WaitingBoard";
import { useContext, useState } from "react";
import { useTimer } from "react-timer-hook";
import LocalContext, {
  LocalField,
} from "system/context/localInfo/local-context";
import RoomContext from "system/context/room-context";
import { DbReferences, ReferenceManager } from "system/Database/RoomDatabase";
import { GameManager } from "system/GameStates/GameManager";
import { TurnState } from "system/GameStates/GameTypes";
import { BoardState } from "system/GameStates/States";
import { TurnManager } from "system/GameStates/TurnManager";
import { TimerReturnType } from "system/types/CommonTypes";

/*
State Table
?PierAction-> [next state]
/Client Action->[next state]
Final - Accepted / Challenged
Called - 
[ChoosingBaseAction]
//None challengable
Get 1 : ?GetOne-> [GetOneAccepted : Solve Wait NextTurn]
Get 2 : ?GetTwo-> [CalledGetTwo: Wait] 
                  Unchanged-> Solve NextTurn
                  /Duke-> [DukeBlocks: Wait]
                          ?Accept->[DukeBlocksAccepted:Solve Wait NextTurn]
                          ?Lie->   [DukeBlocksChallenged: Solve Wait NextTurn]
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
function proceedTurn() {
  //Clear board and go to next turn
  const turnState: TurnState = {
    board: BoardState.ChoosingBaseAction,
    turn: TurnManager.getNextTurn(),
  };
  ReferenceManager.updateReference(DbReferences.GAME_state, turnState);
}
enum SolvingState {
  Init,
  Waiting,
  Solving,
}
export default function SolverBoard(): JSX.Element {
  //TODO change by board state
  //Do all the kills, coins, replace cards, next turn
  //Turn owner is responsible for this
  const ctx = useContext(RoomContext);
  const localCtx = useContext(LocalContext);
  const localPlayer = ctx.room.playerMap.get(localCtx.getVal(LocalField.Id))!;
  const isMyTurn = TurnManager.isMyTurn(ctx, localCtx);

  const expiryTimestamp = new Date();
  const [solvingState, setSolvingState] = useState<SolvingState>(
    SolvingState.Init
  );

  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + 600); // 10 minutes timer
  const timer: TimerReturnType = useTimer({
    expiryTimestamp,
    onExpire: () => console.warn("onExpire called"),
  });
  timer.start();
  const board = ctx.room.game.state.board;
  switch (board) {
    case BoardState.GetOneAccepted:
      //Push
      //Wait
      //Clear
      localPlayer.coins++;
      break;
    case BoardState.CalledGetTwo:
      break;
    case BoardState.DukeBlocksAccepted:
      break;
    case BoardState.DukeBlocksChallenged:
      break;
    case BoardState.CoupAccepted:
      break;
    case BoardState.CalledGetThree:
      break;
    case BoardState.GetThreeChallenged:
      break;
    case BoardState.AmbassadorAccepted:
      break;
    case BoardState.AmbassadorChallenged:
      break;
    case BoardState.CalledSteal:
      break;
    case BoardState.StealAccepted:
      break;
    case BoardState.StealChallenged:
      break;
    case BoardState.StealBlocked:
      break;
    case BoardState.StealBlockAccepted:
      break;
    case BoardState.StealBlockChallenged:
      break;
    case BoardState.CalledAssassinate:
      break;
    case BoardState.AssissinateAccepted:
      break;
    case BoardState.AssassinateChallenged:
      break;
    case BoardState.AssassinBlocked:
      break;
    case BoardState.ContessaChallenged:
      break;
    case BoardState.ContessaAccepted:
      break;
  }
  if (!isMyTurn) return <WaitingBoard />;
  return (
    <div className={classes.container}>
      <h1>Solve this Action?</h1>
    </div>
  );
}
