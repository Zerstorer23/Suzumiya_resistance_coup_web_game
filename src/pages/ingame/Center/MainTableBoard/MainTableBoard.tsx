import VerticalLayout from "pages/components/ui/VerticalLayout";
import TableItem from "pages/ingame/Center/MainTableBoard/TableItem/TableItem";
import gc from "global.module.css";
import classes from "./MainTableBoard.module.css";
import {MyTimer} from "pages/components/ui/MyTimer/MyTimer";
import {Player} from "system/GameStates/GameTypes";
import {useContext} from "react";
import RoomContext from "system/context/roomInfo/room-context";
import LocalContext, {LocalContextType} from "system/context/localInfo/local-context";
import {BoardState, StateManager} from "system/GameStates/States";
import {RoomContextType} from "system/context/roomInfo/RoomContextProvider";
import {TurnManager} from "system/GameStates/TurnManager";

export default function MainTableBoard(): JSX.Element {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const mainPlayer: Player = getMainPlayerFromState(ctx);
    const subPlayer: Player | null = getMainPlayerFromState(ctx);

    return (
        <div className={`${gc.round_border} ${classes.container}`}>
            <VerticalLayout>
                <p className={classes.textSideAction}>
                    <MyTimer/> seconds remaining...
                </p>
                <TableItem className={classes.topContainer} player={mainPlayer}/>
                <TableItem player={subPlayer}/>
            </VerticalLayout>
        </div>
    );
}

export function getMainPlayerFromState(ctx: RoomContextType): Player {
    const board = ctx.room.game.state.board;
    const [pier, target, challenger] = TurnManager.getShareholders(ctx);
    if (board === BoardState.ChoosingBaseAction)
        return pier!;
    // return TurnManager.getCurrentPlayerId(ctx);
    if (StateManager.targetIsChallenged(board))
        return target!;
    return pier!;
}

export function getSubPlayerFromState(ctx: RoomContextType, localCtx: LocalContextType,) {
    const board = ctx.room.game.state.board;
    const [pier, target, challenger] = TurnManager.getShareholders(ctx);
    switch (board) {
        case BoardState.ChoosingBaseAction:
            return pier!;
        //  return TurnManager.getCurrentPlayerId(ctx);
        case BoardState.GetOneAccepted:
        case BoardState.CalledGetTwo:
        case BoardState.ForeignAidAccepted:
        case BoardState.CalledGetTwoBlocked:
        case BoardState.DukeBlocksAccepted:
        case BoardState.CalledCoup:
        case BoardState.CalledGetThree:
        case BoardState.GetThreeAccepted:
        case BoardState.CalledChangeCards:
        case BoardState.AmbassadorAccepted:
        case BoardState.AmbassadorChallenged:
        case BoardState.GetThreeChallenged:
        case BoardState.CalledSteal:
        case BoardState.StealAccepted:
        case BoardState.StealChallenged:
        case BoardState.StealBlocked:
        case BoardState.StealBlockAccepted:
        case BoardState.CalledAssassinate:
        case BoardState.AssassinateChallenged:
        case BoardState.AssassinBlocked:
        case BoardState.ContessaAccepted:
        case BoardState.DiscardingCard:
            return pier;
            break;
        case BoardState.DukeBlocksChallenged:
        case BoardState.StealBlockChallenged:
        case BoardState.ContessaChallenged:
            return target!;
    }

}
