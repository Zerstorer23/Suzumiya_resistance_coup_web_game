import {RoomContextType} from "system/context/roomInfo/RoomContextProvider";
import {LocalContextType} from "system/context/localInfo/local-context";
import {TurnManager} from "system/GameStates/TurnManager";
import {Fragment} from "react";
import {CardPool} from "system/cards/CardPool";
import {CardRole} from "system/cards/Card";
import {KillInfo, Player} from "system/GameStates/GameTypes";
import {BoardState, StateManager} from "system/GameStates/States";
import {PostKillPanel} from "pages/ingame/Center/ActionBoards/Boards/Discard/DiscardPanels";

export function inferStateInfo(
    ctx: RoomContextType,
    localCtx: LocalContextType,
    playerId: string,
    isMain: boolean
): JSX.Element {
    const board = ctx.room.game.state.board;
    const [pier, target] = TurnManager.getShareholders(ctx);
    if (pier === null) return <Fragment/>;
    if (StateManager.isChallenged(board)) {
        return inferChallenged(ctx, playerId, isMain);
    }
    if (StateManager.isTargetableState(board)) {
        return inferTargeted(ctx, playerId);
    }
    if (StateManager.isBlockedState(board)) {
        return inferBlocked(ctx, playerId);
    }
    switch (board) {
        case BoardState.ChoosingBaseAction:
            return <Fragment><p>{`${pier.name} is choosing action ...`}</p></Fragment>;
        case BoardState.GetOneAccepted:
            return claimElem(pier, "income", "will receive 1 coin...");
        case BoardState.ForeignAidAccepted:
            return claimElem(pier, "foreign aid", " received 2 coins...");
        case BoardState.GetThreeAccepted:
            return claimElem(pier, CardPool.getCard(CardRole.Duke).getName(), " will receive 3 coins...");
        case BoardState.CalledChangeCards:
            return <Fragment>
                {claimElem(pier, CardPool.getCard(CardRole.Ambassador).getName(), " will change cards...")}
                {rejectionElem}
            </Fragment>;
        case BoardState.CalledGetTwo:
            return (
                <Fragment>
                    {claimElem(pier, "foreign aid to get 2 coins", "")}
                    {rejectionElem}
                </Fragment>
            );
        case BoardState.DukeBlocksAccepted:
            return isMain ? (
                <Fragment>
                    <p>
                        {`${pier.name} accepted and receives nothing...`}
                    </p>
                </Fragment>
            ) : (
                <Fragment>
                    {claimElem(target!, CardPool.getCard(CardRole.Duke).getName(), " to block foreign aid.")}
                </Fragment>
            );
        case BoardState.CalledGetThree:
            return (
                <Fragment>
                    {claimElem(pier!, CardPool.getCard(CardRole.Duke).getName(), " to get 3 coins.")}
                    {rejectionElem}
                </Fragment>
            );
        case BoardState.AmbassadorAccepted:
            return (
                <Fragment>
                    <p>{`${pier!.name} is changing cards...`}</p>
                </Fragment>
            );
        case BoardState.StealAccepted:
            if (isMain) {
                return <p>{`${pier?.name} stole ${Math.min(target!.coins, 2)} coins from ${target?.name}`}</p>;
            } else {
                return <p>{`${target?.name} is robbed!`}</p>;
            }
        case BoardState.StealBlockAccepted:
            if (isMain) {
                return <p>{`${pier?.name} accepted. Will not steal anything.`}</p>;
            } else {
                return <p>{`${target?.name} is safe!`}</p>;
            }
        case BoardState.ContessaAccepted:
            if (isMain) {
                return <p>{`${pier?.name} accepted. Will not kill anyone.`}</p>;
            } else {
                return <p>{`${target?.name} is safe!`}</p>;
            }
        case BoardState.DiscardingCard:
            return inferDiscardState(ctx, playerId);
    }
    /**
     return <p>{`${localPlayer.name} gained 1 coin...`}</p>; */
    return <Fragment/>;
}

const rejectionElem = (<Fragment>
    <br/>
    <p>{`Any rejections?...`}</p>
</Fragment>);

function claimElem(player: Player, role: string, desc: string): JSX.Element {
    return <Fragment>
        <p>{`${player.name} claimed `}</p>
        <strong>{role}</strong>
        <p>{desc}</p>
    </Fragment>;
}


function notifyChallengedElem(amChallenger: boolean, challenger: Player, sus: Player, susCard: CardRole): JSX.Element {
    if (amChallenger) {
        return (
            <Fragment>
                <p>
                    {
                        `${challenger.name} does not think ${sus.name} has `
                    }{
                    CardPool.getCard(susCard).getElemName()
                }
                </p>

            </Fragment>
        );
    } else {
        return <Fragment>
            <p>
                {`${sus.name} will reveal his cards to show `}{
                CardPool.getCard(susCard).getElemName()
            }
            </p>
        </Fragment>;
    }
}


function ChallengeResultBoard(
    myPlayer: Player,
    playerId: string,
    challengerId: string,
    killInfo: KillInfo): JSX.Element {
    const iLost = killInfo.ownerId === playerId;
    const iChallenged = playerId === challengerId;
    const susCard = CardPool.getCard(killInfo.card);
    if (iLost) {
        if (iChallenged) {//I lost because I challenged wrong
            return (<Fragment>
                <p>{`${myPlayer.name} will lose a card...`}</p>
            </Fragment>);
        }
        //I lost because I was challenged and didn't have card.
        return (<Fragment>
            <p>{`${myPlayer.name} does not have `}{susCard.getElemName()}</p>
            <p>{`${myPlayer.name} will lose a card...`}</p>
        </Fragment>);
    }
    //I won and I challenged correctly
    if (iChallenged) {
        return (<Fragment>
            <p>{`${myPlayer.name} caught the lie!`}</p>
        </Fragment>);
    }
    //I won and I was challenged and I had card
    return (<Fragment>
        <p>{`${myPlayer.name} has `}{susCard.getElemName()}</p>
    </Fragment>);
}

function inferChallenged(
    ctx: RoomContextType,
    playerId: string,
    isMain: boolean
): JSX.Element {
    const board = ctx.room.game.state.board;
    const [pier, target, challenger] = TurnManager.getShareholders(ctx);
    if (pier === null || challenger === null) return <Fragment/>;
    const action = ctx.room.game.action;
    const killInfo: KillInfo = action.param as KillInfo;
    let amChallenger = isMain;
    let susPlayer = pier;
    let susCard = killInfo.card;
    if (StateManager.targetIsChallenged(board)) {
        amChallenger = !isMain;
        susPlayer = target!;
    }
    return notifyChallengedElem(amChallenger, challenger!, susPlayer, susCard);
    /*    if (killInfo.nextState === ChallengeState.Notify) {
            return notifyChallengedElem(amChallenger, challenger!, susPlayer, susCard);
        } else {
            return ChallengeResultBoard(ctx, playerId, amChallenger, killInfo);
        }*/

}

function inferTargeted(
    ctx: RoomContextType,
    playerId: string
): JSX.Element {
    const board = ctx.room.game.state.board;
    const action = ctx.room.game.action;
    const [pier, target] = TurnManager.getShareholders(ctx);
    if (pier === null || target === null) return <Fragment/>;
    const isPier = playerId === action.pierId;
    switch (board) {
        case BoardState.CalledCoup:
            if (isPier) {
                return <Fragment>
                    <p>{`${pier.name} killed ${target.name} with `}</p>
                    <strong>Coup</strong>
                </Fragment>;
            } else {
                return <Fragment>
                    <strong>{`${pier.name} is in trouble ...`}</strong>
                </Fragment>;
            }
        case BoardState.CalledSteal:
            if (isPier) {
                return <Fragment>
                    <p>{`${pier.name} claims ${CardPool.getCard(CardRole.Captain).getName()} to steal 2 coins from ${target.name}`}</p>
                    {rejectionElem}
                </Fragment>;
            } else {
                return <Fragment>
                    <strong>{`${pier.name} is deciding what to do ...`}</strong>
                </Fragment>;
            }

        case BoardState.CalledAssassinate:
            if (isPier) {
                return (
                    <Fragment>
                        <p>{`${pier.name} claims ${CardPool.getCard(CardRole.Assassin).getName()} to kill ${target.name}`}</p>
                        {rejectionElem}
                    </Fragment>);
            } else {
                return <Fragment>
                    <p>{`${pier.name} is deciding what to do ...`}</p>
                </Fragment>;
            }
        default:
            return <Fragment/>;
    }
}

function inferBlocked(
    ctx: RoomContextType,
    playerId: string,
): JSX.Element {
    const board = ctx.room.game.state.board;
    const action = ctx.room.game.action;
    const [pier, target] = TurnManager.getShareholders(ctx);
    if (playerId === action.pierId) {
        return (<Fragment><p>
            {`${pier!.name} is deciding if he wants to challenge it...`}
        </p>
        </Fragment>);
    }
    switch (board) {
        case BoardState.CalledGetTwoBlocked:
            return claimElem(target!, CardPool.getCard(CardRole.Duke).getName(), " to block the foreign aid!");
        case BoardState.StealBlocked:
            return claimElem(target!, CardPool.getCard(action.param as CardRole).getName(), " to block steal!");
        case BoardState.AssassinBlocked:
            return claimElem(target!, CardPool.getCard(CardRole.Contessa).getName(), " to block assassination");
        default:
            return <Fragment/>;
    }
}


export function inferDiscardState(ctx: RoomContextType, playerId: string): JSX.Element {
    const action = ctx.room.game.action;
    const killInfo: KillInfo = action.param as KillInfo;
    const cardSelected = killInfo.removed >= 0;
    if (cardSelected) {
        if (playerId === killInfo.ownerId) {
            return (<PostKillPanel/>);
        } else {
            return (<p> is satisfied.</p>);
        }
    } else {
        const myPlayer = ctx.room.playerMap.get(playerId)!;
        const lostPlayer = ctx.room.playerMap.get(killInfo.ownerId)!;
        if (killInfo.card.length > 0) {
            return ChallengeResultBoard(myPlayer, playerId, action.challengerId, killInfo);
        } else {
            //Coup or assassin
            if (playerId === killInfo.ownerId) {
                return <p>{`${myPlayer.name} is choosing a card to discard...`}</p>;
            } else {
                return <p>{`Waiting for ${lostPlayer.name} to remove card.`}</p>;
            }
        }
    }

}


