import HorizontalLayout from "pages/components/ui/HorizontalLayout";
import classes from "./MiniPlayerItem.module.css";
import {IProps} from "system/types/CommonTypes";
import {Player} from "system/GameStates/GameTypes";
import {Fragment, useContext} from "react";
import RoomContext from "system/context/roomInfo/room-context";
import {DeckManager} from "system/cards/DeckManager";
import getImage, {Images} from "resources/Resources";

type Props = IProps & {
    player: Player;
    onSelect: (id: string) => void;
    index: number;
    playerId: string;
};
export default function MiniPlayerItem(props: Props): JSX.Element {
    const ctx = useContext(RoomContext);
    const deck = ctx.room.game.deck;
    if (props.player.isSpectating) return <Fragment/>;

    function onClickPanel() {
        console.log("Select " + props.playerId);
        props.onSelect(props.playerId);
    }

    const baseIndex = props.index + 1;
    const mainText = (baseIndex <= 8) ? `[${baseIndex}] ${props.player.name}` : props.player.name;

    return (
        <div className={`${classes.clickContainer} ${classes.selectable}`} onClick={onClickPanel}>
            <HorizontalLayout className={`${classes.container}`}>
                <p className={`${classes.namePanel} `}>{mainText}</p>
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
