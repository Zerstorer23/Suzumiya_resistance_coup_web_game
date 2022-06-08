import classes from "./PopUp.module.css";
import {Fragment, useContext} from "react";
import ReactDOM from "react-dom";
import {IProps} from "system/types/CommonTypes";
import {Player} from "system/GameStates/GameTypes";
import {CardRole} from "system/cards/Card";
import RoomContext from "system/context/roomInfo/room-context";
import {DeckManager} from "system/cards/DeckManager";
import {useTranslation} from "react-i18next";
import {formatInsert} from "lang/i18nHelper";
import {CardPool} from "system/cards/CardPool";
import {MyTimer} from "pages/components/ui/MyTimer/MyTimer";
import animClasses from "animation.module.css";

function Backdrop(props: IProps) {
    return (
        <div
            className={classes.backdrop}
            //            onClick={props.onClickBackdrop}
        />
    );
}

/*function ModalOverlay(props: IProps) {
    return (
        <div className={classes.modal}>
            <div className={classes.content}>{props.children}</div>

        </div>
    );
}*/

type GOprops = IProps & {
    player: Player;
    card1: CardRole;
    card2: CardRole;
};

function GameOverWindow(props: GOprops) {
    const {t} = useTranslation();
    return (
        <div className={`${classes.modal} ${animClasses.slideDown}`}>
            <div className={classes.content}>
                <p>{formatInsert(t, "_game_winner", props.player.name)}</p>
                <p>{formatInsert(t, "_game_cardUsed",
                    CardPool.getCard(props.card1).getName(t),
                    CardPool.getCard(props.card2).getName(t))}</p>
                <p>{t("_return_lobby")}</p><MyTimer/>
            </div>
        </div>
    );
}

export default function GameOverPopUp() {
    const home = document.getElementById("overlays") as HTMLElement;
    const ctx = useContext(RoomContext);
    const winnerID = DeckManager.checkGameOver(ctx);
    const player = ctx.room.playerMap.get(winnerID);
    if (player === undefined) return <Fragment/>;
    const playerCards: CardRole[] = DeckManager.peekCards(
        ctx.room.game.deck,
        player.icard,
        2
    );

    return (
        <Fragment>
            {ReactDOM.createPortal(<Backdrop/>, home)}
            {ReactDOM.createPortal(
                <GameOverWindow
                    player={player}
                    card1={playerCards[0]}
                    card2={playerCards[1]}
                />,
                home
            )}
            {/*{ReactDOM.createPortal(<ModalOverlay>{props.children}</ModalOverlay>, home)}*/}
        </Fragment>
    );
}
