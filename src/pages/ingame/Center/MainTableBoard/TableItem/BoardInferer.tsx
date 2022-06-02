import {RoomContextType} from "system/context/roomInfo/RoomContextProvider";
import {LocalContextType} from "system/context/localInfo/local-context";
import {TurnManager} from "system/GameStates/TurnManager";
import {Fragment} from "react";
import {CardPool} from "system/cards/CardPool";
import {CardRole} from "system/cards/Card";
import {ChallengeState, KillInfo, Player} from "system/GameStates/GameTypes";
import {BoardState, StateManager} from "system/GameStates/States";
import {createWaitingBoard, PostKillPanel} from "pages/ingame/Center/ActionBoards/Boards/Discard/DiscardPanels";
import * as ActionManager from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {TransitionAction} from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {DeckManager} from "system/cards/DeckManager";
import {DbReferences, ReferenceManager} from "system/Database/RoomDatabase";
import {DS} from "system/Debugger/DS";

const rejectionElem = (<Fragment>
    <br/>
    {`Any rejections?...`}
</Fragment>);

function claimElem(player: Player, role: string, desc: string): JSX.Element {
    return <Fragment>
        <p>{`${player.name} claimed `}</p>
        <strong>{role}</strong>
        {/*<br/>*/}
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


function ChallengeResultBoard(ctx: RoomContextType,
                              playerId: string,
                              amChallenger: boolean,
                              killInfo: KillInfo): JSX.Element {
    if (killInfo.ownerId === playerId) {
        //I lost
        if (amChallenger) {
            return (<Fragment>
                <p>{`${ctx.room.playerMap.get(playerId)!.name} will lose a card...`}</p>
            </Fragment>);
        } else {
            return (<Fragment>
                <p>{`${ctx.room.playerMap.get(playerId)!.name} does not have `}{CardPool.getCard(killInfo.card).getElemName()}</p>
                <p>{`${ctx.room.playerMap.get(playerId)!.name} will lose a card...`}</p>
            </Fragment>);
        }
    } else {
        //I won
        if (amChallenger) {
            return (<Fragment>
                <p>{`${ctx.room.playerMap.get(playerId)!.name} caught the lie!`}</p>
            </Fragment>);
        } else {
            return (<Fragment>
                <p>{`${ctx.room.playerMap.get(playerId)!.name} has `}{CardPool.getCard(killInfo.card).getElemName()}</p>
            </Fragment>);
        }

    }
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
    if (killInfo.nextState === ChallengeState.Notify) {
        return notifyChallengedElem(amChallenger, challenger!, susPlayer, susCard);
    } else {
        return ChallengeResultBoard(ctx, playerId, amChallenger, killInfo);
    }

}

function inferTargeted(
    ctx: RoomContextType,
    playerId: string,
    isMain: boolean
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
                    <br/>
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
                        <br/>
                        {rejectionElem}
                    </Fragment>);
            } else {
                return <Fragment>
                    <strong>{`${pier.name} is deciding what to do ...`}</strong>
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
        return (<Fragment>
            {`${pier!.name} is deciding if he wants to challenge it...`}
        </Fragment>);
    }
    switch (board) {
        case BoardState.CalledGetTwoBlocked:
            return claimElem(target!, CardPool.getCard(CardRole.Duke).getName(), " to block the foreign aid!");
        case BoardState.StealBlocked:
            return claimElem(target!, CardPool.getCard(action.param as CardRole).getName(), " to block steal!");
        case BoardState.AssassinBlocked:
            return claimElem(target!, CardPool.getCard(CardRole.Contessa).getName(), " to block assasination");
        default:
            return <Fragment/>;
    }
}


export function inferDiscardState(ctx: RoomContextType, playerId: string): JSX.Element {
    const killInfo: KillInfo = ctx.room.game.action.param as KillInfo;
    const cardSelected = killInfo.removed < 0;
    if (playerId === killInfo.ownerId) {
        if (cardSelected) {
            return (<Fragment>
                <p>{`${ctx.room.playerMap.get(playerId)} is choosing a card to discard...`}</p>
            </Fragment>);
        } else {
            return (<PostKillPanel/>);
        }
    } else {
        if (cardSelected) {
            const targetPlayer = ctx.room.playerMap.get(killInfo.ownerId)!;
            return (createWaitingBoard(targetPlayer));
        } else {
            return (<PostKillPanel/>);
        }
    }
}


export function handleCardKill(ctx: RoomContextType, index: number) {
    const deck = ctx.room.game.deck;
    DeckManager.killCardAt(deck, index);
    ActionManager.prepareAndPushState(ctx, (newAction, newState) => {
        const killedInfo = newAction.param as KillInfo;
        killedInfo.removed = index;
        newAction.param = killedInfo;
        ReferenceManager.updateReference(DbReferences.GAME_deck, deck);
        //TODO check if that was last card.
        const isDead = DeckManager.playerIsDead(deck, killedInfo.ownerId);
        if (isDead) {
            const player = ctx.room.playerMap.get(killedInfo.ownerId)!;
            player.isSpectating = true;
            player.coins = 0;
            ReferenceManager.updatePlayerReference(killedInfo.ownerId, player);
        }
        //If it was, set spectating on
        DS.logTransition("Removed card at " + index);
        DS.logTransition(newAction);
        return TransitionAction.Success;
    });
}

export function inferStateInfo(
    ctx: RoomContextType,
    localCtx: LocalContextType,
    playerId: string,
    isMain: boolean
): JSX.Element {
    const board = ctx.room.game.state.board;
    const player = ctx.room.playerMap.get(playerId);
    const [pier, target, challenger] = TurnManager.getShareholders(ctx);
    if (pier === null) return <Fragment/>;
    if (StateManager.isChallenged(board)) {
        return inferChallenged(ctx, playerId, isMain);
    }
    if (StateManager.isTargetableState(board)) {
        return inferTargeted(ctx, playerId, isMain);
    }
    if (StateManager.isBlockedState(board)) {
        return inferBlocked(ctx, playerId);
    }
    switch (board) {
        case BoardState.ChoosingBaseAction:
            return <Fragment>{`${pier.name} is choosing action ...`}</Fragment>;
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
                    {`${pier.name} accepted and receives nothing...`}
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
                return <p>{`${pier?.name} stole 2 coins from ${target?.name}`}</p>;
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
            break;
    }
    /**
     return <p>{`${localPlayer.name} gained 1 coin...`}</p>; */
    return <Fragment/>;
}
