import HorizontalLayout from "pages/components/ui/HorizontalLayout";
import classes from "pages/ingame/Right/GameDeckBoard/RevealedDeckDisplay/DeckItem.module.css";
import {CardRole} from "system/cards/Card";
import {IProps} from "system/types/CommonTypes";
import {Fragment, useContext} from "react";
import RoomContext from "system/context/roomInfo/room-context";
import {CardPool} from "system/cards/CardPool";
import {DeckManager} from "system/cards/DeckManager";
import {useTranslation} from "react-i18next";
import {insert} from "lang/i18nHelper";

type Prop = IProps & { card: CardRole };
export default function DeckItem(props: Prop): JSX.Element {
    const ctx = useContext(RoomContext);
    const {t} = useTranslation();
    const deck = ctx.room.game.deck;
    const role = props.card;
    const card = CardPool.getCard(role);
    const deckTop = DeckManager.peekTopIndex(ctx);
    let counterText;
    //TODO do the iteration here
    if (role === CardRole.None) {
        counterText = <Fragment> {
            insert(t, "_cin_deck", (deck.length - deckTop))}
        </Fragment>;
    } else {
        const total = deck.length / 5;
        const count = DeckManager.countCards(deck, role);
        counterText = <Fragment><strong className={classes.numDead}>{count}</strong> / {total}</Fragment>;
    }
    return (
        <HorizontalLayout className={`${props.className} ${classes.itemContainer}`}>
            <img className={classes.itemImg} alt="card" src={`${card.getImage()}`}/>
            <div className={classes.itemDescPanel}>
                <p className={classes.itemDesc}>{counterText}</p>
            </div>
        </HorizontalLayout>
    );
}
