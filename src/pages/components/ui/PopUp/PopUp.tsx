import classes from "./PopUp.module.css";
import {Fragment, useContext, useEffect} from "react";
import ReactDOM from "react-dom";
import {IProps} from "system/types/CommonTypes";
import {Player} from "system/GameStates/GameTypes";
import {CardRole} from "system/cards/Card";
import RoomContext from "system/context/roomInfo/room-context";
import {DeckManager} from "system/cards/DeckManager";
import {useTranslation} from "react-i18next";
import {formatInsert} from "lang/i18nHelper";
import {cardPool} from "system/cards/CardPool";
import animClasses from "animation.module.css";
import LocalContext, {LocalField} from "system/context/localInfo/local-context";
import {DbReferences, ReferenceManager} from "system/Database/ReferenceManager";
import {MyTimer} from "pages/components/ui/MyTimer/MyTimer";
import {increaseWin} from "system/Database/Inalytics";

function Backdrop() {
    return (
        <div className={classes.backdrop}/>
    );
}


type GOprops = IProps & {
    player: Player;
    card1: CardRole;
    card2: CardRole;
};

function GameOverWindow(props: GOprops) {
    const {t} = useTranslation();
    return (
        <div className={`${classes.modal} ${animClasses.slideDown}`}>
            <p>{formatInsert(t, "_game_winner", props.player.name)}</p>
            <p>{formatInsert(t, "_game_cardUsed",
                cardPool.get(props.card1).getName(t),
                cardPool.get(props.card2).getName(t))}</p>
            <p>{t("_return_lobby")}<MyTimer/></p>
        </div>
    );
}

export default function GameOverPopUp() {
    const home = document.getElementById("overlays") as HTMLElement;
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const myId = localCtx.getVal(LocalField.Id);
    const winnerID = DeckManager.checkGameOver(ctx);
    const player = ctx.room.playerMap.get(winnerID);

    useEffect(() => {
        if (player === undefined) return;
        if (myId !== winnerID) return;
        increaseWin(playerCards);
        const ref = ReferenceManager.getPlayerFieldReference(winnerID, DbReferences.PLAYER_wins);
        ReferenceManager.atomicDeltaByRef(ref, 1);
    }, []);
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
        </Fragment>
    );
}
