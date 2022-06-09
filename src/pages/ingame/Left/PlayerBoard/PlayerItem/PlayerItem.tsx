import HorizontalLayout from "pages/components/ui/HorizontalLayout";
import classes from "./PlayerItem.module.css";
import {IProps} from "system/types/CommonTypes";
import {Player} from "system/GameStates/GameTypes";
import {Fragment, useContext} from "react";
import LocalContext, {LocalField,} from "system/context/localInfo/local-context";
import RoomContext from "system/context/roomInfo/room-context";
import {TurnManager} from "system/GameStates/TurnManager";
import {DeckManager} from "system/cards/DeckManager";
import getImage, {Images} from "resources/Resources";
import {cardPool} from "system/cards/CardPool";
import {useTranslation} from "react-i18next";
import useAnimFocus, {AnimType} from "system/hooks/useAnimFocus";

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
    const coinCss = useAnimFocus(props.player.coins, AnimType.FadeIn);
    const cardCss = useAnimFocus(numAlive, AnimType.FadeIn);
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
        //My panel has highest priority and is unselectable
        panelColor = classes.isMe;
        subtitle = "_me";
    }

    const namePanelClass = subtitle !== null ? classes.namePanelWithTitle : classes.namePanel;

    return (
        <div className={`${classes.clickContainer}`}>
            <HorizontalLayout className={`${classes.container} ${panelColor}`}>
                <img
                    src={`${cardPool.get(props.player.lastClaimed).getImage()}`}
                    alt="lastUsd"
                    className={`${classes.characterIcon} ${claimCss}`}
                />
                <div className={`${classes.nameContainer}`}>
                    <p className={`${namePanelClass} `}>{props.player.name}</p>
                    <p className={`${classes.subtitle} `}>{subtitle === null ? "" : t(subtitle)}</p>
                </div>

                <div className={`${classes.iconPanel} ${cardCss}`}>
                    <img alt="" src={`${getImage(Images.Card)}`} className={classes.icon}/>
                    <p className={`${classes.iconText} `}>
                        {numAlive}
                    </p>
                </div>
                <div className={`${classes.iconPanel} ${coinCss}`}>
                    <img alt="" src={`${getImage(Images.Coin)}`} className={classes.icon}/>
                    <div className={classes.iconText}>{props.player.coins}</div>
                </div>
            </HorizontalLayout>
        </div>
    );
}
