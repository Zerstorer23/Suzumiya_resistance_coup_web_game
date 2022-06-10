import HorizontalLayout from "pages/components/ui/HorizontalLayout";
import classes from "pages/ingame/Right/GameDeckBoard/RevealedDeckDisplay/DeckItem.module.css";
import {Card, CardRole} from "system/cards/Card";
import {IProps} from "system/types/CommonTypes";
import {useContext} from "react";
import RoomContext from "system/context/roomInfo/room-context";
import {DeckManager} from "system/cards/DeckManager";
import {useTranslation} from "react-i18next";
import {insert} from "lang/i18nHelper";
import useAnimFocus, {AnimType} from "system/hooks/useAnimFocus";

type Prop = IProps & { card: CardRole };
export default function DeckItem(props: Prop): JSX.Element {
    const ctx = useContext(RoomContext);
    const {t} = useTranslation();
    const deck = ctx.room.game.deck;
    const role = props.card;
    const deckTop = DeckManager.peekTopIndex(ctx);
    const total = deck.length / 5;
    const count = DeckManager.countCards(deck, role);
    const cssAnim = useAnimFocus(count, AnimType.ZoomIn);
    let counterText;
    if (role === CardRole.None) {
        counterText = <div className={`${classes.deckCounter} `}> {
            insert(t, "_cin_deck", (deck.length - deckTop))}
        </div>;
    } else {
        counterText = <div className={classes.numDeadPanel}>
            <div className={`${classes.numDead} ${cssAnim}`}>{count}</div>
            <div className={classes.numTotal}>
                / {total}
            </div>
        </div>;
    }
    return (
        <HorizontalLayout className={`${props.className} ${classes.itemContainer}`}>
            <img className={classes.itemImg} alt="card" src={`${Card.getImage(role)}`}/>
            <div className={classes.itemDescPanel}>
                {counterText}
            </div>
        </HorizontalLayout>);
}

