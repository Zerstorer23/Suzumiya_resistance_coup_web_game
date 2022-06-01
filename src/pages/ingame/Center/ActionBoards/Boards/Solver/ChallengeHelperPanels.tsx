import {Fragment, useContext} from "react";
import {IProps} from "system/types/CommonTypes";
import {CardRole} from "system/cards/Card";
import {Player, RemovedCard} from "system/GameStates/GameTypes";
import RoomContext from "system/context/roomInfo/room-context";
import {DeckManager} from "system/cards/DeckManager";

export const preChallengeBoard = (
    <Fragment>
        <p>The cards will be revealed soon...</p>
    </Fragment>);

type KillProps = IProps & {
    info: RemovedCard;
}

export function PostKillPanel(props: KillProps): JSX.Element {
    const ctx = useContext(RoomContext);
    const player = ctx.room.playerMap.get(props.info.playerId)!;
    const cardRole = ctx.room.game.deck[props.info.idx];
    const isDead = DeckManager.playerIsDead(ctx.room.game.deck, props.info.playerId);
    return (
        <Fragment>
            <p>{`${player.name} discarded ${cardRole}`}</p>
            {isDead && <p>{`${player.name} is removed from game!`}</p>}
        </Fragment>);
}

type Props = IProps & {
    hasTheCard: boolean,
    susPlayer: Player,
    susCard: CardRole,
    loser: Player,
}

export function ChallengeResultBoard(props: Props): JSX.Element {
    if (props.hasTheCard) {
        return (<Fragment>
            <p>{`${props.susPlayer.name} has ${props.susCard}!`}</p>
            <br/>
            <p>{`${props.loser.name} will lose a card...`}</p>
        </Fragment>);
    } else {
        return (<Fragment>
            <p>{`${props.susPlayer.name} does not have ${props.susCard}!`}</p>
            <br/>
            <p>{`${props.loser.name} will lose a card...`}</p>
        </Fragment>);
    }
}