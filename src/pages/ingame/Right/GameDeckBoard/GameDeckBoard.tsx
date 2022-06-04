import gc from "global.module.css";
import classes from "./GameDeckBoard.module.css";
import DeckItem from "pages/ingame/Right/GameDeckBoard/RevealedDeckDisplay/DeckItem";
import {CardRole} from "system/cards/Card";

const cardsInDeck = [
    CardRole.None, CardRole.DEAD_Duke,
    CardRole.DEAD_Captain, CardRole.DEAD_Assassin,
    CardRole.DEAD_Contessa, CardRole.DEAD_Ambassador];

export default function GameDeckBoard(): JSX.Element {
    //pass deck
    return (
        <div className={`${gc.round_border} ${classes.container}`}>
            <h6 className={classes.title}>Revealed cards</h6>
            <div className={`${classes.gridContainer}`}>
                {cardsInDeck.map((role, index, array) => {
                    const baseIndex = index + 1;
                    const cssName = classes[`cell${baseIndex}`];
                    return <DeckItem key={index} className={`${classes.cell} ${cssName}`}
                                     card={role}/>;
                })}
            </div>
        </div>
    );
}
