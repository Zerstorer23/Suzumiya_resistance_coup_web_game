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

type Props = IProps & {
    player: Player;
    playerId: string;
};
export default function PlayerItem(props: Props): JSX.Element {
    const localCtx = useContext(LocalContext);
    const ctx = useContext(RoomContext);
    const deck = ctx.room.game.deck;
    if (props.player.isSpectating) return <Fragment/>;
    const currentTurnId = TurnManager.getCurrentPlayerId(ctx);
    const nextTurnId = TurnManager.getNextPlayerId(ctx);
    const isMe = props.playerId === localCtx.getVal(LocalField.Id);
    let panelColor = "";
    let subtitle = "";

    if (isMe) {
        //My panel has highest priority and is unselectable
        panelColor = classes.isMe;
        subtitle = "Me";
    } else if (props.playerId === currentTurnId) {
        panelColor = classes.currentTurn;
        subtitle = "This turn";
    } else if (props.playerId === nextTurnId) {
        panelColor = classes.nextTurn;
        subtitle = "Next turn";
    }

    const namePanelClass = subtitle.length <= 0 ? classes.namePanelWithTitle : classes.namePanel;
    
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
                    <p className={`${classes.subtitle} `}>{subtitle}</p>
                </div>

                <div className={`${classes.iconPanel} `}>
                    <img alt="" src={`${getImage(Images.Card)}`} className={classes.icon}/>
                    <p className={classes.iconText}>
                        {DeckManager.playerCardNum(deck, props.player.icard)}
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
