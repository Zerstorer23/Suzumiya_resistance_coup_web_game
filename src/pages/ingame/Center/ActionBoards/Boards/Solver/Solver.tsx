import { setMyTimer } from "pages/components/ui/MyTimer/MyTimer";
import { LocalContextType } from "system/context/localInfo/local-context";
import { RoomContextType } from "system/context/room-context";
import { DbReferences, ReferenceManager } from "system/Database/RoomDatabase";
import { WaitTime } from "system/GameConstants";
import { TurnState } from "system/GameStates/GameTypes";
import { BoardState } from "system/GameStates/States";
import { TurnManager } from "system/GameStates/TurnManager";
import { SolvingState } from "system/types/CommonTypes";

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
export function handleGetOne(ctx: RoomContextType, localCtx: LocalContextType) {
  const [myId, localPlayer] = TurnManager.getMyInfo(ctx, localCtx);
  localPlayer.coins++;
  ReferenceManager.updatePlayerReference(myId, localPlayer);
  console.log("Get one triggers wait");
  setMyTimer(localCtx, WaitTime.WaitConfirms, proceedTurn);
}
