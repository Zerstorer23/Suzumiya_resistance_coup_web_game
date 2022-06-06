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
import {CardPool} from "system/cards/CardPool";
import {useTranslation} from "react-i18next";

type Props = IProps & {
    player: Player;
    playerId: string;
};
export default function PlayerItem(props: Props): JSX.Element {
    const localCtx = useContext(LocalContext);
    const ctx = useContext(RoomContext);
    const deck = ctx.room.game.deck;
    const {t} = useTranslation();
    if (props.player.isSpectating) return <Fragment/>;
    const currentTurnId = TurnManager.getCurrentPlayerId(ctx);
    const nextTurnId = TurnManager.getNextPlayerId(ctx);
    const isMe = props.playerId === localCtx.getVal(LocalField.Id);
    let panelColor = "";
    let subtitle = null;
    if (isMe) {
        //My panel has highest priority and is unselectable
        panelColor = classes.isMe;
        subtitle = "_me";
    } else if (props.playerId === currentTurnId) {
        panelColor = classes.currentTurn;
        subtitle = "_this_turn";
    } else if (props.playerId === nextTurnId) {
        panelColor = classes.nextTurn;
        subtitle = "_next_turn";
    }

    const namePanelClass = subtitle !== null ? classes.namePanelWithTitle : classes.namePanel;

    return (
        <div className={`${classes.clickContainer}`}>
            <HorizontalLayout className={`${classes.container} ${panelColor}`}>
                <img
                    src={`${CardPool.getCard(props.player.lastClaimed).getImage()}`}
                    alt="lastUsd"
                    className={`${classes.characterIcon}`}
                />
                <div className={`${classes.nameContainer}`}>
                    <p className={`${namePanelClass} `}>{props.player.name}</p>
                    <p className={`${classes.subtitle} `}>{subtitle === null ? "" : t(subtitle)}</p>
                </div>

                <div className={`${classes.iconPanel} `}>
                    <img alt="" src={`${getImage(Images.Card)}`} className={classes.icon}/>
                    <p className={classes.iconText}>
                        {DeckManager.playerAliveCardNum(deck, props.player.icard)}
                    </p>
                </div>
                <div className={`${classes.iconPanel} `}>
                    <img alt="" src={`${getImage(Images.Coin)}`} className={classes.icon}/>
                    <div className={classes.iconText}>{props.player.coins}</div>
                </div>
            </HorizontalLayout>
        </div>
    );
}
