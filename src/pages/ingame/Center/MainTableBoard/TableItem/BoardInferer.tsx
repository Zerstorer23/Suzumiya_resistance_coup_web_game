import {RoomContextType} from "system/context/roomInfo/RoomContextProvider";
import {LocalContextType} from "system/context/localInfo/local-context";
import {TurnManager} from "system/GameStates/TurnManager";
import {Fragment} from "react";
import {CardPool} from "system/cards/CardPool";
import {CardRole} from "system/cards/Card";
import {ChallengeState, KillInfo, Player} from "system/GameStates/GameTypes";
import {BoardState, StateManager} from "system/GameStates/States";

const rejectionElem = (<Fragment>
    <br/>
    {`Any rejections?...`}
</Fragment>);

function claimElem(player: Player, role: string, desc: string): JSX.Element {
    return <Fragment>
        <p>{`${player.name} claimed `}</p>
        <strong>{role}</strong>
        <br/>
        <p>{desc}</p>
    </Fragment>;
}

function inferAccepted(
    board: BoardState,
    ctx: RoomContextType,
    localCtx: LocalContextType,
    isPier: boolean
): JSX.Element {
    const [pier, target, challenger] = TurnManager.getShareholders(ctx);
    if (pier === null) return <Fragment/>;
    switch (board) {
        case BoardState.GetOneAccepted:
            return claimElem(pier, "income", "will receive 1 coin...");
    }
    return <Fragment/>;
}

function notifyChallengedElem(amChallenger: boolean, challenger: Player, sus: Player, susCard: CardRole): JSX.Element {
    if (amChallenger) {
        return (
            <Fragment>
                <p>
                    {
                        `${challenger.name} does not think ${sus.name} has ${CardPool.getCard(susCard).getElemName()}!`
                    }
                </p>

            </Fragment>
        );
    } else {
        return <Fragment>
            <p>
                {`${sus.name} will reveal his cards to show ${CardPool.getCard(susCard).getElemName()}`}
            </p>
        </Fragment>;
    }
}


function ChallengeResultBoard(hasTheCard: boolean,
                              susPlayer: Player,
                              susCard: CardRole,
                              loser: Player,): JSX.Element {
    if (hasTheCard) {
        return (<Fragment>
            <p>{`${susPlayer.name} has ${susCard}!`}</p>
            <br/>
            <p>{`${loser.name} will lose a card...`}</p>
        </Fragment>);
    } else {
        return (<Fragment>
            <p>{`${susPlayer.name} does not have ${susCard}!`}</p>
            <br/>
            <p>{`${loser.name} will lose a card...`}</p>
        </Fragment>);
    }
}

function inferChallenged(
    board: BoardState,
    ctx: RoomContextType,
    localCtx: LocalContextType,
    isPier: boolean
): JSX.Element {
    const [pier, target, challenger] = TurnManager.getShareholders(ctx);
    if (pier === null || challenger === null) return <Fragment/>;
    const action = ctx.room.game.action;
    const killInfo: KillInfo = action.param as KillInfo;
    let amChallenger = isPier;
    let susPlayer = pier;
    let susCard = killInfo.card;
    if (StateManager.targetIsChallenged(board)) {
        amChallenger = !isPier;
        susPlayer = target!;
    }
    if (killInfo.nextState === ChallengeState.Notify) {
        return notifyChallengedElem(amChallenger, challenger!, susPlayer, susCard);
    } else {
        //TODO
        return <Fragment/>;
    }

}

function inferCalled(
    board: BoardState,
    ctx: RoomContextType,
    localCtx: LocalContextType,
    isPier: boolean
): JSX.Element {
    const [pier, target, challenger] = TurnManager.getShareholders(ctx);
    if (pier === null) return <Fragment/>;
    return <Fragment/>;
}

function inferAny(
    board: BoardState,
    ctx: RoomContextType,
    localCtx: LocalContextType,
    isPier: boolean
): JSX.Element {
    const [pier, target, challenger] = TurnManager.getShareholders(ctx);
    if (pier === null) return <Fragment/>;
    return <Fragment/>;
}


export function inferStateInfo(
    ctx: RoomContextType,
    localCtx: LocalContextType,
    isPier: boolean
): JSX.Element {
    const board = ctx.room.game.state.board;
    const [pier, target, challenger] = TurnManager.getShareholders(ctx);
    if (pier === null) return <Fragment/>;
    if (StateManager.isChallenged(board)) {
        return inferChallenged(board, ctx, localCtx, isPier);
    }
    if (StateManager.isBlockedState(board)) {
        return inferChallenged(board, ctx, localCtx, isPier);
    }
    if (StateManager.isTargetableState(board)) {
        return inferChallenged(board, ctx, localCtx, isPier);
    }
    if (StateManager.isCounterable(board)) {
        return inferChallenged(board, ctx, localCtx, isPier);
    }
    if (StateManager.isFinal(board)) {
        return inferChallenged(board, ctx, localCtx, isPier);
    }
    switch (board) {
        case BoardState.ChoosingBaseAction:
            return <Fragment>{`${pier.name} is choosing action ...`}</Fragment>;

        case BoardState.CalledGetTwo:
            return (
                <Fragment>
                    {`${pier.name} claimed `}
                    <strong>foriegn aid</strong>

                </Fragment>
            );
        case BoardState.CalledGetTwoBlocked:
            return isPier ? (
                <Fragment>
                    {`${pier.name} is deciding if he wants to challenge it...`}
                </Fragment>
            ) : (
                <Fragment>
                    {`${target?.name} claimed `}
                    <strong>Duke</strong>
                    {`to block the foreign aid!`}
                </Fragment>
            );

        case BoardState.DukeBlocksAccepted:
            return isPier ? (
                <Fragment>
                    {`${pier.name} accepted Duke and receives nothing...`}
                </Fragment>
            ) : (
                <Fragment>
                    {`${challenger?.name} claimed `}
                    <strong>Duke</strong>{" "}
                    {`to block the
           foreign aid!`}
                </Fragment>
            );

        case BoardState.CalledCoup:
            return (
                <Fragment>
                    {isPier
                        ? `${pier.name}${(<strong>Coup</strong>)}  ${target?.name}!`
                        : `${target?.name} is choosing a card to discard...`}
                </Fragment>
            );

        case BoardState.CalledGetThree:
            return (
                <Fragment>
                    {isPier
                        ? `${pier.name} claimed ${CardPool.getCard(CardRole.Duke).getElemName()} to get 3 coins
        ${<br/>}`
                        : `${target?.name} is choosing a card to discard...`}
                </Fragment>
            );
            break;
        case BoardState.GetThreeChallenged:
            break;
        case BoardState.CalledChangeCards:
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
        case BoardState.AssassinateChallenged:
            break;
        case BoardState.AssassinBlocked:
            break;
        case BoardState.ContessaChallenged:
            break;
        case BoardState.ContessaAccepted:
            break;
        case BoardState.DiscardingCard:
            break;
    }
    /**
     return <p>{`${localPlayer.name} gained 1 coin...`}</p>; */
    return <Fragment/>;
}
