import HorizontalLayout from "pages/components/ui/HorizontalLayout";
import classes from "pages/ingame/Right/GameDeckBoard/RevealedDeckDisplay/DeckItem.module.css";
import {CardRole} from "system/cards/Card";
import {IProps} from "system/types/CommonTypes";
import {useContext} from "react";
import RoomContext from "system/context/roomInfo/room-context";
import {CardPool} from "system/cards/CardPool";
import {DeckManager} from "system/cards/DeckManager";

type Prop = IProps & { card: CardRole };
export default function DeckItem(props: Prop): JSX.Element {
    const ctx = useContext(RoomContext);
    const deck = ctx.room.game.deck;
    const role = props.card;
    const card = CardPool.getCard(role);
    const deckTop = DeckManager.peekTopIndex(ctx);
    let counterText: string;
    //TODO do the iteration here
    if (role === CardRole.None) {
        counterText = `${(deck.length - deckTop)} in deck`;
    } else {
        const total = deck.length / 5;
        const count = DeckManager.countCards(deck, role);
        counterText = `${count} / ${total}`;
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
