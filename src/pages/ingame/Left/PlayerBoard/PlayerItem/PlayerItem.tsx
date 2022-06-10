import HorizontalLayout from "pages/components/ui/HorizontalLayout";
import classes from "./PlayerItem.module.css";
import {IProps} from "system/types/CommonTypes";
import {Player} from "system/GameStates/GameTypes";
import {Fragment, useContext} from "react";
import LocalContext, {LocalField,} from "system/context/localInfo/local-context";
import RoomContext from "system/context/roomInfo/room-context";
import {TurnManager} from "system/GameStates/TurnManager";
import {DeckManager} from "system/cards/DeckManager";
import {Images} from "resources/Resources";

import {useTranslation} from "react-i18next";
import useAnimFocus, {AnimType} from "system/hooks/useAnimFocus";
import gc from "global.module.css";
import ImageText from "pages/components/ui/ImageButton/ImageText";
import {Card} from "system/cards/Card";

type Props = IProps & {
    player: Player;
    playerId: string;
};
export default function PlayerItem(props: Props): JSX.Element {
    const localCtx = useContext(LocalContext);
    const ctx = useContext(RoomContext);
    const deck = ctx.room.game.deck;
    const {t} = useTranslation();
    const numAlive = DeckManager.playerAliveCardNum(deck, props.player.icard);
    const coinCss = useAnimFocus(props.player.coins, AnimType.ZoomInSmall);
    const cardCss = useAnimFocus(numAlive, AnimType.ZoomInSmall);
    const claimCss = useAnimFocus(props.player.lastClaimed, AnimType.SlideRight);

    if (props.player.isSpectating) return <Fragment/>;
    const currentTurnId = TurnManager.getCurrentPlayerId(ctx);
    const nextTurnId = TurnManager.getNextPlayerId(ctx);
    const isMe = props.playerId === localCtx.getVal(LocalField.Id);
    let panelColor = "";
    let subtitle = null;
    if (props.playerId === currentTurnId) {
        panelColor = classes.currentTurn;
        subtitle = "_this_turn";
    } else if (props.playerId === nextTurnId) {
        panelColor = classes.nextTurn;
        subtitle = "_next_turn";
    } else if (isMe) {
        panelColor = classes.isMe;
        subtitle = "_me";
    }

    const namePanelClass = subtitle !== null ? classes.namePanelWithTitle : classes.namePanel;

    return (
        <div className={`${classes.clickContainer}`}>
            <HorizontalLayout className={`${classes.container} ${gc.borderColor} ${panelColor}`}>
                <img
                    src={`${Card.getImage(props.player.lastClaimed)}`}
                    alt="lastUsd"
                    className={`${classes.characterIcon} ${claimCss}`}
                />
                <div className={`${classes.nameContainer}`}>
                    <p className={`${namePanelClass} `}>{props.player.name}</p>
                    <p className={`${classes.subtitle} `}>{subtitle === null ? "" : t(subtitle)}</p>
                </div>
                <ImageText image={Images.Card} className={cardCss}>
                    {numAlive}
                </ImageText>
                <ImageText image={Images.Coin} className={coinCss}>
                    {props.player.coins}
                </ImageText>
            </HorizontalLayout>
        </div>
    );
}
