import HorizontalLayout from "pages/components/ui/HorizontalLayout";
import classes from "./MiniPlayerItem.module.css";
import {IProps} from "system/types/CommonTypes";
import {Player} from "system/GameStates/GameTypes";
import {Fragment, useContext} from "react";
import RoomContext from "system/context/roomInfo/room-context";
import {DeckManager} from "system/cards/DeckManager";
import {Images} from "resources/Resources";
import gc from "global.module.css";
import ImageText from "pages/components/ui/ImageButton/ImageText";

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
        props.onSelect(props.playerId);
    }

    const baseIndex = props.index + 1;
    const mainText = (baseIndex <= 8) ? `[${baseIndex}] ${props.player.name}` : props.player.name;

    return (
        <div className={`${classes.clickContainer} ${gc.borderColor} ${classes.selectable}`} onClick={onClickPanel}>
            <HorizontalLayout className={`${classes.container}  `}>
                <p className={`${classes.namePanel}`}>{mainText}</p>
                <ImageText image={Images.Card} className={classes.icon}>
                    {DeckManager.playerAliveCardNum(deck, props.player.icard)}
                </ImageText>
                <ImageText image={Images.Coin} className={classes.icon}>
                    {props.player.coins}
                </ImageText>
            </HorizontalLayout>
        </div>
    );
}
