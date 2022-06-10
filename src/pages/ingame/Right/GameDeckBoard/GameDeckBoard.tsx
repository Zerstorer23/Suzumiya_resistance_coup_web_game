import gc from "global.module.css";
import classes from "./GameDeckBoard.module.css";
import DeckItem from "pages/ingame/Right/GameDeckBoard/RevealedDeckDisplay/DeckItem";
import {CardRole} from "system/cards/Card";
import {useTranslation} from "react-i18next";

const cardsInDeck = [
    CardRole.None, CardRole.DEAD_Duke,
    CardRole.DEAD_Captain, CardRole.DEAD_Assassin,
    CardRole.DEAD_Contessa, CardRole.DEAD_Ambassador];

export default function GameDeckBoard(): JSX.Element {
    //pass deck
    const {t} = useTranslation();
    return (
        <div className={`${gc.round_border} ${gc.borderColor} ${classes.container}`}>
            <h6 className={classes.title}>{t("_revealed_cards")}</h6>
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
