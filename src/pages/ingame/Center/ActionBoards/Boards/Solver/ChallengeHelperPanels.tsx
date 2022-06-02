import {Fragment} from "react";
import {IProps} from "system/types/CommonTypes";
import {CardRole} from "system/cards/Card";
import {Player} from "system/GameStates/GameTypes";

export const preChallengeBoard = (
    <Fragment>
        <p>The cards will be revealed soon...</p>
    </Fragment>);


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

